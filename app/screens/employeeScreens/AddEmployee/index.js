import React, { Component } from 'react';
import { Button, Card, FormLabel, Text, Icon } from 'react-native-elements';
import { ScrollView, View, Alert, Image, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import Slider from 'react-native-slider';
import DateTimePicker from 'react-native-modal-datetime-picker';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import UUIDGenerator from 'react-native-uuid-generator';

import * as actions from '../../../redux/actions';
import styles from './styles';
import Container from '../../../components/Container';
import InputForm from '../../../components/InputForm';
import AddImageBox from '../../../components/AddImageBox';

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.phoneTextInput = null;
    this.emailTextInput = null;
    this.depTextInput = null;
    this.state = {
      avatar: '',
      imageSelected: false,
      rating: 10,
      isDateTimePickerVisible: false
    };
  }

  componentDidMount() {
    const { type, employeeID } = this.props.navigation.state.params;
    if (type === 'edit') {
      const { avatar, rating } = this.props.employee[employeeID];
      if (avatar) {
        this.setState({ avatar, imageSelected: true });
      }
      this.setState({ rating });
    }
    if (type !== 'edit') {
      this.setState({ avatar: '', imageSelected: false, rating: 10 });
    }
  }

  onSave = async values => {
    const { type } = this.props.navigation.state.params;
    return type === 'edit' ? this.saveEditEmployee(values) : this.saveNewEmployee(values);
  };

  selectImage = () => {
    const options = {
      title: 'Select Image',
      cameraType: 'front',
      quality: 0.4,
      storageOptions: { skipBackup: true, path: 'images' }
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('ImagePicker Error: ', response.didCancel);
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({ avatar: response.uri, imageSelected: true });
      }
    });
  };

  saveNewEmployee = value => {
    const { companyID } = this.props.navigation.state.params;
    UUIDGenerator.getRandomUUID().then(uuid => {
      const employeeInfo = {
        id: uuid,
        companyID,
        name: value.name,
        phone: value.phone,
        email: value.email,
        department: value.department,
        joinDate: value.joinDate,
        rating: this.state.rating,
        avatar: this.state.avatar,
        createdAt: moment().valueOf(),
        lastModified: '',
        user: firebase.auth().currentUser.uid
      };
      this.props.addEmployee(employeeInfo, uuid, this.props.navigation);
    });
  };

  saveEditEmployee = value => {
    const { employeeID } = this.props.navigation.state.params;
    const { avatar, rating } = this.state;
    const employee = this.props.employee[employeeID];

    const lastModified = moment().valueOf();
    this.props.editEmployee(value, employee, lastModified, avatar, rating, this.props.navigation);
  };

  deleteCurrentEmployee = () => {
    Alert.alert(
      'Are sure you want to Delete?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            const { employeeID } = this.props.navigation.state.params;
            const employee = this.props.employee[employeeID];
            this.props.deleteEmployee(employee, this.props.navigation);
          }
        },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') }
      ],
      { cancelable: true }
    );
  };

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

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
        onPress={this.selectImage}
      />
    );
  }

  render() {
    const { type, employeeID } = this.props.navigation.state.params;
    return (
      <Container>
        <ScrollView style={{ width: '100%' }} keyboardShouldPersistTaps="always">
          <Formik
            initialValues={
              type === 'edit' && this.props.employee[employeeID]
                ? {
                    name: this.props.employee[employeeID].name,
                    phone: this.props.employee[employeeID].phone,
                    email: this.props.employee[employeeID].email,
                    department: this.props.employee[employeeID].department,
                    joinDate: this.props.employee[employeeID].joinDate
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
            render={({
              values,
              handleSubmit,
              setFieldValue,
              errors,
              touched,
              isSubmitting,
              setFieldTouched
            }) => (
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
                  <View style={styles.datePickerContainer}>
                    <TouchableOpacity
                      onPress={this.showDateTimePicker}
                      style={styles.pickerContainer}
                    >
                      <View style={styles.dateValueContainer}>
                        {values.joinDate ? (
                          <Text>{moment(values.joinDate).format('MM/DD/YYYY')}</Text>
                        ) : (
                          <Text>MM/DD/YYYY</Text>
                        )}
                      </View>
                      <Icon name="calendar" type="font-awesome" size={32} color={'#008fff'} />
                    </TouchableOpacity>
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
                    <DateTimePicker
                      isVisible={this.state.isDateTimePickerVisible}
                      mode="date"
                      onCancel={this.hideDateTimePicker}
                      onConfirm={date => {
                        const d = date.toISOString();
                        setFieldValue('joinDate', d);
                        this.hideDateTimePicker();
                      }}
                    />
                  </View>
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
                  loading={isSubmitting}
                  disabled={isSubmitting}
                />

                {type === 'edit' ? (
                  <Button
                    title="Delete"
                    buttonStyle={{ backgroundColor: 'red', marginTop: 10 }}
                    onPress={this.deleteCurrentEmployee}
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
  employee: state.employee.employees
});

export default connect(
  mapStateToProps,
  actions
)(AddEmployee);
