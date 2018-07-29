import React, { Component } from 'react';
import { ScrollView, View, LayoutAnimation, UIManager } from 'react-native';
import { Button, Card, FormLabel, Text, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import DatePicker from 'react-native-datepicker';
import ModalSelector from 'react-native-modal-selector';
import moment from 'moment';

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
  onSave = async values => {
    console.log(JSON.stringify(values));
    this.props.navigation.navigate('ViewMemo', {
      title: `${values.title}`
    });
  };

  addReminder() {
    const reminder = {};
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
    const { employees } = this.props.navigation.state.params.company;
    return (
      <Container style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="always">
          <Formik
            initialValues={{ title: '', note: '', reminder: '', reminders: [] }}
            onSubmit={this.onSave}
            validationSchema={Yup.object().shape({
              title: Yup.string().required(),
              note: Yup.string().required(),
              reminder: Yup.string().notRequired()
            })}
            render={({ values, handleSubmit, setFieldValue, errors, touched, setFieldTouched }) => (
              <Card containerStyle={{ width: '92%' }}>
                <ModalSelector
                  keyExtractor={employee => `${employee.id}`}
                  labelExtractor={employee => `${employee.name}`}
                  data={employees}
                  touchableStyle={{}}
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
                  onSubmitEditing={() => {
                    this.noteTextInput.focus();
                  }}
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
                  returnKeyType={'done'}
                  inputRef={input => {
                    this.noteTextInput = input;
                  }}
                  value={values.note}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="note"
                  error={touched.note && errors.note}
                />
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                    paddingRight: 10
                  }}
                >
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
                    customStyles={{
                      dateIcon: {
                        alignSelf: 'flex-end'
                      },
                      dateInput: {
                        marginLeft: 0
                      }
                    }}
                    onDateChange={date => {
                      const newArray = [...values.reminders];
                      newArray[0] = date;
                      setFieldValue('reminders', newArray);
                    }}
                  />
                </View>
                {this.state.reminders.map((v, key) => (
                  <View
                    key={key}
                    style={{
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      marginTop: 10,
                      paddingHorizontal: 15
                    }}
                  >
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
                      customStyles={{
                        dateIcon: {
                          alignSelf: 'flex-end'
                        },
                        dateInput: {
                          marginLeft: 0
                        }
                      }}
                      onDateChange={date => {
                        const newArray = [...values.reminders];
                        newArray[key + 1] = date;
                        setFieldValue('reminders', newArray);
                      }}
                    />
                    <Icon
                      name="minus-circle"
                      type="feather"
                      size={30}
                      color={'#b7bbbf'}
                      onPress={() => {
                        this.deleteReminder(key);
                      }}
                    />
                  </View>
                ))}
                {this.state.reminders.length <= 4 ? (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      marginTop: 10,
                      paddingHorizontal: 15
                    }}
                  >
                    <Text style={{ fontSize: 16, paddingHorizontal: 10, color: '#b7bbbf' }}>
                      add reminder
                    </Text>
                    <Icon
                      name="plus-circle"
                      type="feather"
                      size={30}
                      color={'#b7bbbf'}
                      onPress={() => {
                        const remindersArray = values.reminders.push(values.reminder);
                        this.addReminder();
                      }}
                    />
                  </View>
                ) : null}

                <Button
                  title="Save Memo"
                  buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0', marginTop: 40 }}
                  onPress={handleSubmit}
                />
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

export default connect(mapStateToProps)(AddMemo);
