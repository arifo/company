import React, { Component } from 'react';
import { Text, Rating, Avatar } from 'react-native-elements';
import { ScrollView, View, Image } from 'react-native';
import moment from 'moment';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

class ViewEmployee extends Component {
  render() {
    const { employee } = this.props.navigation.state.params;
    console.log('nav employee', employee);
    console.log('redux employes', this.props.employee);

    return (
      <Container style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
        <ScrollView style={{ width: '100%' }}>
          {employee.avatar ? (
            <Image source={{ uri: employee.avatar }} style={styles.image} resizeMethod="resize" />
          ) : (
            <Avatar rounded icon={styles.icon} containerStyle={styles.avatar} />
          )}
          <CustomCard label="Name" text={employee.name} />
          <CustomCard label="Phone number" text={employee.phone} />
          <CustomCard label="Email adress" text={employee.email} />
          <CustomCard label="Department" text={employee.department} />
          <CustomCard
            label="Join date"
            text={moment(employee.joinDate, 'MM/DD/YYYY').format('MMMM Do YYYY')}
          />
          <CustomCard label="Rating">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{employee.rating}</Text>
              <Rating
                ratingCount={10}
                imageSize={20}
                readonly
                startingValue={employee.rating / 10}
              />
            </View>
          </CustomCard>
          <CustomCard label="Contact created">
            <Text>{moment(employee.createdAt, 'x').format('MMMM Do YYYY')}</Text>
          </CustomCard>
          {employee.lastModified ? (
            <CustomCard label="Last modified">
              <Text>{employee.lastModified}</Text>
            </CustomCard>
          ) : null}
        </ScrollView>
      </Container>
    );
  }
}

export default ViewEmployee;

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
