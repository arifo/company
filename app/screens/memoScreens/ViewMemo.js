import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import moment from 'moment';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

const TEMP_MEMO = {
  title: 'New company',
  note: 'Needs to work on its Customer Service',
  reminder: '09/20/2018'
};

class ViewMemo extends Component {
  onSave = values => {
    console.log(JSON.stringify(values));
  };

  render() {
    return (
      <Container style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView style={{ width: '100%' }}>
          <CustomCard label="Title" text={TEMP_MEMO.title} />
          <CustomCard label="Note" text={TEMP_MEMO.note} />
          <CustomCard
            label="Reminder"
            text={moment(TEMP_MEMO.reminder, 'MM/DD/YYYY').format('MMMM Do YYYY')}
          />
        </ScrollView>
      </Container>
    );
  }
}

export default ViewMemo;
