import React, { Component } from 'react';
import { Button, Text, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { ScrollView, StyleSheet } from 'react-native';
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

  onSignUp = (values, bag) => {
    const { navigation } = this.props;
    this.props.signUpAction(values, bag, navigation);
  };

  getValidationScheme = () =>
    Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password', null)], 'Confirmed password must match Password')
        .required()
    });

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
        onSubmitEditing={() => this.passTextInput.focus()}
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
        inputRef={input => (this.passTextInput = input)}
        returnKeyType={'next'}
        onSubmitEditing={() => this.confirmPassTextInput.focus()}
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
        inputRef={input => (this.confirmPassTextInput = input)}
        onSubmitEditing={handleSubmit}
        value={values.confirmPassword}
        onChange={setFieldValue}
        onTouch={setFieldTouched}
        name="confirmPassword"
        error={touched.confirmPassword && errors.confirmPassword}
      />

      <Button
        title="Sign Up"
        buttonStyle={styles.signUpButton}
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
          <Text style={styles.signUpText}>Sign Up</Text>
          <Formik
            initialValues={{ email: '', password: '', confirmPassword: '' }}
            onSubmit={this.onSignUp}
            validationSchema={this.getValidationScheme()}
            render={this.renderFormik}
          />
          <Button
            title="Cancel"
            buttonStyle={styles.signUpButton}
            onPress={() => this.props.navigation.goBack()}
          />
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { signUpAction }
)(SignUpScreen);

const styles = StyleSheet.create({
  scrollView: { width: '100%' },
  scollViewContainer: { alignItems: 'center' },
  signUpText: { fontSize: 26, fontWeight: '600', marginVertical: 30 },
  cardContainer: { width: '100%', marginTop: 0 },
  signUpButton: { marginVertical: 20, backgroundColor: '#0082C0' }
});
