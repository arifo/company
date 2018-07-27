import React, { Component } from 'react';
import { Button, Card, FormLabel, Rating } from 'react-native-elements';
import { ScrollView, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class EditEmployee extends Component {
  onSave = values => {
    this.props.navigation.navigate('ViewEmployee', {
      title: `${values.name}`
    });
  };
  onDelete = () => {};
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
              rating: 2.5
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
                <InputForm
                  label="Name"
                  placeholder="Employee name..."
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
                  value={values.email}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="email"
                  error={touched.email && errors.email}
                />
                <InputForm
                  label="Department"
                  placeholder="Department"
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
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 8,
                    paddingRight: 13
                  }}
                >
                  <FormLabel>Rating</FormLabel>
                  <Rating
                    type="star"
                    fractions={1}
                    startingValue={values.rating}
                    imageSize={25}
                    onFinishRating={setFieldValue}
                    style={{ paddingVertical: 10 }}
                  />
                </View>
                <Button
                  title="Delete Employee"
                  buttonStyle={{ backgroundColor: 'red' }}
                  onPress={this.onDelete}
                />
              </Card>
            )}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default EditEmployee;
