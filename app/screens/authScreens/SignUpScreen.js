import React, { Component } from 'react';
import { Button, Text, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { signUpAction } from '../../redux/actions';
import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.passTextInput = null;
    this.confirmPassTextInput = null;
  }
  componentDidUpdate() {
    const { loggedIn, navigation } = this.props;
    if (loggedIn) {
      navigation.navigate('App');
    }
  }

  onSignUp = (values, bag) => {
    this.props.signUpAction(values, bag);
  };

  render() {
    return (
      <Container
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center' }}
          keyboardShouldPersistTaps="always"
        >
          <Text style={{ fontSize: 26, fontWeight: '600', marginVertical: 50 }}>Sign Up</Text>
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
                  returnKeyType={'next'}
                  inputRef={input => {
                    this.passTextInput = input;
                  }}
                  returnKeyType={'next'}
                  onSubmitEditing={event => {
                    this.confirmPassTextInput.focus();
                  }}
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
                  inputRef={input => {
                    this.confirmPassTextInput = input;
                  }}
                  value={values.confirmPassword}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="confirmPassword"
                  error={touched.confirmPassword && errors.confirmPassword}
                />

                <Button
                  title="Sign Up"
                  buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                />
              </Card>
            )}
          />
          <Button
            title="Cancel"
            buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
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
  { signUpAction }
)(SignUpScreen);
