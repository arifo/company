import React, { Component } from 'react';
import { Button, Card } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class EditCompany extends Component {
  onSave = values => {
    console.log(JSON.stringify(values));
  };

  onDelete = () => {
    console.log('Company Deleted');
  };

  render() {
    // const { type } = this.props.navigation.state.params;
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
                  value={values.description}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="description"
                  error={touched.description && errors.description}
                />
                <Button
                  title="Delete Company"
                  buttonStyle={{ backgroundColor: 'red' }}
                  // onPress={() =>
                  //   this.props.navigation.navigate('CompanyScreen', {
                  //     title: 'View Company',
                  //     type: 'view'
                  //   })
                  // }
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

export default EditCompany;
