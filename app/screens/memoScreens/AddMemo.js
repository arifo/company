import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, FormLabel } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class AddMemo extends Component {
  constructor(props) {
    super(props);
    this.noteTextInput = null;
  }
  onSave = async values => {
    console.log(JSON.stringify(values));
    this.props.navigation.navigate('ViewMemo', {
      title: `${values.title}`
    });
  };

  render() {
    return (
      <Container style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }}>
          <Formik
            initialValues={{ title: '', note: '', reminder: '' }}
            onSubmit={this.onSave}
            validationSchema={Yup.object().shape({
              title: Yup.string().required(),
              note: Yup.string().required(),
              reminder: Yup.string().notRequired()
            })}
            render={({
              values,
              handleSubmit,
              setFieldValue,
              errors,
              touched,
              setFieldTouched,
              isValid
            }) => (
              <Card containerStyle={{ width: '92%' }}>
                <InputForm
                  label="Memo"
                  placeholder="memo title..."
                  returnKeyType={'next'}
                  onSubmitEditing={event => {
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
                    paddingRight: 10,
                    marginBottom: 40
                  }}
                >
                  <FormLabel>Remider</FormLabel>
                  <DatePicker
                    style={{ width: 150 }}
                    date={values.reminder}
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
                    onDateChange={date => setFieldValue('reminder', date)}
                  />
                </View>
                <Button
                  title="Save Memo"
                  buttonStyle={{ marginVertical: 20, backgroundColor: 'blue' }}
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

export default AddMemo;
