import React, { Component } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import SegmentControl from 'react-native-segment-controller';
import ViewMoreText from 'react-native-view-more-text';

import {
  getEmployees,
  getMemos,
  getCurrentCompany,
  toggleMemoFetching,
  toggleEmployeeFetching
} from '../../redux/actions';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';
import AddImageBox from '../../components/AddImageBox';
import CustomFlatList from '../../components/CustomFlatList';
import ImagePreview from '../../components/ImagePreview';
import ViewText from '../../components/ViewText';

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
    const { type } = this.props.navigation.state.params;
    if (type === 'fromEditScreen') {
      this.handleTabSwitch(1);
    }
  }

  onEmployeeSelect = item => {
    const { companyID } = this.props.navigation.state.params;
    this.props.navigation.navigate('ViewEmployee', {
      title: item.name,
      employeeID: item.id,
      companyID
    });
  };

  onAddEmployee = () => {
    const { companyID } = this.props.navigation.state.params;
    this.props.navigation.navigate('AddEmployee', {
      title: 'New employee',
      companyID
    });
  };

  onMemoSelect = item => {
    const { companyID } = this.props.navigation.state.params;
    this.props.navigation.navigate('ViewMemo', {
      companyID,
      title: `${item.title}`,
      memoID: item.id
    });
  };

  onAddMemo = () => {
    const { companyID } = this.props.navigation.state.params;
    this.props.navigation.navigate('AddMemo', {
      companyID,
      title: 'New memo'
    });
  };

  tabs = [this.renderEmployeeTab, this.renderMemoTab];

  handleTabSwitch = index => this.setState({ index });

  showModal = avatar => this.setState({ visible: true, selectedItem: avatar });

  renderTab = () => this.tabs[this.state.index].call(this);

  renderEmployeeTab() {
    const { companyID } = this.props.navigation.state.params;
    let data = this.props.employees;
    data = _.pickBy(data, val => val.companyID === companyID);
    data = _.map(data, val => val);

    return (
      <View style={styles.tab.container}>
        <View
          style={styles.tab.innerContainer}
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

        <Button title="Add employee" buttonStyle={styles.tab.button} onPress={this.onAddEmployee} />
      </View>
    );
  }

  renderMemoTab() {
    const { companyID } = this.props.navigation.state.params;
    const data = _.chain(this.props.memos)
      .pickBy(val => val.companyID === companyID)
      .map(val => val)
      .orderBy(['lastModified', 'createdAt'], [this.state.sortKey])
      .value();
    return (
      <View style={styles.tab.container}>
        <View
          style={styles.tab.innerContainer}
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: false });
          }}
        >
          <CustomFlatList isMemoTab data={data} onPress={this.onMemoSelect} />
          {data.length === 0 && (
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
            buttonStyle={styles.tab.button}
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

  render() {
    const { companyID } = this.props.navigation.state.params;
    const { name, description, createdAt, lastModified } = this.props.companies[companyID];
    const employees = _.pickBy(this.props.employees, val => val.companyID === companyID);
    const memos = _.pickBy(this.props.memos, val => val.companyID === companyID);
    const employeesCount = Object.keys(employees).length;
    const memosCount = Object.keys(memos).length;

    return (
      <Container
        style={{ alignItems: 'center' }}
        onStartShouldSetResponderCapture={() => {
          this.setState({ enableScrollViewScroll: true });
        }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          scrollEnabled={this.state.enableScrollViewScroll}
        >
          <CustomCard label="Name" textStyle={{ fontSize: 20, fontWeight: '500' }} text={name} />
          <CustomCard label="Description">
            <ViewMoreText
              numberOfLines={5}
              renderViewMore={onPress => <ViewText onPress={onPress} text="View more" />}
              renderViewLess={onPress => <ViewText onPress={onPress} text="View less" />}
              textStyle={{ textAlign: 'justify' }}
            >
              <Text>{description}</Text>
            </ViewMoreText>
          </CustomCard>

          <CustomCard>
            <SegmentControl
              values={['Employees', 'Memos']}
              badges={[employeesCount, memosCount]}
              selectedIndex={this.state.index}
              height={40}
              onTabPress={this.handleTabSwitch.bind(this)}
              borderRadius={5}
              tabBadgeContainerStyle={{ backgroundColor: 'red' }}
            />
            {this.renderTab()}
          </CustomCard>

          <View style={styles.infoTextContainer}>
            {createdAt && (
              <Text style={styles.infoText}>
                created: {moment(createdAt).format('M/DD/YYYY, HH:mm:ss')}
              </Text>
            )}

            {lastModified !== '' && (
              <Text style={styles.infoText}>last modified: {moment(lastModified).fromNow()}</Text>
            )}
          </View>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  companies: state.company.companies,
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
    toggleEmployeeFetching
  }
)(ViewCompany);

const styles = {
  tab: {
    container: { marginTop: 20, maxHeight: deviceHeight * 0.45, flexGrow: 1 },
    innerContainer: { maxHeight: deviceHeight * 0.35, justifyContent: 'center', flexGrow: 1 },
    button: { marginVertical: 20, backgroundColor: '#0082C0' }
  },
  scrollView: { paddingBottom: 40, width: deviceWidth },
  infoText: { color: '#bfbfbf', fontSize: 10 },
  infoTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 10
  }
};
