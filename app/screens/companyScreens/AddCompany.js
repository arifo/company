import React, { Component } from 'react';
import { ScrollView, Dimensions, Alert } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import UUIDGenerator from 'react-native-uuid-generator';
import firebase from 'firebase';
import moment from 'moment';

import { addCompany, editCompany, deleteCompany } from '../../redux/actions';
import Container from '../../components/Container';
import InputForm from '../../components/InputForm';

const deviceWidth = Dimensions.get('screen').width;

class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.passTextInput = null;
  }

  onSubmit = values => {
    const { type } = this.props.navigation.state.params;
    return type === 'edit' ? this.saveEditCompany(values) : this.saveNewCompany(values);
  };

  onDelete = () => {
    Alert.alert(
      'Are sure you want to Delete?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            const { companyID } = this.props.navigation.state.params;
            const { id, user } = this.props.companies[companyID];
            this.props.deleteCompany(id, user);
            this.props.navigation.goBack();
          }
        },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') }
      ],
      { cancelable: true }
    );
  };

  saveNewCompany = value => {
    UUIDGenerator.getRandomUUID().then(uuid => {
      const companyInfo = {
        id: uuid,
        name: value.name,
        description: value.description,
        employees: {},
        memos: {},
        user: firebase.auth().currentUser.uid,
        createdAt: moment().valueOf(),
        lastModified: ''
      };
      this.props.addCompany(companyInfo, uuid);

      this.props.navigation.replace('ViewCompany', {
        title: companyInfo.name,
        companyID: companyInfo.id
      });
    });
  };

  saveEditCompany = value => {
    const { companyID } = this.props.navigation.state.params;
    const { id } = this.props.companies[companyID];

    const lastModified = moment().valueOf();
    this.props.editCompany(value, id, lastModified);
    this.props.navigation.replace('ViewCompany', {
      title: value.name,
      companyID: id
    });
  };

  render() {
    const { type, companyID } = this.props.navigation.state.params;
    return (
      <Container style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView style={{ width: deviceWidth }} keyboardShouldPersistTaps="always">
          <Formik
            initialValues={
              type === 'edit' && this.props.companies[companyID]
                ? {
                    name: this.props.companies[companyID].name,
                    description: this.props.companies[companyID].description
                  }
                : { name: '', description: '' }
            }
            onSubmit={this.onSubmit}
            validationSchema={Yup.object().shape({
              name: Yup.string().required(),
              description: Yup.string().notRequired()
            })}
            render={({ values, handleSubmit, setFieldValue, errors, touched, setFieldTouched }) => (
              <Card containerStyle={{ flexGrow: 1 }}>
                <InputForm
                  label="Company Name"
                  placeholder="your company name..."
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    this.passTextInput.focus();
                  }}
                  value={values.name}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="name"
                  error={touched.name && errors.name}
                />
                <InputForm
                  label="Description"
                  multiline
                  placeholder="company description ..."
                  returnKeyType={'done'}
                  inputRef={input => {
                    this.passTextInput = input;
                  }}
                  value={values.description}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="description"
                  error={touched.description && errors.description}
                />
                <Button
                  title="Save Company"
                  buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
                  onPress={handleSubmit}
                />
                {type === 'edit' ? (
                  <Button
                    title="Delete Company"
                    buttonStyle={{ backgroundColor: 'red', marginTop: 10 }}
                    onPress={this.onDelete}
                  />
                ) : null}
              </Card>
            )}
          />
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  companies: state.company.companies
});

export default connect(
  mapStateToProps,
  { addCompany, editCompany, deleteCompany }
)(AddCompany);
