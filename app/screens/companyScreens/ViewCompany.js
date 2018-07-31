import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Button, Text, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import SegmentControl from 'react-native-segment-controller';
import ViewMoreText from 'react-native-view-more-text';
import _ from 'lodash';

import { getEmployees } from '../../redux/actions';

import Container from '../../components/Container';
import CustomCard from '../../components/CustomCard';
import AddImageBox from '../../components/AddImageBox';
import CustomFlatList from '../../components/CustomFlatList';

const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

class ViewCompany extends Component {
  state = {
    index: 0,
    isTabOneShowing: true,
    enableScrollViewScroll: true,
    sortKey: 'asc'
  };

  componentDidMount() {
    const { id } = this.props.navigation.state.params.company;
    this.props.getEmployees(id);
  }

  handleTabSwitch(index) {
    this.setState(previousState => ({ isTabOneShowing: !previousState.isTabOneShowing, index }));
  }

  onEmployeeSelect = item =>
    this.props.navigation.navigate('ViewEmployee', {
      title: `${item.name}`,
      employee: item
    });

  onAddEmployee = () =>
    this.props.navigation.navigate('AddEmployee', {
      title: 'New employee',
      company: this.props.navigation.state.params.company
    });

  onMemoSelect = item =>
    this.props.navigation.navigate('ViewMemo', {
      title: `${item.title}`,
      memo: item
    });

  onAddMemo = () =>
    this.props.navigation.navigate('AddMemo', {
      title: 'New memo',
      company: this.props.navigation.state.params.company
    });

  renderEmployeeTab() {
    // const { employees } = this.props.navigation.state.params.company;
    // console.log('nav employees in render employee', employees);
    // const data = _.filter(this.props.employees, employee => _.includes(employees, employee.id));
    // console.log('data employee', data);
    const data = this.props.employees;
    return (
      <View style={{ marginTop: 20, maxHeight: deviceHeight * 0.5, flexGrow: 1 }}>
        <View
          style={{ maxHeight: deviceHeight * 0.4, justifyContent: 'center', flexGrow: 1 }}
          onStartShouldSetResponderCapture={() => {
            this.setState({ enableScrollViewScroll: false });
          }}
        >
          {data.length > 0 ? (
            <CustomFlatList data={data} onPress={this.onEmployeeSelect} />
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
    const { memos } = this.props.navigation.state.params.company;
    const data = _
      .chain(this.props.memos)
      .filter(memo => _.includes(memos, memo.id))
      .orderBy(['createdAt'], [this.state.sortKey])
      .value();
    return (
      <View style={{ marginTop: 20, maxHeight: deviceHeight * 0.5, flexGrow: 1 }}>
        <View
          style={{ maxHeight: deviceHeight * 0.4, justifyContent: 'center', flexGrow: 1 }}
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
            name={this.state.sortKey === 'asc' ? 'angle-double-up' : 'angle-double-down'}
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
    const { name, description, employees, memos } = this.props.navigation.state.params.company;
    console.log('nav props in view company', this.props.navigation.state.params.company);
    console.log('this.props.employees', this.props.employees);
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
              onTabPress={this.handleTabSwitch.bind(this)}
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
  companies: state.company.companies,
  employees: state.employee.employees,
  memos: state.memo.memos
});

export default connect(
  mapStateToProps,
  { getEmployees }
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
