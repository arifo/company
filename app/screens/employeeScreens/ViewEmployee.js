import React, { Component } from 'react';
import { Text, Rating, Avatar } from 'react-native-elements';
import { ScrollView, View, Image, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';

import { getCurrentEmployee } from '../../redux/actions';
import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

class ViewEmployee extends Component {
  componentDidMount() {
    const { employeeID } = this.props.navigation.state.params;
    this.props.getCurrentEmployee(employeeID);
  }

  render() {
    if (this.props.isFetching) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0082C0" />
        </View>
      );
    }
    const {
      name,
      phone,
      email,
      department,
      joinDate,
      rating,
      createdAt,
      lastModified,
      avatar
    } = this.props.currentEmployee;

    return (
      <Container style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
        <ScrollView style={{ width: '100%' }}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.image} resizeMethod="resize" />
          ) : (
            <Avatar rounded icon={styles.icon} containerStyle={styles.avatar} />
          )}
          <CustomCard label="Name" text={name} />
          <CustomCard label="Phone number" text={phone} />
          <CustomCard label="Email adress" text={email} />
          <CustomCard label="Department" text={department} />
          <CustomCard
            label="Join date"
            text={joinDate ? moment(joinDate, 'MM/DD/YYYY').format('MMMM Do YYYY') : '-'}
          />
          <CustomCard label="Rating">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{rating}</Text>
              <Rating ratingCount={10} imageSize={20} readonly startingValue={rating / 10} />
            </View>
          </CustomCard>
          <CustomCard label="Contact created">
            <Text>{moment(createdAt).format('M/DD/YYYY, HH:mm:ss')}</Text>
          </CustomCard>
          {lastModified ? (
            <CustomCard label="Last modified">
              <Text>{moment(lastModified).fromNow()}</Text>
            </CustomCard>
          ) : null}
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentEmployee: state.employee.currentEmployee,
  isFetching: state.employee.isFetching
});

export default connect(
  mapStateToProps,
  { getCurrentEmployee }
)(ViewEmployee);

const styles = {
  image: {
    alignSelf: 'center',
    marginTop: 20,
    height: 128,
    width: 128,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#b2b2b2'
  },
  avatar: {
    alignSelf: 'center',
    marginTop: 20,
    height: 128,
    width: 128
  },
  icon: { type: 'font-awesome', name: 'user-o', size: 50 }
};
