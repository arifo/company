import React, { Component } from 'react';
import { Button, Card, FormLabel, Text, Icon } from 'react-native-elements';
import { ScrollView, View, StyleSheet, Alert, Image } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import Slider from 'react-native-slider';

import { connect } from 'react-redux';
import UUIDGenerator from 'react-native-uuid-generator';
import { NavigationActions, StackActions } from 'react-navigation';

import {
  addEmployee,
  editEmployee,
  deleteEmployee,
  toggleEmployeeFetching,
  getCurrentEmployee,
  uploadImagesToFirebaseStorage,
  deleteAvatarFromStorage
} from '../../redux/actions';

import Container from '../../components/Container';
import InputForm from '../../components/InputForm';
import AddImageBox from '../../components/AddImageBox';

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.phoneTextInput = null;
    this.emailTextInput = null;
    this.depTextInput = null;
    this.state = {
      avatar: '',
      imageSelected: false,
      imageUploading: false,
      rating: 10
    };
  }

  componentDidMount() {
    const { type } = this.props.navigation.state.params;
    const { avatar, rating } = this.props.currentEmployee;

    if (this.props.currentEmployee.avatar) {
      this.setState({ avatar, imageSelected: true, rating });
    }
    if (type !== 'edit') {
      this.setState({ avatar: '', imageSelected: false, rating: 10 });
    }
  }

  onSave = async values => {
    const { type } = this.props.navigation.state.params;
    return type === 'edit' ? this.saveEditEmployee(values) : this.saveNewEmployee(values);
  };

  saveNewEmployee = value => {
    const { id } = this.props.currentCompany;
    UUIDGenerator.getRandomUUID().then(uuid => {
      const employeeInfo = {
        id: uuid,
        companyID: id,
        name: value.name,
        phone: value.phone,
        email: value.email,
        department: value.department,
        joinDate: value.joinDate,
        rating: this.state.rating,
        avatar: this.state.avatar,
        createdAt: moment().valueOf(),
        lastModified: ''
      };
      this.props.addEmployee(employeeInfo, uuid);
      this.resetStack(employeeInfo, this.props.currentCompany);
    });
  };

  saveEditEmployee = value => {
    const { currentEmployee, currentCompany } = this.props;
    const { avatar, rating } = this.state;
    const { id } = currentEmployee;
    this.props.toggleEmployeeFetching(true);
    const lastModified = moment().valueOf();
    this.props.editEmployee(value, id, lastModified, avatar, rating);
    this.props.getCurrentEmployee(id);
    this.resetStack(currentEmployee, currentCompany);
  };

  resetStack = (item, currentCompany) => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 2,
        actions: [
          NavigationActions.navigate({
            routeName: 'Companies'
          }),
          NavigationActions.navigate({
            routeName: 'ViewCompany',
            params: {
              title: currentCompany.name,
              companyID: currentCompany.id
            }
          }),
          NavigationActions.navigate({
            routeName: 'ViewEmployee',
            params: {
              title: `${item.name}`,
              employeeID: item.id
            }
          })
        ]
      })
    );
  };
  resetStackAfterDeletion = currentCompany => {
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
              title: currentCompany.name,
              companyID: currentCompany.id
            }
          })
        ]
      })
    );
  };

  deleteCurrentEmployee = () => {
    Alert.alert(
      'Are sure you want to Delete?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            const { currentEmployee } = this.props;
            const { currentCompany } = this.props;
            this.props.deleteEmployee(currentEmployee);
            this.props.deleteAvatarFromStorage(this.state.avatar);
            this.resetStackAfterDeletion(currentCompany);
          }
        },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') }
      ],
      { cancelable: true }
    );
  };

  selectAvatarImg = () => {
    this.setState({ imageUploading: true });

    const { currentCompany } = this.props;
    const { currentEmployee } = this.props;
    this.props.uploadImagesToFirebaseStorage(this, currentCompany.id, currentEmployee.id);
  };

  renderAvatar() {
    if (this.state.imageSelected) {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: this.state.avatar }} style={styles.image} resizeMethod="resize" />
          <Icon
            containerStyle={{ marginLeft: 8 }}
            name="minus-circle"
            type="feather"
            size={30}
            color={'#b7bbbf'}
            onPress={() => {
              this.props.deleteAvatarFromStorage(this.state.avatar);
              this.setState({ avatar: '', imageSelected: false });
            }}
          />
        </View>
      );
    }
    return (
      <AddImageBox
        size={0.35}
        iconType="MaterialIcons"
        iconName="add-a-photo"
        iconSize={85}
        onPress={this.selectAvatarImg}
      />
    );
  }

  render() {
    const { type } = this.props.navigation.state.params;
    const { name, phone, email, department, joinDate } = this.props.currentEmployee;

    return (
      <Container>
        <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="always">
          <Formik
            initialValues={
              type === 'edit'
                ? {
                    name,
                    phone,
                    email,
                    department,
                    joinDate
                  }
                : {
                    name: '',
                    phone: '',
                    email: '',
                    department: '',
                    joinDate: ''
                  }
            }
            onSubmit={this.onSave}
            validationSchema={Yup.object().shape({
              name: Yup.string().required(),
              phone: Yup.string().required(),
              email: Yup.string()
                .email()
                .required(),
              department: Yup.string().required(),
              joinDate: Yup.string().notRequired(),
              rating: Yup.number().notRequired()
            })}
            render={({ values, handleSubmit, setFieldValue, errors, touched, setFieldTouched }) => (
              <Card containerStyle={{ width: '92%', marginBottom: 20 }}>
                {this.renderAvatar()}

                <InputForm
                  label="Name"
                  placeholder="Employee name..."
                  onSubmitEditing={() => {
                    this.phoneTextInput.focus();
                  }}
                  returnKeyType={'next'}
                  value={values.name}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="name"
                  error={touched.name && errors.name}
                />
                <InputForm
                  label="Phone"
                  placeholder="phone number"
                  keyboardType="numeric"
                  returnKeyType={'next'}
                  inputRef={input => {
                    this.phoneTextInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.emailTextInput.focus();
                  }}
                  value={values.phone}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="phone"
                  error={touched.phone && errors.phone}
                />
                <InputForm
                  label="Email"
                  placeholder="example@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType={'next'}
                  inputRef={input => {
                    this.emailTextInput = input;
                  }}
                  onSubmitEditing={() => {
                    this.depTextInput.focus();
                  }}
                  value={values.email}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="email"
                  error={touched.email && errors.email}
                />
                <InputForm
                  label="Department"
                  placeholder="Department"
                  returnKeyType={'done'}
                  inputRef={input => {
                    this.depTextInput = input;
                  }}
                  value={values.department}
                  onChange={setFieldValue}
                  onTouch={setFieldTouched}
                  name="department"
                  error={touched.department && errors.department}
                />
                <View style={styles.joinDateContainer}>
                  <FormLabel>Join date</FormLabel>
                  <DatePicker
                    style={{ width: 150 }}
                    date={values.joinDate}
                    mode="date"
                    androidMode="spinner"
                    placeholder="MM/DD/YYYY"
                    format="M/DD/YYYY"
                    minDate="1-01-1920"
                    maxDate={moment(new Date()).format('M/DD/YYYY')}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={date => setFieldValue('joinDate', date)}
                  />
                  {values.joinDate ? (
                    <Icon
                      name="minus-circle"
                      type="feather"
                      size={30}
                      color={'#b7bbbf'}
                      onPress={() => {
                        setFieldValue('joinDate', '');
                      }}
                    />
                  ) : null}
                </View>
                <View style={styles.ratingContainer}>
                  <FormLabel>Rating</FormLabel>
                  <Text style={{ fontSize: 18, fontWeight: '500' }}>{this.state.rating}</Text>
                </View>
                <View style={styles.ratingSliderContainer}>
                  <Slider
                    trackStyle={styles.sliderTrack}
                    thumbStyle={styles.sliderThumb}
                    minimumTrackTintColor="#30a935"
                    value={this.state.rating}
                    onValueChange={value => this.setState({ rating: value })}
                    minimumValue={0}
                    maximumValue={100}
                    step={5}
                  />
                </View>
                <Button
                  title="Save"
                  buttonStyle={{ marginVertical: 10, backgroundColor: '#0082C0' }}
                  onPress={handleSubmit}
                  disabled={this.state.imageUploading}
                />
                {type === 'edit' ? (
                  <Button
                    title="Delete"
                    buttonStyle={{ backgroundColor: 'red', marginTop: 30 }}
                    onPress={this.deleteCurrentEmployee}
                  />
                ) : null}
              </Card>
            )}
          />
        </ScrollView>
        <View style={styles.ratingSliderContainer} />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentEmployee: state.employee.currentEmployee,
  isFetching: state.employee.isFetching,
  currentCompany: state.company.currentCompany
});

export default connect(
  mapStateToProps,
  {
    addEmployee,
    editEmployee,
    deleteEmployee,
    toggleEmployeeFetching,
    getCurrentEmployee,
    uploadImagesToFirebaseStorage,
    deleteAvatarFromStorage
  }
)(AddEmployee);

export const styles = StyleSheet.create({
  joinDateContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingRight: 10
  },
  ratingContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: 8,
    paddingRight: 13
  },
  ratingSliderContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginBottom: 30
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2
  },
  sliderThumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderColor: '#30a935',
    borderWidth: 2
  },
  imageContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 25
  },
  image: {
    alignSelf: 'center',
    height: 128,
    width: 128,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#b2b2b2'
  }
});
