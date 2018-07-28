import React, { Component } from 'react';
import { Text, Rating } from 'react-native-elements';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
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
  onSave = values => {};

  render() {
    const { employees } = this.props.company[0];
    console.log('employes prop @ viewEmploye scrn', employees[0]);
    return (
      <Container style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
        <ScrollView style={{ width: '100%' }}>
          <CustomCard label="Name" text={employees[0].name} />
          <CustomCard label="Phone number" text={employees[0].phone} />
          <CustomCard label="Email adress" text={employees[0].email} />
          <CustomCard label="Department" text={employees[0].department} />
          <CustomCard
            label="Join date"
            text={moment(employees[0].joinDate, 'MM/DD/YYYY').format('MMMM Do YYYY')}
          />
          <CustomCard label="Rating">
            <Rating
              ratingCount={10}
              imageSize={20}
              readonly
              startingValue={employees[0].rating / 10}
            />
          </CustomCard>
          <CustomCard label="Contact created">
            <Text>{employees[0].createdAt}</Text>
          </CustomCard>
          {employees[0].lastModified ? (
            <CustomCard label="Last modified">
              <Text>{employees[0].lastModified}</Text>
            </CustomCard>
          ) : null}
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  company: state.app.companies
});

export default connect(mapStateToProps)(ViewEmployee);
