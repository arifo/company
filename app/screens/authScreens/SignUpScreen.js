import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { Button, Icon, Text, Card } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';
import RootNavigator from '../../navigation/RootNavigator';

class SignUpScreen extends Component {
  onSignUp = values => {
    this.props.loginAction();
    if (this.props.loggedIn) {
      this.props.navigation.navigate('App');
    }
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
        <Text style={{ fontSize: 26, fontWeight: '600' }}>Sign Up</Text>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          onSubmit={this.onSignUp}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email()
              .required(),
            password: Yup.string()
              .min(6)
              .required(),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('password', null)], 'Confirmed password must match Password')
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
              <InputForm
                label="Password"
                placeholder="password"
                autoCapitalize="none"
                secureTextEntry
                returnKeyType={'done'}
                value={values.password}
                onChange={setFieldValue}
                onTouch={setFieldTouched}
                name="password"
                error={touched.password && errors.password}
              />
              <InputForm
                label="Confirm Password"
                placeholder="confirm password"
                autoCapitalize="none"
                secureTextEntry
                returnKeyType={'done'}
                value={values.confirmPassword}
                onChange={setFieldValue}
                onTouch={setFieldTouched}
                name="confirmPassword"
                error={touched.confirmPassword && errors.confirmPassword}
              />

              <Button
                title="Sign Up"
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

export default SignUpScreen;
