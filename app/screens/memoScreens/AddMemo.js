import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Button, Card, FormLabel, Text, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import firebase from 'firebase';
import ModalSelector from 'react-native-modal-selector';
import UUIDGenerator from 'react-native-uuid-generator';
import moment from 'moment';
import _ from 'lodash';
import PushNotification from 'react-native-push-notification';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { addMemo, editMemo, deleteMemo } from '../../redux/actions';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class AddMemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInputValue: '',
      reminders: [],
      notificationsToDelete: ['', '', '', '', ''],
      isDateTimePickerVisible: false
    };
    this.noteTextInput = null;
  }

  componentDidMount() {
    const { type, memoID } = this.props.navigation.state.params;
    if (type === 'edit') {
      const { reminders } = this.props.memo[memoID];
      if (reminders) {
        this.setState({ reminders });
      }
    }
    if (type !== 'edit') {
      this.setState({ reminders: [''] });
    }
  }

  onSave = values => {
    const { type } = this.props.navigation.state.params;
    return type === 'edit' ? this.saveEditMemo(values) : this.saveNewMemo(values);
  };

  scheduleNotif(reminders, id, memo, company) {
    const thenum = id.replace(/\D+/g, '').slice(0, 5);
    const now = new Date(Date.now());
    reminders.map((val, key) => {
      const reminderDate = new Date(val);

      if (now < reminderDate) {
        PushNotification.localNotificationSchedule({
          date: reminderDate,
          title: company.name,
          message: memo.title,
          repeatType: 'minute',
          id: `${thenum}${key}`,
          tag: id,
          group: company.id
        });
      }
    });
  }

  cancelNotif(id) {
    PushNotification.cancelLocalNotifications({ id });
  }

  saveNewMemo = value => {
    const { companyID } = this.props.navigation.state.params;
    const { navigation, company } = this.props;
    const reminders =
      this.state.reminders[this.state.reminders.length - 1] === ''
        ? _.dropRight(this.state.reminders)
        : this.state.reminders;

    UUIDGenerator.getRandomUUID().then(uuid => {
      const memo = {
        id: uuid,
        companyID,
        title: value.title,
        note: value.note,
        reminders,
        contact: value.contact,
        createdAt: moment().valueOf(),
        lastModified: '',
        user: firebase.auth().currentUser.uid
      };
      this.props.addMemo(memo, uuid, navigation);
      this.scheduleNotif(reminders, uuid, memo, company[companyID]);
    });
  };

  saveEditMemo = value => {
    const { memoID, companyID } = this.props.navigation.state.params;
    const thenum = memoID.replace(/\D+/g, '').slice(0, 5);

    this.state.notificationsToDelete.map((val, key) => {
      const nId = `${thenum}${key}`;
      this.cancelNotif(nId);
    });

    const lastModified = moment().valueOf();
    const reminders =
      this.state.reminders[this.state.reminders.length - 1] === ''
        ? _.dropRight(this.state.reminders)
        : this.state.reminders;
    this.props.editMemo(value, memoID, reminders, lastModified, this.props.navigation);

    this.scheduleNotif(reminders, memoID, value, this.props.company[companyID]);
  };

  deleteCurrentMemo = () => {
    Alert.alert(
      'Are sure you want to Delete?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            const { memoID } = this.props.navigation.state.params;
            const memoToDelete = this.props.memo[memoID];
            const thenum = memoID.replace(/\D+/g, '').slice(0, 5);
            this.state.notificationsToDelete.map((val, key) => {
              const nId = `${thenum}${key}`;
              this.cancelNotif(nId);
            });
            this.props.deleteMemo(memoToDelete, this.props.navigation);
          }
        },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') }
      ],
      { cancelable: true }
    );
  };

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  renderDate = key => moment(`${this.state.reminders[key]}`).format('M/DD/YYYY HH:mm');

  render() {
    const { type, memoID, companyID } = this.props.navigation.state.params;
    let data = this.props.employees;
    data = _.pickBy(data, (val, key) => val.companyID === companyID);
    data = _.map(data, (val, key) => val);

    return (
      <Container style={{ alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="always">
          <Formik
            initialValues={
              type === 'edit' && this.props.memo[memoID]
                ? {
                    title: this.props.memo[memoID].title,
                    note: this.props.memo[memoID].note,
                    contact: this.props.memo[memoID].contact
                  }
                : {
                    title: '',
                    note: '',
                    contact: {}
                  }
            }
            onSubmit={this.onSave}
            validationSchema={Yup.object().shape({
              title: Yup.string().required(),
              note: Yup.string().required()
            })}
            render={({
              values,
              handleSubmit,
              setFieldValue,
              errors,
              touched,
              setFieldTouched,
              isSubmitting
            }) => (
              <Card containerStyle={{ width: '92%' }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
                  <ModalSelector
                    style={{ flex: 1 }}
                    keyExtractor={employee => `${employee.id}`}
                    labelExtractor={employee => `${employee.name}`}
                    data={data}
                    initValue={
                      _.isEmpty(values.contact) ? 'Select contact' : `${values.contact.name}`
                    }
                    onChange={select => {
                      const info = {
                        id: select.id,
                        name: select.name,
                        phone: select.phone,
                        email: select.email,
                        avatar: select.avatar
                      };
                      setFieldValue('contact', info);
                    }}
                  />
                  {values.contact ? (
                    <Icon
                      containerStyle={{ marginLeft: 10 }}
                      name="minus"
                      type="simple-line-icon"
                      size={28}
                      color={'#b7bbbf'}
                      onPress={() => setFieldValue('contact', '')}
                    />
                  ) : null}
                </View>

                <InputForm
                  label="Memo"
                  placeholder="memo title..."
                  returnKeyType={'next'}
                  onSubmitEditing={() => this.noteTextInput.focus()}
                  value={values.title}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="title"
                  error={touched.title && errors.title}
                />
                <InputForm
                  label="Note"
                  placeholder="note ..."
                  multiline
                  inputRef={input => {
                    this.noteTextInput = input;
                  }}
                  returnKeyType={'done'}
                  value={values.note}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="note"
                  error={touched.note && errors.note}
                />
                <FormLabel>Remider</FormLabel>
                {this.state.reminders.map((v, key) => (
                  <View key={key} style={styles.newReminderContainer}>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={this.showDateTimePicker}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: 12
                        }}
                      >
                        <View
                          style={{
                            marginRight: 8,
                            borderBottomWidth: 1,
                            borderBottomColor: 'rgba(0,0,0,.1)'
                          }}
                        >
                          {this.state.reminders[key] ? (
                            <Text>{this.renderDate(key)}</Text>
                          ) : (
                            <Text>M/DD/YYYY HH:mm</Text>
                          )}
                        </View>
                        <Icon name="calendar" type="font-awesome" size={32} color={'#008fff'} />
                      </TouchableOpacity>
                      <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        mode="datetime"
                        onCancel={this.hideDateTimePicker}
                        onConfirm={date => {
                          const newArray = this.state.reminders;
                          newArray[key] = date.toISOString();
                          this.setState({ reminders: newArray });

                          this.hideDateTimePicker();
                        }}
                      />
                    </View>
                    <Icon
                      name="minus"
                      type="simple-line-icon"
                      size={28}
                      color={'#b7bbbf'}
                      onPress={() => {
                        const newArray = this.state.reminders;
                        newArray.splice(key, 1);
                        this.setState({ reminders: newArray });
                      }}
                    />
                  </View>
                ))}
                {this.state.reminders.length <= 4 &&
                this.state.reminders[this.state.reminders.length - 1] !== '' ? (
                  <View style={styles.addReminderContainer}>
                    <Text
                      onPress={() => {
                        const newArray = this.state.reminders;
                        newArray.push('');
                        this.setState({ reminders: newArray });
                      }}
                      style={styles.addTextStyle}
                    >
                      Add reminder
                    </Text>
                    <Icon
                      name="plus"
                      type="simple-line-icon"
                      size={28}
                      color={'#b7bbbf'}
                      onPress={() => {
                        const newArray = this.state.reminders;
                        newArray.push('');
                        this.setState({ reminders: newArray });
                      }}
                    />
                  </View>
                ) : null}
                {this.state.reminders.length > 1 ? (
                  <View style={[styles.addReminderContainer, { paddingVertical: 15 }]}>
                    <Text
                      onPress={() => {
                        this.setState({ reminders: [] });
                      }}
                      style={[styles.addTextStyle, { color: 'red' }]}
                    >
                      Delete all reminders
                    </Text>
                    <Icon name="close" type="simple-line-icon" size={28} color={'red'} />
                  </View>
                ) : null}

                <Button
                  title="Save Memo"
                  buttonStyle={styles.button}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />
                {type === 'edit' ? (
                  <Button
                    title="Delete"
                    buttonStyle={{ backgroundColor: 'red', marginTop: 10 }}
                    onPress={this.deleteCurrentMemo}
                  />
                ) : null}
              </Card>
            )}
          />
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  memo: state.memo.memos,
  employees: state.employee.employees,
  company: state.company.companies
});

export default connect(
  mapStateToProps,
  { addMemo, editMemo, deleteMemo }
)(AddMemo);

const styles = StyleSheet.create({
  reminderContainerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingRight: 10
  },
  newReminderContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 15
  },
  addReminderContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 15
  },
  addTextStyle: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#b7bbbf'
  },
  button: {
    marginVertical: 20,
    backgroundColor: '#0082C0',
    marginTop: 40
  }
});
