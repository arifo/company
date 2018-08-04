import React, { Component } from 'react';
import { ScrollView, View, Text, ActivityIndicator, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import ViewMoreText from 'react-native-view-more-text';

import { getCurrentMemo } from '../../redux/actions';
import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

class ViewMemo extends Component {
  componentDidMount() {
    const { memoID } = this.props.navigation.state.params;
    this.props.getCurrentMemo(memoID);
    console.log('update memo');
  }

  componentDidUpdate() {
    LayoutAnimation.spring();
  }
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

  render() {
    if (this.props.isFetching) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#0082C0" />
        </View>
      );
    }
    const { title, note, contact, reminders, createdAt, lastModified } = this.props.currentMemo;

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
            />
            <Text>{note}</Text>
          </CustomCard>
          {_.isEmpty(selectedContact) ? null : (
            <CustomCard label="Contact">
              <Text>{selectedContact[0].name}</Text>
              <Text>{selectedContact[0].phone}</Text>
              <Text>{selectedContact[0].email}</Text>
            </CustomCard>
          )}

          <CustomCard label="Reminders">
            {reminders.length > 0 ? (
              reminders.map((val, key) => (
                <Text key={key}>
                  {key + 1}. {val}
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
  currentMemo: state.memo.currentMemo,
  isFetching: state.memo.isFetching,
  employees: state.employee.employees
});

export default connect(
  mapStateToProps,
  { getCurrentMemo }
)(ViewMemo);
