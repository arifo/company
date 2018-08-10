import React, { Component } from 'react';
import { View, ScrollView, Dimensions, ActivityIndicator, Modal } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import SegmentControl from 'react-native-segment-controller';
import ViewMoreText from 'react-native-view-more-text';

import moment from 'moment';
import _ from 'lodash';

import {
  getEmployees,
  getMemos,
  getCurrentCompany,
  toggleMemoFetching,
  toggleEmployeeFetching,
  unsubscribe
} from '../../redux/actions';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';
import AddImageBox from '../../components/AddImageBox';
import CustomFlatList from '../../components/CustomFlatList';
import ImagePreview from '../../components/ImagePreview';

const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

class ViewCompany extends Component {
  state = {
    index: 0,
    isTabOneShowing: true,
    enableScrollViewScroll: true,
    sortKey: 'desc',
    visible: false,
    selectedItem: ''
  };

  componentDidMount() {
    const { companyID, type } = this.props.navigation.state.params;
    if (type === 'fromEditScreen') {
      this.handleTabSwitch(1);
    }
    this.props.getCurrentCompany(companyID);
    this.props.getEmployees(companyID);
    this.props.getMemos(companyID);
  }

  componentWillUnmount() {
    this.props.unsubscribe('employee');
    this.props.unsubscribe('memo');
  }

  onEmployeeSelect = item => {
    this.props.toggleEmployeeFetching(true);
    this.props.navigation.navigate('ViewEmployee', {
      title: item.name,
      employeeID: item.id
    });
  };

  onAddEmployee = () => {
    this.props.toggleEmployeeFetching(true);
    this.props.navigation.navigate('AddEmployee', {
      title: 'New employee'
    });
  };

  onMemoSelect = item => {
    this.props.toggleMemoFetching(true);
    this.props.navigation.navigate('ViewMemo', {
      title: `${item.title}`,
      memoID: item.id
    });
  };

  onAddMemo = () => {
    this.props.toggleMemoFetching(true);
    this.props.navigation.navigate('AddMemo', {
      title: 'New memo'
    });
  };

  handleTabSwitch(index) {
    this.setState(previousState => ({ isTabOneShowing: !previousState.isTabOneShowing, index }));
  }

  showModal = avatar => {
    this.setState({ visible: true, selectedItem: avatar });
  };
  renderEmployeeTab() {
    const data = this.props.employees;
    return (
      <View style={{ marginTop: 20, maxHeight: deviceHeight * 0.45, flexGrow: 1 }}>
        <View
          style={{ maxHeight: deviceHeight * 0.35, justifyContent: 'center', flexGrow: 1 }}
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: false });
          }}
        >
          {data.length > 0 ? (
            <View>
              <CustomFlatList
                data={data}
                onPress={this.onEmployeeSelect}
                avatarPress={avatar => this.showModal(avatar)}
              />
              <ImagePreview
                visible={this.state.visible}
                source={{ uri: this.state.selectedItem }}
                close={() => this.setState({ visible: false, selectedItem: '' })}
              />
            </View>
          ) : (
            <AddImageBox
              size={0.45}
              iconType="entypo"
              iconName="add-user"
              iconSize={80}
              onPress={this.onAddEmployee}
            />
          )}
        </View>

        <Button
          title="Add employee"
          buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
          onPress={this.onAddEmployee}
        />
      </View>
    );
  }

  renderMemoTab() {
    const data = _.chain(this.props.memos)
      .orderBy(['lastModified', 'createdAt'], [this.state.sortKey])
      .value();
    return (
      <View style={{ marginTop: 20, maxHeight: deviceHeight * 0.45, flexGrow: 1 }}>
        <View
          style={{ maxHeight: deviceHeight * 0.35, justifyContent: 'center', flexGrow: 1 }}
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: false });
          }}
        >
          {data.length > 0 ? (
            <CustomFlatList isMemoTab data={data} onPress={this.onMemoSelect} />
          ) : (
            <AddImageBox
              size={0.45}
              iconType="MaterialIcons"
              iconName="note-add"
              iconSize={80}
              onPress={this.onAddMemo}
            />
          )}
        </View>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <Button
            title="Add memo"
            containerViewStyle={{ flex: 0.9 }}
            buttonStyle={{ marginVertical: 20, backgroundColor: '#0082C0' }}
            onPress={this.onAddMemo}
          />
          <Icon
            name={this.state.sortKey === 'desc' ? 'angle-double-up' : 'angle-double-down'}
            type="font-awesome"
            color="#6f7172"
            size={35}
            containerStyle={{ flex: 0.1, paddingRight: 8 }}
            onPress={() => {
              this.setState(previousState => ({
                sortKey: previousState.sortKey === 'asc' ? 'desc' : 'asc'
              }));
            }}
            underlayColor="transparent"
          />
        </View>
      </View>
    );
  }
  renderViewMore(onPress) {
    return (
      <View style={styles.viewMoreLessStyle}>
        <Text onPress={onPress} style={{ fontWeight: '500' }}>
          View more
        </Text>
      </View>
    );
  }
  renderViewLess(onPress) {
    return (
      <View style={styles.viewMoreLessStyle}>
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
    const {
      name,
      description,

      createdAt,
      lastModified
    } = this.props.currentCompany;
    console.log('tab', this.state.index, this.state.isTabOneShowing);
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
          <CustomCard label="Name" textStyle={{ fontSize: 20, fontWeight: '500' }} text={name} />
          <CustomCard label="Description">
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
              badges={[this.props.employees.length, this.props.memos.length]}
              selectedIndex={this.state.index}
              height={40}
              onTabPress={this.handleTabSwitch.bind(this)}
              borderRadius={5}
              tabBadgeContainerStyle={{ backgroundColor: 'red' }}
            />

            {this.state.isTabOneShowing ? this.renderEmployeeTab() : this.renderMemoTab()}
          </CustomCard>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 14,
              marginTop: 10
            }}
          >
            {createdAt ? (
              <Text style={{ color: '#bfbfbf', fontSize: 10 }}>
                created: {moment(createdAt).format('M/DD/YYYY, HH:mm:ss')}
              </Text>
            ) : null}

            {lastModified ? (
              <Text style={{ color: '#bfbfbf', fontSize: 10 }}>
                last modified: {moment(lastModified).fromNow()}
              </Text>
            ) : null}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  companies: state.company.companies,
  isFetching: state.company.isFetching,
  currentCompany: state.company.currentCompany,
  employees: state.employee.employees,
  memos: state.memo.memos
});

export default connect(
  mapStateToProps,
  {
    getEmployees,
    getMemos,
    getCurrentCompany,
    toggleMemoFetching,
    toggleEmployeeFetching,
    unsubscribe
  }
)(ViewCompany);

const styles = {
  viewMoreLessStyle: {
    height: 25,
    marginTop: 5,
    backgroundColor: '#e2e2e2',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
