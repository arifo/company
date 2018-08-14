import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
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
      title: `${item.title}`,
      memoID: item.id,
      companyID
    });
  };

  onAddMemo = () => {
    const { companyID } = this.props.navigation.state.params;
    this.props.navigation.navigate('AddMemo', {
      title: 'New memo',
      companyID
    });
  };

  handleTabSwitch(index) {
    this.setState(previousState => ({ isTabOneShowing: !previousState.isTabOneShowing, index }));
  }

  showModal = avatar => {
    this.setState({ visible: true, selectedItem: avatar });
  };
  renderEmployeeTab() {
    const { companyID } = this.props.navigation.state.params;
    let data = this.props.employees;
    data = _.pickBy(data, (val, key) => val.companyID === companyID);
    data = _.map(data, (val, key) => val);
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
    const { companyID } = this.props.navigation.state.params;
    const data = _.chain(this.props.memos)
      .pickBy((val, key) => val.companyID === companyID)
      .map((val, key) => val)
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
    const { companyID } = this.props.navigation.state.params;
    const { name, description, createdAt, lastModified } = this.props.companies[companyID];
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
  viewMoreLessStyle: {
    height: 25,
    marginTop: 5,
    backgroundColor: '#e2e2e2',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
