import React from 'react';
import { Text, Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { forgotPassAction } from '../../redux/actions';
import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

class ForgotPassword extends React.Component {
  handleSubmit = (values, bag) => {
    this.props.forgotPassAction(values, bag, this.props.navigation);
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
                loading={isSubmitting}
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
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
});

export default connect(
  mapStateToProps,
  { forgotPassAction }
)(ForgotPassword);
