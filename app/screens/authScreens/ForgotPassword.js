import React from 'react';
import { Text, Button, Card } from 'react-native-elements';
import { ScrollView } from 'react-native';
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

          backgroundColor: '#ffffff'
        }}
      >
        <ScrollView
          contentContainerStyle={{ width: '100%', alignItems: 'center' }}
          keyboardShouldPersistTaps="always"
        >
          <Text style={{ fontSize: 26, fontWeight: '600', marginVertical: 50 }}>
            Forgot your Password?
          </Text>
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
              <Card containerStyle={{ width: '100%' }}>
                <InputForm
                  label="Email"
                  placeholder="example@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType={'done'}
                  blurOnSubmit={false}
                  onSubmitEditing={handleSubmit}
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
  { forgotPassAction }
)(ForgotPassword);
