import React, { Component } from 'react';
import { Button, Card, FormLabel, Slider, Text } from 'react-native-elements';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { connect } from 'react-redux';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';
import AddImageBox from '../../components/AddImageBox';

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.phoneTextInput = null;
    this.emailTextInput = null;
    this.depTextInput = null;
  }
  onSave = values => {
    this.props.navigation.replace('ViewEmployee', {
      title: `${values.name}`
    });
  };

  render() {
    return (
      <Container style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }}>
          <Formik
            initialValues={{
              name: '',
              phone: '',
              email: '',
              department: '',
              joinDate: '',
              rating: 10
            }}
            onSubmit={this.onSave}
            validationSchema={Yup.object().shape({
              name: Yup.string().required(),
              phone: Yup.string().required(),
              email: Yup.string()
                .email()
                .required(),
              department: Yup.string().required(),
              joinDate: Yup.string().notRequired(),
              rating: Yup.number().notRequired()
            })}
            render={({ values, handleSubmit, setFieldValue, errors, touched, setFieldTouched }) => (
              <Card containerStyle={{ width: '92%', marginBottom: 20 }}>
                <AddImageBox
                  size={0.35}
                  iconType="MaterialIcons"
                  iconName="add-a-photo"
                  iconSize={85}
                />
                <InputForm
                  label="Name"
                  placeholder="Employee name..."
                  onSubmitEditing={() => {
                    this.phoneTextInput.focus();
                  }}
                  returnKeyType={'next'}
                  value={values.name}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="name"
                  error={touched.name && errors.name}
                />
                <InputForm
                  label="Phone"
                  placeholder="phone number"
                  keyboardType="numeric"
                  returnKeyType={'next'}
                  inputRef={input => {
                    this.phoneTextInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.emailTextInput.focus();
                  }}
                  value={values.phone}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="phone"
                  error={touched.phone && errors.phone}
                />
                <InputForm
                  label="Email"
                  placeholder="example@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType={'next'}
                  inputRef={input => {
                    this.emailTextInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.depTextInput.focus();
                  }}
                  value={values.email}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="email"
                  error={touched.email && errors.email}
                />
                <InputForm
                  label="Department"
                  placeholder="Department"
                  returnKeyType={'done'}
                  inputRef={input => {
                    this.depTextInput = input;
                  }}
                  value={values.department}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="department"
                  error={touched.department && errors.department}
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
                  <FormLabel>Join date</FormLabel>
                  <DatePicker
                    style={{ width: 150 }}
                    date={values.joinDate}
                    mode="date"
                    androidMode="spinner"
                    placeholder="MM/DD/YYYY"
                    format="MM/DD/YYYY"
                    minDate="01-01-1920"
                    maxDate={moment(new Date()).format('MM/DD/YYYY')}
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
                    onDateChange={date => setFieldValue('joinDate', date)}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'flex-end',
                    flexDirection: 'row',
                    marginVertical: 8,
                    paddingRight: 13
                  }}
                >
                  <FormLabel>Rating</FormLabel>

                  <Text style={{ fontSize: 18, fontWeight: '500' }}>{values.rating}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    marginBottom: 30
                  }}
                >
                  <Slider
                    value={values.rating}
                    onValueChange={rate => setFieldValue('rating', rate)}
                    minimumValue={0}
                    maximumValue={100}
                    step={5}
                    thumbStyle={{
                      width: 20,
                      height: 30,
                      borderRadius: 1,
                      backgroundColor: '#838486'
                    }}
                    minimumTrackTintColor="#ec4c46"
                  />
                </View>
                <Button
                  title="Save Employee"
                  buttonStyle={{ marginVertical: 10, backgroundColor: '#0082C0' }}
                  // disabled={!isValid}
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
  company: state.app.companies
});

export default connect(mapStateToProps)(AddEmployee);
