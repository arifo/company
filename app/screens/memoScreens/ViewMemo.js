import React, { Component } from 'react';
import { ScrollView, Text } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import PushNotification from 'react-native-push-notification';
import Communications from 'react-native-communications';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';
import ViewMoreText from '../../components/ViewText';
import { editMemo, handleDueReminders } from '../../redux/actions';

class ViewMemo extends Component {
  constructor(props) {
    super(props);
    const { memoID } = this.props.navigation.state.params;
    this.props.handleDueReminders(this.props.memo[memoID]);
  }

  componentDidMount() {
    const { type, notifID } = this.props.navigation.state.params;
    if (type === 'notification') {
      console.log('comming from push notification', notifID);
      this.cancelNotif(notifID);
    }
  }
  cancelNotif = id => {
    PushNotification.cancelLocalNotifications({ id });
  };
  handlePhone = phone => Communications.phonecall(phone, true);

  handleEmail = email => Communications.email([email], null, null, null, null);

  renderReminder = (reminder, key) => {
    const isDue = { color: 'green' };
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

  renderPastReminder = (reminder, key) => {
    const isDue = { color: 'red' };
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

    const {
      title,
      note,
      contact,
      reminders,
      createdAt,
      lastModified,
      oldReminders
    } = this.props.memo[memoID];
    const selectedContact = _.filter(this.props.employees, employee => employee.id === contact.id);

    return (
      <Container style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
        <ScrollView style={{ width: '100%' }}>
          <CustomCard label="Title" text={title} />
          <CustomCard label="Note">
            <ViewMoreText numberOfLines={5} text={note} />
          </CustomCard>

          {this.renderContact(selectedContact[0])}

          <CustomCard label="Upcoming reminders">
            {reminders.filter(q => q !== '').map(this.renderReminder)}
            {reminders.filter(q => q !== '').length === 0 && <Text>reminders are not set...</Text>}
          </CustomCard>
          {(oldReminders || []).length > 0 && (
            <CustomCard label="Past reminders">
              {(oldReminders || []).filter(q => q !== '').map(this.renderPastReminder)}
            </CustomCard>
          )}
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

export default connect(
  mapStateToProps,
  { editMemo, handleDueReminders }
)(ViewMemo);
