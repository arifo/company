import React, { Component } from 'react';
import { Rating } from 'react-native-elements';
import { ScrollView } from 'react-native';
import moment from 'moment';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

const TEMP_EMPLOYEE = {
  name: 'Mike',
  phone: '847-239-3055',
  email: 'mike@gmail.com',
  department: 'Customer Service',
  joinDate: '07/20/2015',
  rating: 4
};

class ViewEmployee extends Component {
  onSave = values => {
    console.log(JSON.stringify(values));
  };

  render() {
    return (
      <Container style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }}>
          <CustomCard label="Name" text={TEMP_EMPLOYEE.name} />
          <CustomCard label="Phone number" text={TEMP_EMPLOYEE.phone} />
          <CustomCard label="Email adress" text={TEMP_EMPLOYEE.email} />
          <CustomCard label="Department" text={TEMP_EMPLOYEE.department} />
          <CustomCard
            label="Join date"
            text={moment(TEMP_EMPLOYEE.joinDate, 'MM/DD/YYYY').format('MMMM Do YYYY')}
          />
          <CustomCard label="Rating">
            <Rating imageSize={20} readonly startingValue={TEMP_EMPLOYEE.rating} />
          </CustomCard>
        </ScrollView>
      </Container>
    );
  }
}

export default ViewEmployee;
