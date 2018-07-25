import React, { Component } from 'react';
import { Alert, View } from 'react-native';
import { Button, Icon, Text, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { loginAction } from '../../redux/actions';
import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

const api = user =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (user.email === '123@123.com') {
        reject({ email: 'Email already exists' });
      } else {
        resolve();
      }
    }, 3000);
  });

class LoginScreen extends Component {
  onLogin = async (values, bag) => {
    try {
      await api(values);
      this.props.loginAction();
      if (this.props.loggedIn) {
        this.props.navigation.navigate('App');
      }
      Alert.alert('Welcome User');
    } catch (error) {
      bag.setSubmitting(false);
      bag.setErrors(error);
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
        <Text style={{ fontSize: 26, fontWeight: '600' }}>Login</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={this.onLogin}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email()
              .required(),
            password: Yup.string()
              .min(6)
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

              <Button
                title="Login"
                buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
                //disabled={!isValid || isSubmitting}
                loading={isSubmitting}
                onPress={handleSubmit}
              />
            </Card>
          )}
        />
        <Text
          style={{ marginTop: 40, fontWeight: '400', color: '#0082C0' }}
          onPress={() => {
            this.props.navigation.navigate('ForgotPassword');
          }}
        >
          Forgot your password
        </Text>
        <Text
          style={{ marginTop: 40, fontWeight: '400', color: '#0082C0' }}
          onPress={() => {
            this.props.navigation.navigate('SignUp');
          }}
        >
          Sign up
        </Text>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
});

export default connect(
  mapStateToProps,
  { loginAction }
)(LoginScreen);
