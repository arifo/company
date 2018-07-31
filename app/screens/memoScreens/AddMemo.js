import React, { Component } from 'react';
import { ScrollView, View, LayoutAnimation, UIManager, StyleSheet } from 'react-native';
import { Button, Card, FormLabel, Text, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import ModalSelector from 'react-native-modal-selector';
import UUIDGenerator from 'react-native-uuid-generator';
import moment from 'moment';

import { addMemo } from '../../redux/actions';

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
  onSave = values => {
    console.log(JSON.stringify(values));
    this.saveNewMemo(values);
    // this.props.navigation.navigate('ViewMemo', {
    //   title: `${values.title}`
    // });
  };

  saveNewMemo = value => {
    const currentCompanyId = this.props.navigation.state.params.company.id;
    UUIDGenerator.getRandomUUID().then(uuid => {
      const newMemo = {
        id: uuid,
        title: value.title,
        note: value.note,
        reminders: value.reminders
      };
      // newArray.push(companyInfo);
      this.props.addMemo(newMemo, currentCompanyId);
      this.props.navigation.replace('ViewMemo', {
        title: `${newMemo.name}`,
        memo: newMemo
      });
    });
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
    const { employees, memos } = this.props.navigation.state.params.company;
    console.log('memos', memos, 'company', this.props.navigation.state.params.company);
    return (
      <Container style={{ alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="always">
          <Formik
            initialValues={{ title: '', note: '', reminders: [] }}
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
                  data={employees}
                  initValue="Select contact"
                  onChange={option => {
                    console.log(JSON.stringify(option));
                    alert(`${option.name} (${option})`);
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
                      const newArray = [...values.reminders];
                      newArray[0] = date;
                      setFieldValue('reminders', newArray);
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
              </Card>
            )}
          />
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  companie: state.app.companies
});

export default connect(
  mapStateToProps,
  { addMemo }
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
