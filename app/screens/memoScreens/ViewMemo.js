import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import ViewMoreText from 'react-native-view-more-text';
import Communications from 'react-native-communications';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

class ViewMemo extends Component {
  renderViewMore(onPress) {
    return (
      <View
        style={{
          height: 25,
          marginTop: 5,
          backgroundColor: '#e2e2e2',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text onPress={onPress} style={{ fontWeight: '500' }}>
          View more
        </Text>
      </View>
    );
  }
  renderViewLess(onPress) {
    return (
      <View
        style={{
          height: 25,
          marginTop: 5,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text onPress={onPress} style={{ fontWeight: '500' }}>
          View less
        </Text>
      </View>
    );
  }

  handlePhone = phone => Communications.phonecall(phone, true);

  handleEmail = email => Communications.email([email], null, null, null, null);

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
              renderViewMore={this.renderViewMore}
              renderViewLess={this.renderViewLess}
              textStyle={{ textAlign: 'justify' }}
            >
              <Text>{note}</Text>
            </ViewMoreText>
          </CustomCard>
          {_.isEmpty(selectedContact) ? null : (
            <CustomCard label="Contact">
              <Text>name: {selectedContact[0].name}</Text>
              <Text>
                phone:{' '}
                <Text
                  style={{ fontWeight: '400', color: 'blue' }}
                  onPress={() => this.handlePhone(selectedContact[0].phone)}
                >
                  {selectedContact[0].phone}
                </Text>
              </Text>
              <Text>
                email:{' '}
                <Text
                  style={{ fontWeight: '400', color: 'blue' }}
                  onPress={() => this.handleEmail(selectedContact[0].email)}
                >
                  {selectedContact[0].email}
                </Text>
              </Text>
            </CustomCard>
          )}

          <CustomCard label="Reminders">
            {reminders.length > 0 ? (
              reminders.map((val, key) => (
                <Text
                  key={key}
                  style={
                    moment() < moment(val)
                      ? { fontWeight: '700', color: 'green' }
                      : { fontWeight: '700', color: 'red' }
                  }
                >
                  {key + 1}. {moment().to(moment(val))} {'  '}(
                  {moment(val).format('M/DD/YYYY HH:mm')})
                </Text>
              ))
            ) : (
              <Text>reminders are not set...</Text>
            )}
          </CustomCard>
          <CustomCard label="Created">
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
  memo: state.memo.memos,
  employees: state.employee.employees
});

export default connect(mapStateToProps)(ViewMemo);
