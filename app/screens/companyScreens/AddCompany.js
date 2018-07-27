import React, { Component } from 'react';
import { ScrollView, Dimensions, Alert } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import UUIDGenerator from 'react-native-uuid-generator';
import { NavigationActions, StackActions } from 'react-navigation';

import { addCompany, editCompany } from '../../redux/actions';
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
    const { company } = this.props.navigation.state.params;

    const newArray = JSON.parse(JSON.stringify(this.props.companies));

    newArray.forEach((val, key) => {
      if (val.id === company.id) {
        newArray.splice(key, 1);
        this.props.addCompany(newArray);
        this.props.navigation.replace('Companies');
      }
    });
  };

  saveNewCompany = value => {
    const newArray = JSON.parse(JSON.stringify(this.props.companies));
    UUIDGenerator.getRandomUUID().then(uuid => {
      const companyInfo = {
        id: uuid,
        name: value.name,
        description: value.description,
        employees: [],
        memos: []
      };
      newArray.push(companyInfo);
      this.props.addCompany(newArray);
      this.props.navigation.replace('ViewCompany', {
        title: `${companyInfo.name}`,
        company: companyInfo
      });
    });
  };

  resetStack = val => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({
            routeName: 'Companies'
          }),
          NavigationActions.navigate({
            routeName: 'ViewCompany',
            params: {
              title: `${val.name}`,
              company: val
            }
          })
        ]
      })
    );
  };

  saveEditCompany = value => {
    const { company } = this.props.navigation.state.params;

    const newArray = JSON.parse(JSON.stringify(this.props.companies));

    newArray.forEach((val, key) => {
      const item = val;
      if (val.id === company.id) {
        item.name = value.name;
        item.description = value.description;
        this.props.editCompany(newArray);
        this.resetStack(item);
      }
    });
  };

  render() {
    const { type, company } = this.props.navigation.state.params;
    return (
      <Container style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView style={{ width: deviceWidth }}>
          <Formik
            initialValues={
              type === 'edit'
                ? { name: company.name, description: company.description }
                : { name: '', description: '' }
            }
            onSubmit={this.onSubmit}
            validationSchema={Yup.object().shape({
              name: Yup.string().required(),
              description: Yup.string().required()
            })}
            render={({ values, handleSubmit, setFieldValue, errors, touched, setFieldTouched }) => (
              <Card>
                <InputForm
                  label="Company Name"
                  containerStyle={{ marginBottom: 40 }}
                  placeholder="your company name..."
                  returnKeyType={'next'}
                  onSubmitEditing={event => {
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
                  placeholder="company description"
                  containerStyle={{ marginBottom: 40 }}
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
                    buttonStyle={{ backgroundColor: 'red' }}
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
  companies: state.app.companies
});

export default connect(
  mapStateToProps,
  { addCompany, editCompany }
)(AddCompany);
