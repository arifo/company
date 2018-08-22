import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
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

  onLogin = (values, bag) => {
    const { navigation } = this.props;
    this.props.loginAction(values, bag, navigation);
  };

  getFormValidationShape = () =>
    Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required()
    });

  navigateTo = url => () => {
    this.props.navigation.navigate(url);
  };

  renderFormik = ({
    values,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    isSubmitting
  }) => (
    <Card containerStyle={styles.cardContainer}>
      <InputForm
        label="Email"
        placeholder="example@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType={'next'}
        onSubmitEditing={() => {
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
        inputRef={input => {
          this.passTextInput = input;
        }}
        onSubmitEditing={handleSubmit}
        value={values.password}
        onChange={setFieldValue}
        onTouch={setFieldTouched}
        name="password"
        error={touched.password && errors.password}
      />

      <Button
        title="Login"
        buttonStyle={styles.loginButton}
        loading={isSubmitting}
        disabled={isSubmitting}
        onPress={handleSubmit}
      />
    </Card>
  );

  render() {
    return (
      <Container>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scollViewContainer}
          keyboardShouldPersistTaps="always"
        >
          <Text style={styles.loginText}>Login</Text>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={this.onLogin}
            validationSchema={this.getFormValidationShape()}
            render={this.renderFormik}
          />
          <Text style={styles.formText} onPress={this.navigateTo('ForgotPassword')}>
            Forgot your password
          </Text>
          <Text style={styles.formText} onPress={this.navigateTo('SignUp')}>
            Sign up
          </Text>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { loginAction }
)(LoginScreen);

const styles = StyleSheet.create({
  scrollView: { width: '100%' },
  scollViewContainer: { alignItems: 'center' },
  loginText: { fontSize: 26, fontWeight: '600', marginVertical: 30 },
  cardContainer: { width: '100%', marginTop: 0 },
  loginButton: { marginVertical: 20, backgroundColor: '#0082C0' },
  formText: { marginTop: 40, fontWeight: '400', color: '#0082C0' }
});
