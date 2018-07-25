import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { Button, Text } from 'react-native-elements';
import SegmentControl from 'react-native-segment-controller';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';

const deviceHeight = Dimensions.get('screen').height;
const TEMP_NAME = 'Apple Inc.';
const TEMP_DESCRIPTION =
  "Apple Inc. is an American multinational technology company headquartered in Cupertino, California, that designs, develops, and sells consumer electronics, computer software, and online services. The company's hardware products include the iPhone smartphone, the iPad tablet computer, the Mac personal computer, the iPod portable media player, the Apple Watch smartwatch, the Apple TV digital media player, and the HomePod smart speaker. Apple's software includes the macOS and iOS operating systems, the iTunes media player, the Safari web browser, and the iLife and iWork creativity and productivity suites, as well as professional applications like Final Cut Pro, Logic Pro, and Xcode. Its online services include the iTunes Store, the iOS App Store and Mac App Store, Apple Music, and iCloud.";
const TEMP_EMPOYEES = [
  { name: 'Walt' },
  { name: 'Samanta' },
  { name: 'Mario' },
  { name: 'John' },
  { name: 'Sarah' },
  { name: 'Miles' },
  { name: 'Tom' },
  { name: 'Ander' }
];
const TEMP_MEMOS = [
  { name: 'Memo1' },
  { name: 'Memo2' },
  { name: 'Memo3' },
  { name: 'Memo4' },
  { name: 'Memo5' },
  { name: 'Memo6' },
  { name: 'Memo7' },
  { name: 'Memo8' },
  { name: 'Memo9' },
  { name: 'Memo10' }
];

class ViewCompany extends Component {
  state = {
    index: 0,
    isTabOneShowing: true,
    enableScrollViewScroll: true
  };

  handlePress(index) {
    this.setState(previousState => ({ isTabOneShowing: !previousState.isTabOneShowing, index }));
  }

  renderEmployeeTab() {
    return (
      <View style={{ marginTop: 20, height: deviceHeight * 0.5 }}>
        <View
          style={{ height: deviceHeight * 0.4 }}
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: false });
          }}
        >
          <FlatList
            data={TEMP_EMPOYEES}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ViewEmployee', {
                    title: `${item.name}`
                  })
                }
              >
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#b2b2b2', padding: 13 }}>
                  <Text style={{ color: '#39393d' }}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
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
            data={TEMP_MEMOS}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ViewMemo', {
                    title: `${item.name}`
                  })
                }
              >
                <View style={{ borderBottomWidth: 1, borderBottomColor: '#b2b2b2', padding: 13 }}>
                  <Text style={{ color: '#39393d' }}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        <Button
          title="Add memo"
          buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
          onPress={() =>
            this.props.navigation.navigate('AddMemo', {
              title: 'New memo'
            })
          }
        />
      </View>
    );
  }

  render() {
    return (
      <Container
        style={{ flex: 1, alignItems: 'center' }}
        onStartShouldSetResponderCapture={() => {
          this.setState({ enableScrollViewScroll: true });
        }}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          scrollEnabled={this.state.enableScrollViewScroll}
        >
          <CustomCard textStyle={{ fontSize: 18, fontWeight: '500' }} text={TEMP_NAME} />
          <CustomCard text={TEMP_DESCRIPTION} />

          <CustomCard>
            <SegmentControl
              values={['Employees', 'Memos']}
              badges={[TEMP_EMPOYEES.length, TEMP_MEMOS.length]}
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

export default ViewCompany;
