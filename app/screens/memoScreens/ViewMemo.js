import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import ViewMoreText from 'react-native-view-more-text';
import Communications from 'react-native-communications';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';
import ViewText from '../../components/ViewText';

class ViewMemo extends Component {
  handlePhone = phone => Communications.phonecall(phone, true);

  handleEmail = email => Communications.email([email], null, null, null, null);

  renderReminder = (reminder, key) => {
    const isDue = { color: moment() < moment(reminder) ? 'green' : 'red' };
    const formatedDate = moment(reminder).format('M/DD/YYYY HH:mm');
    const timeAgo = moment().to(moment(reminder));
    const text = `${timeAgo}  (${formatedDate})`;
    return (
      <Text key={key} style={{ fontWeight: '700' }}>
        {`${key + 1}. `}
        <Text style={isDue}>{text}</Text>
      </Text>
    );
  };

  renderContact = contact => {
    if (!contact) {
      return null;
    }
    const contactStyle = { fontWeight: '400', color: 'blue' };
    return (
      <CustomCard label="Contact">
        <Text>name: {contact.name}</Text>
        <Text>
          phone:{' '}
          <Text style={contactStyle} onPress={() => this.handlePhone(contact.phone)}>
            {contact.phone}
          </Text>
        </Text>
        <Text>
          email:{' '}
          <Text style={contactStyle} onPress={() => this.handleEmail(contact.email)}>
            {contact.email}
          </Text>
        </Text>
      </CustomCard>
    );
  };

  render() {
    const { memoID } = this.props.navigation.state.params;

    const { title, note, contact, reminders, createdAt, lastModified } = this.props.memo[memoID];

    const selectedContact = _.filter(this.props.employees, employee => employee.id === contact.id);

    return (
      <Container style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
        <ScrollView style={{ width: '100%' }}>
          <CustomCard label="Title" text={title} />
          <CustomCard label="Note">
            <ViewMoreText
              numberOfLines={5}
              renderViewMore={onPress => <ViewText onPress={onPress} text="View more" />}
              renderViewLess={onPress => <ViewText onPress={onPress} text="View less" />}
              textStyle={{ textAlign: 'justify' }}
            >
              <Text>{note}</Text>
            </ViewMoreText>
          </CustomCard>

          {this.renderContact(selectedContact[0])}

          <CustomCard label="Reminders">
            {reminders.map(this.renderReminder)}
            {reminders.length === 0 && <Text>reminders are not set...</Text>}
          </CustomCard>
          <CustomCard label="Created">
            <Text>{moment(createdAt).format('M/DD/YYYY, HH:mm:ss')}</Text>
          </CustomCard>
          {lastModified > 0 && <LastModified lastModified={lastModified} />}
        </ScrollView>
      </Container>
    );
  }
}

const LastModified = ({ lastModified }) => (
  <CustomCard label="Last modified">
    <Text>{moment(lastModified).fromNow()}</Text>
  </CustomCard>
);

const mapStateToProps = state => ({
  memo: state.memo.memos,
  employees: state.employee.employees
});

export default connect(mapStateToProps)(ViewMemo);
