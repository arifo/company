import React from 'react';
import { Text, Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class ForgotPassword extends React.Component {
  handleSubmit = values => {
    console.log(JSON.stringify(values));
  };

  render() {
    return (
      <Container
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '600' }}>Forgot your Password?</Text>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={this.handleSubmit}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email()
              .required()
          })}
          render={({
            values,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            setFieldTouched,
            isValid,
            isSubmitting
          }) => (
            <Card style={{ borderWidth: 1, width: '92%' }}>
              <InputForm
                label="Email"
                placeholder="example@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType={'next'}
                blurOnSubmit={false}
                value={values.email}
                onChange={setFieldValue}
                onTouch={setFieldTouched}
                name="email"
                error={touched.email && errors.email}
              />

              <Button
                title="Submit"
                buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
                //disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                onPress={handleSubmit}
              />
            </Card>
          )}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
});

export default connect(mapStateToProps)(ForgotPassword);
