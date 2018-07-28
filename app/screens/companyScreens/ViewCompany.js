import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Button, Text, Icon, Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import SegmentControl from 'react-native-segment-controller';
import ViewMoreText from 'react-native-view-more-text';

import moment from 'moment';

import { sortMemoList } from '../../redux/actions';
import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

class ViewCompany extends Component {
  state = {
    index: 0,
    isTabOneShowing: true,
    enableScrollViewScroll: true,
    isSorted: false
  };

  handlePress(index) {
    this.setState(previousState => ({ isTabOneShowing: !previousState.isTabOneShowing, index }));
  }

  renderEmployeeTab() {
    const { employees } = this.props.navigation.state.params.company;
    return (
      <View
        style={{
          marginTop: 20,
          height: deviceHeight * 0.5
        }}
      >
        <View
          style={{
            height: deviceHeight * 0.4,
            justifyContent: 'center'
          }}
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: false });
          }}
        >
          {employees.length > 0 ? (
            <FlatList
              data={employees}
              keyExtractor={(item, index) => `${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('ViewEmployee', {
                      title: `${item.name}`
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      borderBottomColor: '#b2b2b2',
                      padding: 13,
                      alignItems: 'center'
                    }}
                  >
                    <Avatar
                      medium
                      rounded
                      source={{ uri: item.avatar }}
                      //containerStyle={{ flex: 0.18 }}
                      // onPress={() => console.log('Works!')}
                      activeOpacity={0.7}
                    />
                    <Text
                      style={{ flex: 0.9, color: '#39393d', fontSize: 16, paddingHorizontal: 15 }}
                    >
                      {item.name}
                    </Text>
                    <Text>
                      rating:{' '}
                      <Text
                        style={{
                          // flex: 0.2,
                          color: '#39393d',
                          fontSize: 16,
                          paddingHorizontal: 15
                        }}
                      >
                        {item.rating}
                      </Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          ) : (
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                width: deviceWidth * 0.45,
                height: deviceWidth * 0.45,
                borderWidth: 3,
                borderColor: '#d4d5d6',
                borderRadius: 5,
                margin: 4,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#e5e8ea',
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5
              }}
              onPress={() =>
                this.props.navigation.navigate('AddEmployee', {
                  title: 'New employee'
                })
              }
            >
              <Icon
                type="entypo"
                name="add-user"
                color={'#b7bbbf'}
                size={80}
                underlayColor="transparent"
              />
            </TouchableOpacity>
          )}
        </View>

        <Button
          title="Add employee"
          buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
          onPress={() =>
            this.props.navigation.navigate('AddEmployee', {
              title: 'New employee'
            })
          }
        />
      </View>
    );
  }
  renderMemoTab() {
    return (
      <View style={{ marginTop: 20, height: deviceHeight * 0.5 }}>
        <View
          style={{ height: deviceHeight * 0.4 }}
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: false });
          }}
        >
          <FlatList
            data={this.props.navigation.state.params.company.memos}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ViewMemo', {
                    title: `${item.title}`
                  })
                }
              >
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#b2b2b2', padding: 13 }}>
                  <Text style={{ color: '#39393d', fontWeight: '500' }}>{item.title}</Text>
                  <Text style={{ color: '#39393d' }}>{item.createdAt}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Button
            title="Add memo"
            containerViewStyle={{ flex: 0.9 }}
            buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
            onPress={() =>
              this.props.navigation.navigate('AddMemo', {
                title: 'New memo'
              })
            }
          />
          <Icon
            name={this.state.isSorted ? 'angle-double-down' : 'angle-double-up'}
            type="font-awesome"
            color="#6f7172"
            size={35}
            containerStyle={{ flex: 0.1, paddingRight: 8 }}
            onPress={() => {
              const { company } = this.props.navigation.state.params;
              const newObj = JSON.parse(JSON.stringify(company));
              this.props.sortMemoList(newObj, this.state.isSorted);
              this.setState(previousState => ({ isSorted: !previousState.isSorted }));
            }}
            underlayColor="transparent"
          />
        </View>
      </View>
    );
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
    const { name, description, employees, memos } = this.props.navigation.state.params.company;
    // console.log('state memos', memos);
    return (
      <Container
        style={{ alignItems: 'center' }}
        onStartShouldSetResponderCapture={() => {
          this.setState({ enableScrollViewScroll: true });
        }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40, width: deviceWidth }}
          scrollEnabled={this.state.enableScrollViewScroll}
        >
          <CustomCard textStyle={{ fontSize: 20, fontWeight: '500' }} text={name} />
          <CustomCard>
            <ViewMoreText
              numberOfLines={5}
              renderViewMore={this.renderViewMore}
              renderViewLess={this.renderViewLess}
              textStyle={{ textAlign: 'justify' }}
            >
              <Text>{description}</Text>
            </ViewMoreText>
          </CustomCard>

          <CustomCard>
            <SegmentControl
              values={['Employees', 'Memos']}
              badges={[employees.length, memos.length]}
              selectedIndex={this.state.index}
              height={40}
              onTabPress={this.handlePress.bind(this)}
              borderRadius={5}
              tabBadgeContainerStyle={{ backgroundColor: 'red' }}
            />

            {this.state.isTabOneShowing ? this.renderEmployeeTab() : this.renderMemoTab()}
          </CustomCard>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  companies: state.app.companies
});

export default connect(
  mapStateToProps,
  { sortMemoList }
)(ViewCompany);
