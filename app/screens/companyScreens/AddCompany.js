import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.passTextInput = null;
  }
  onSave = async values => {
    console.log(JSON.stringify(values));
    this.props.navigation.replace('ViewCompany', {
      title: `${values.name}`
    });
  };

  render() {
    return (
      <Container style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }}>
          <Formik
            initialValues={{ name: '', description: '' }}
            onSubmit={this.onSave}
            validationSchema={Yup.object().shape({
              name: Yup.string().required(),
              description: Yup.string().required()
            })}
            render={({ values, handleSubmit, setFieldValue, errors, touched, setFieldTouched }) => (
              <Card containerStyle={{ width: '92%' }}>
                <InputForm
                  label="Company Name"
                  containerStyle={{ marginBottom: 40 }}
                  placeholder="your company name..."
                  returnKeyType={'next'}
                  onSubmitEditing={event => {
                    this.passTextInput.focus();
                  }}
                  value={values.name}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="name"
                  error={touched.name && errors.name}
                />
                <InputForm
                  label="Description"
                  placeholder="company description"
                  containerStyle={{ marginBottom: 80 }}
                  returnKeyType={'done'}
                  inputRef={input => {
                    this.passTextInput = input;
                  }}
                  value={values.description}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="description"
                  error={touched.description && errors.description}
                />
                <Button
                  title="Save Company"
                  buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
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

export default AddCompany;
