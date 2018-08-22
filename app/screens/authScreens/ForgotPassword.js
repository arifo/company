import React from 'react';
import { Text, Button, Card } from 'react-native-elements';
import { ScrollView, StyleSheet } from 'react-native';
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

  renderFormik = ({
    values,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    isSubmitting
  }) => (
    <Card containerStyle={styles.card}>
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
        buttonStyle={styles.cardButton}
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
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="always"
        >
          <Text style={styles.textForgot}>Forgot your Password?</Text>
          <Formik
            initialValues={{ email: '' }}
            onSubmit={this.handleSubmit}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email()
                .required()
            })}
            render={this.renderFormik}
          />
          <Button
            title="Cancel"
            buttonStyle={styles.cardButton}
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
  { forgotPassAction }
)(ForgotPassword);

const styles = StyleSheet.create({
  scrollViewContent: { width: '100%', alignItems: 'center' },
  textForgot: { fontSize: 26, fontWeight: '600', marginVertical: 30 },
  card: { width: '100%', marginTop: 0 },
  cardButton: { marginVertical: 20, backgroundColor: '#0082C0' }
});
