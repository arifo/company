import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Alert, TouchableOpacity, Picker } from 'react-native';
import { Button, Card, FormLabel, Text, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
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
      interval: 120000,
      notificationsToDelete: ['', '', '', '', ''],
      isDateTimePickerVisible: { show: false, key: 0 }
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
      this.setState({ reminders: [] });
    }
  }

  onSave = values => {
    const { type } = this.props.navigation.state.params;
    return type === 'edit' ? this.saveEditMemo(values) : this.saveNewMemo(values);
  };

  scheduleNotif(reminders, id, memo, company) {
    const notificationId = id.replace(/\D+/g, '').slice(0, 5);
    const now = new Date(Date.now());
    reminders.filter(val => now < new Date(val)).forEach((val, key) => {
      PushNotification.localNotificationSchedule({
        date: new Date(val),
        title: company.name,
        message: memo.title,
        repeatType: 'time',
        repeatTime: this.state.interval,
        vibrate: true,
        vibration: 500,
        id: `${notificationId}${key}`,
        memoID: id,
        companyID: company.id
      });
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
    const memo = this.props.memo[memoID];
    const notificationId = memoID.replace(/\D+/g, '').slice(0, 5);

    this.state.notificationsToDelete.forEach((val, key) => {
      const nId = `${notificationId}${key}`;
      this.cancelNotif(nId);
    });

    const lastModified = moment().valueOf();
    const reminders =
      this.state.reminders[this.state.reminders.length - 1] === ''
        ? _.dropRight(this.state.reminders)
        : this.state.reminders;

    this.props.editMemo(value, memo, reminders, lastModified, this.props.navigation);

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
            const notificationId = memoID.replace(/\D+/g, '').slice(0, 5);
            this.state.notificationsToDelete.map((val, key) => {
              const nId = `${notificationId}${key}`;
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

  showDateTimePicker = key => this.setState({ isDateTimePickerVisible: { show: true, key } });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: { show: false, key: 0 } });

  formatDate = reminder => moment(`${reminder}`).format('M/DD/YYYY HH:mm');

  canAddReminder = () =>
    this.state.reminders.length <= 4 &&
    this.state.reminders[this.state.reminders.length - 1] !== '';

  handleAddReminder = () => {
    const newArray = this.state.reminders;
    newArray.push('');
    this.setState({ reminders: newArray });
  };
  renderReminder = (reminder, key) => (
    <View key={key} style={styles.newReminderContainer}>
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => this.showDateTimePicker(key)} style={styles.reminder}>
          <View style={styles.reminderText}>
            <Text>{reminder ? this.formatDate(reminder) : 'M/DD/YYYY HH:mm'}</Text>
          </View>
          <Icon name="calendar" type="font-awesome" size={32} color={'#008fff'} />
        </TouchableOpacity>
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
  );

  renderFormik = ({
    values,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    isSubmitting
  }) => {
    const { type, companyID } = this.props.navigation.state.params;
    let data = this.props.employees;
    data = _.pickBy(data, val => val.companyID === companyID);
    data = _.map(data, val => val);
    return (
      <Card containerStyle={{ width: '92%' }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: 15 }}>
          <ModalSelector
            style={{ flex: 1 }}
            keyExtractor={employee => `${employee.id}`}
            labelExtractor={employee => `${employee.name}`}
            data={data}
            initValue={_.isEmpty(values.contact) ? 'Select contact' : `${values.contact.name}`}
            onChange={select => setFieldValue('contact', Object.assign({}, select))}
          />
          {!_.isEmpty(values.contact) && (
            <IconButton onPress={() => setFieldValue('contact', '')} />
          )}
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
          inputRef={i => (this.noteTextInput = i)}
          returnKeyType={'done'}
          value={values.note}
          onChange={setFieldValue}
          onTouch={setFieldTouched}
          name="note"
          error={touched.note && errors.note}
        />
        <FormLabel>Remider</FormLabel>
        {this.state.reminders.map((reminder, key) => this.renderReminder(reminder, key))}
        <DateTimePicker
          is24Hour={false}
          date={new Date()}
          isVisible={this.state.isDateTimePickerVisible.show}
          mode="datetime"
          minimumDate={new Date(Date.now())}
          onCancel={this.hideDateTimePicker}
          onConfirm={date => {
            if (date > new Date()) {
              const newArray = this.state.reminders;
              newArray[this.state.isDateTimePickerVisible.key] = date.toISOString();
              this.setState({ reminders: newArray });
            }

            this.hideDateTimePicker();
          }}
        />
        {this.canAddReminder() && (
          <View style={styles.addReminderContainer}>
            <Text onPress={this.handleAddReminder} style={styles.addTextStyle}>
              Add reminder
            </Text>
            <IconButton name={'plus'} onPress={this.handleAddReminder} />
          </View>
        )}
        {this.state.reminders.length > 1 && (
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
        )}
        <FormLabel>Notification Interval</FormLabel>
        <View style={styles.addReminderContainer}>
          <Picker
            selectedValue={this.state.interval}
            style={{ height: 50, width: 180 }}
            onValueChange={(interval, i) => this.setState({ interval })}
          >
            <Picker.Item label="1 minute" value={1 * 60000} />
            <Picker.Item label="2 minutes" value={2 * 60000} />
            <Picker.Item label="10 minutes" value={10 * 60000} />
            <Picker.Item label="30 minutes" value={30 * 60000} />
            <Picker.Item label="1 hour" value={60 * 60000} />
          </Picker>
        </View>
        <Button
          title="Save Memo"
          buttonStyle={styles.button}
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
        {type === 'edit' && (
          <Button
            title="Delete"
            buttonStyle={{ backgroundColor: 'red', marginTop: 10 }}
            onPress={this.deleteCurrentMemo}
          />
        )}
      </Card>
    );
  };

  render() {
    const { memoID } = this.props.navigation.state.params;
    return (
      <Container style={{ alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="always">
          <Formik
            initialValues={Object.assign(
              { title: '', note: '', contact: {} },
              this.props.memo[memoID]
            )}
            onSubmit={this.onSave}
            validationSchema={Yup.object().shape({
              title: Yup.string().required(),
              note: Yup.string().required()
            })}
            render={this.renderFormik}
          />
        </ScrollView>
      </Container>
    );
  }
}

const IconButton = ({ onPress, name = 'minus' }) => (
  <Icon
    containerStyle={{ marginLeft: 10 }}
    name={name}
    type="simple-line-icon"
    size={28}
    color={'#b7bbbf'}
    onPress={() => onPress()}
  />
);

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
  },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 12
  },
  reminderText: {
    marginRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)'
  }
});
