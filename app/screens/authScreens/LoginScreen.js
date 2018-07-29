import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { loginAction } from '../../redux/actions';
import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.passTextInput = null;
  }
  componentDidUpdate() {
    const { loggedIn, navigation } = this.props;
    if (loggedIn) {
      navigation.navigate('App');
    }
  }
  onLogin = (values, bag) => {
    this.props.loginAction(values, bag);
  };

  render() {
    return (
      <Container
        style={{
          flex: 1,
          backgroundColor: '#ffffff'
        }}
      >
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center' }}
          keyboardShouldPersistTaps="always"
        >
          <Text style={{ fontSize: 26, fontWeight: '600', marginVertical: 50 }}>Login</Text>
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
              isSubmitting
            }) => (
              <Card containerStyle={{ width: '100%' }}>
                <InputForm
                  label="Email"
                  placeholder="example@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType={'next'}
                  onSubmitEditing={event => {
                    this.passTextInput.focus();
                  }}
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
                  returnKeyType={'next'}
                  inputRef={input => {
                    this.passTextInput = input;
                  }}
                  value={values.password}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="password"
                  error={touched.password && errors.password}
                />

                <Button
                  title="Login"
                  buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
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
        </ScrollView>
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
