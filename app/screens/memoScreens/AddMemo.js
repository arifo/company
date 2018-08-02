import React, { Component } from 'react';
import { ScrollView, View, LayoutAnimation, UIManager, StyleSheet, Alert } from 'react-native';
import { Button, Card, FormLabel, Text, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import ModalSelector from 'react-native-modal-selector';
import UUIDGenerator from 'react-native-uuid-generator';
import moment from 'moment';
import { NavigationActions, StackActions } from 'react-navigation';

import {
  addMemo,
  editMemo,
  deleteMemo,
  toggleMemoFetching,
  getCurrentMemo
} from '../../redux/actions';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class AddMemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textInputValue: '',
      reminders: []
    };
    this.noteTextInput = null;
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  componentDidUpdate() {
    const { type } = this.props.navigation.state.params;
    if (type === 'edit' && !this.props.isFetching) {
      this.resetStack(this.props.currentMemo, this.props.currentCompany);
    }
  }

  onSave = values => {
    const { type } = this.props.navigation.state.params;
    return type === 'edit' ? this.saveEditMemo(values) : this.saveNewMemo(values);
  };

  resetStack = (item, currentCompany) => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 2,
        actions: [
          NavigationActions.navigate({
            routeName: 'Companies'
          }),
          NavigationActions.navigate({
            routeName: 'ViewCompany',
            params: {
              title: currentCompany.name,
              companyID: currentCompany.id
            }
          }),
          NavigationActions.navigate({
            routeName: 'ViewMemo',
            params: {
              title: item.title,
              memoID: item.id
            }
          })
        ]
      })
    );
  };

  saveNewMemo = value => {
    const { id } = this.props.currentCompany;
    UUIDGenerator.getRandomUUID().then(uuid => {
      const memo = {
        id: uuid,
        companyID: id,
        title: value.title,
        note: value.note,
        reminders: value.reminders,
        contact: value.contact,
        createdAt: moment().valueOf(),
        lastModified: ''
      };
      this.props.addMemo(memo, uuid);
      this.resetStack(memo, this.props.currentCompany);
    });
  };

  saveEditMemo = value => {
    this.props.toggleMemoFetching(true);
    const { id } = this.props.currentMemo;
    const lastModified = moment().valueOf();
    this.props.editMemo(value, id, lastModified);
    this.props.getCurrentMemo(id);
  };

  deleteCurrentMemo = () => {
    Alert.alert(
      'Are sure you want to Delete?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            this.props.deleteMemo(this.props.currentMemo);
            this.resetStackAfterDeletion(this.props.currentCompany);
          }
        },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') }
      ],
      { cancelable: true }
    );
  };

  resetStackAfterDeletion = currentCompany => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({
            routeName: 'Companies'
          }),
          NavigationActions.navigate({
            routeName: 'ViewCompany',
            params: {
              title: currentCompany.name,
              companyID: currentCompany.id
            }
          })
        ]
      })
    );
  };

  addReminder() {
    const reminder = '';
    const reminders = this.state.reminders;
    reminders.push(reminder);
    this.setState({ reminders });
  }
  deleteReminder(key) {
    const reminders = this.state.reminders;
    reminders.splice(key, 1);
    this.setState({ reminders });
  }

  render() {
    const { type } = this.props.navigation.state.params;
    const { title, note, reminders, contact } = this.props.currentMemo;
    console.log('this.props.is fetching', this.props.isFetching);
    return (
      <Container style={{ alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="always">
          <Formik
            initialValues={
              type === 'edit'
                ? {
                    title,
                    note,
                    reminders,
                    contact
                  }
                : {
                    title: '',
                    note: '',
                    reminders: [],
                    contact: {}
                  }
            }
            onSubmit={this.onSave}
            validationSchema={Yup.object().shape({
              title: Yup.string().required(),
              note: Yup.string().required()
            })}
            render={({ values, handleSubmit, setFieldValue, errors, touched, setFieldTouched }) => (
              <Card containerStyle={{ width: '92%' }}>
                <ModalSelector
                  keyExtractor={employee => `${employee.id}`}
                  labelExtractor={employee => `${employee.name}`}
                  data={this.props.employees}
                  selectStyle={{ backgroundColor: 'red' }}
                  selectedItemTextStyle={{ color: 'yellow' }}
                  initValue={type === 'edit' ? `${contact.name}` : 'Select contact'}
                  onChange={select => {
                    const info = {
                      id: select.id,
                      name: select.name,
                      phone: select.phone,
                      email: select.email
                    };
                    setFieldValue('contact', info);
                  }}
                />
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
                <View style={styles.reminderContainerStyle}>
                  <FormLabel>Remider</FormLabel>
                  <DatePicker
                    style={{ width: 200 }}
                    date={values.reminders[0]}
                    mode="datetime"
                    androidMode="spinner"
                    placeholder="MM/DD/YYYY HH:mm"
                    format="MM/DD/YYYY HH:mm"
                    minDate="01-01-1920"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={date => {
                      if (date) {
                        const newArray = [...values.reminders];
                        newArray[0] = date;
                        setFieldValue('reminders', newArray);
                      }
                    }}
                  />
                </View>
                {this.state.reminders.map((v, key) => (
                  <View key={key} style={styles.newReminderContainer}>
                    <DatePicker
                      style={{ width: 200 }}
                      date={values.reminders[key + 1]}
                      mode="datetime"
                      androidMode="spinner"
                      placeholder="MM/DD/YYYY HH:mm"
                      format="MM/DD/YYYY HH:mm"
                      minDate="01-01-1920"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      onDateChange={date => {
                        const newArray = [...values.reminders];
                        newArray.push(date);
                        setFieldValue('reminders', newArray);
                      }}
                    />
                    <Icon
                      name="minus-circle"
                      type="feather"
                      size={30}
                      color={'#b7bbbf'}
                      onPress={() => {
                        const newArray = [...values.reminders];
                        newArray.splice(key + 1, 1);
                        this.deleteReminder(key);
                        setFieldValue('reminders', newArray);
                      }}
                    />
                  </View>
                ))}
                {this.state.reminders.length <= 4 ? (
                  <View style={styles.addReminderContainer}>
                    <Text style={styles.addTextStyle}>add reminder</Text>
                    <Icon
                      name="plus-circle"
                      type="feather"
                      size={30}
                      color={'#b7bbbf'}
                      onPress={() => {
                        this.addReminder();
                      }}
                    />
                  </View>
                ) : null}

                <Button title="Save Memo" buttonStyle={styles.button} onPress={handleSubmit} />
                {type === 'edit' ? (
                  <Button
                    title="Delete"
                    buttonStyle={{ backgroundColor: 'red' }}
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
  currentMemo: state.memo.currentMemo,
  isFetching: state.memo.isFetching,
  currentCompany: state.company.currentCompany,
  employees: state.employee.employees
});

export default connect(
  mapStateToProps,
  { addMemo, editMemo, deleteMemo, toggleMemoFetching, getCurrentMemo }
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
