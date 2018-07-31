import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import moment from 'moment';

import ViewMoreText from 'react-native-view-more-text';

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
          backgroundColor: '#e2e2e2',
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
    const { memo } = this.props.navigation.state.params;

    return (
      <Container style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
        <ScrollView style={{ width: '100%' }}>
          <CustomCard label="Title" text={memo.title} />
          <CustomCard label="Note">
            <ViewMoreText
              numberOfLines={5}
              renderViewMore={this.renderViewMore}
              renderViewLess={this.renderViewLess}
              textStyle={{ textAlign: 'justify' }}
            >
              <Text>{memo.note}</Text>
            </ViewMoreText>
          </CustomCard>

          <CustomCard label="Reminders">
            {memo.reminders.map((val, key) => (
              <Text key={key}>
                {key + 1}. {val}
              </Text>
            ))}
          </CustomCard>
          <CustomCard label="Created">
            <Text>{memo.createdAt}</Text>
          </CustomCard>
          {memo.lastModified ? (
            <CustomCard label="Last modified">
              <Text>{memo.lastModified}</Text>
            </CustomCard>
          ) : null}
        </ScrollView>
      </Container>
    );
  }
}

export default ViewMemo;
