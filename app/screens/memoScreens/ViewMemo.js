import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import ViewMoreText from 'react-native-view-more-text';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

class ViewMemo extends Component {
  onSave = values => {};
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
    const { company } = this.props;
    console.log('company props @ view memo Scrn', company);
    return (
      <Container style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
        <ScrollView style={{ width: '100%' }}>
          <CustomCard label="Title" text={company[0].memos[0].title} />
          <CustomCard label="Note">
            <ViewMoreText
              numberOfLines={5}
              renderViewMore={this.renderViewMore}
              renderViewLess={this.renderViewLess}
              textStyle={{ textAlign: 'justify' }}
            >
              <Text>{company[0].memos[0].note}</Text>
            </ViewMoreText>
          </CustomCard>

          <CustomCard label="Reminders">
            <Text>1. {company[0].memos[0].reminder[0].remind}</Text>
            <Text>2. {company[0].memos[0].reminder[1].remind}</Text>
          </CustomCard>
          <CustomCard label="Created">
            <Text>{company[0].memos[0].createdAt}</Text>
          </CustomCard>
          {company[0].memos[0].lastModified ? (
            <CustomCard label="Last modified">
              <Text>{company[0].memos[0].lastModified}</Text>
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

export default connect(mapStateToProps)(ViewMemo);
