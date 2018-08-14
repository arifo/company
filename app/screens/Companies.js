import React, { Component } from 'react';
import {
  PlatformIOS,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  FlatList,
  BackHandler
} from 'react-native';
import { Header, Icon, SearchBar, Text, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';
import AlphabetListView from 'react-native-alphabetlistview';

import {
  logoutAction,
  getCompanies,
  getEmployees,
  getMemos,
  toggleListenerFetching,
  unsubscribe
} from '../redux/actions';

import Container from '../components/Container';
import AddImageBox from '../components/AddImageBox';
import HeaderButton from '../components/HeaderButton';

class Companies extends Component {
  constructor(props) {
    super(props);
    this.search = null;

    this.state = {
      sortKey: 'asc',
      value: '',
      alphabetList: false,
      searchNoResult: false,
      searchFocused: false
    };
  }

  componentDidMount() {
    this.props.toggleListenerFetching(true);
    this.props.getCompanies();
    this.props.getEmployees();
    this.props.getMemos();

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!this.state.searchFocused) {
        return false;
      }
      
      this.search.blur();
      this.setState({ value: '' });
      return true;
    });
  }

  componentWillUnmount() {
    this.props.unsubscribe('company');
    this.props.unsubscribe('employee');
    this.props.unsubscribe('memo');
    this.backHandler.remove();
  }

  onChangeText = value => {
    this.setState({ value, searchNoResult: true });
  };

  onEndChangeText = () => {
    this.setState({ searchNoResult: false, searchFocused: false });
  };

  onListItemPress = item => {
    this.props.navigation.navigate('ViewCompany', {
      title: item.name,
      companyID: item.id
    });
  };

  onAddImagePress = () => {
    this.props.navigation.navigate('AddCompany', {
      title: 'New Company'
    });
  };

  onLogoutPress = () => {
    Alert.alert(
      'Are sure you want to Logout?',
      '',
      [
        {
          text: 'Yes',
          onPress: () => {
            this.props.logoutAction();
            this.props.navigation.navigate('AuthLoading');
          }
        },
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed') }
      ],
      { cancelable: true }
    );
  };

  onAddCompanyPress = () => {
    this.props.navigation.navigate('AddCompany', {
      title: 'New Company'
    });
  };

  getFirstLetterFrom(value) {
    return value.slice(0, 1).toUpperCase();
  }

  renderCell = item => (
    <TouchableOpacity
      style={{
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,.1)',
        height: 80,
        justifyContent: 'center',
        paddingLeft: 15
      }}
      onPress={() => this.onListItemPress(item.item)}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{ fontSize: 20, color: 'rgba(0,0,0,.5)' }}
      >
        {item.item.name}
      </Text>
    </TouchableOpacity>
  );

  renderSectionHeader = headerItem => (
    <View
      style={{
        backgroundColor: '#c0c0c2',
        justifyContent: 'center',
        alignItems: 'center',
        height: 30
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: 'rgba(0,0,0,.5)'
        }}
      >
        {headerItem.title}
      </Text>
    </View>
  );

  renderList(data) {
    if (this.state.alphabetList) {
      return (
        <AlphabetListView
          data={data}
          style={{ backgroundColor: '#fff' }}
          sectionHeaderHeight={30}
          cellHeight={80}
          sectionHeader={this.renderSectionHeader}
          cell={this.renderCell}
          updateScrollState
        />
      );
    }
    return (
      <FlatList
        data={data}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff' }}
        component={TouchableOpacity}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(0,0,0,.1)',
              justifyContent: 'center',
              paddingLeft: 15,
              paddingVertical: 5
            }}
            onPress={() => this.onListItemPress(item)}
          >
            <Text style={{ fontSize: 20, color: 'rgba(0,0,0,.5)' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }

  renderNoResults = () => (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: '600' }}>No results!!!</Text>
    </View>
  );

  renderAddBox = () => (
    <AddImageBox
      size={0.45}
      iconType="entypo"
      iconName="add-to-list"
      iconSize={100}
      text="Add Company"
      onPress={this.onAddImagePress}
    />
  );

  renderBlankList() {
    return this.state.searchNoResult ? this.renderNoResults() : this.renderAddBox();
  }

  render() {
    const { companies } = this.props;
    let data = _.chain(companies)
      .orderBy([item => item.name.toLowerCase()], [this.state.sortKey])
      .filter(item => {
        const i = item.name.toLowerCase();
        const k = this.state.value.toLowerCase();
        return i.includes(k);
      })
      .value();
    if (this.state.alphabetList) {
      data = _.groupBy(data, d => this.getFirstLetterFrom(d.name));
    }

    return (
      <Container>
        <Header
          leftComponent={
            <HeaderButton
              onPress={this.onLogoutPress}
              name={PlatformIOS ? 'ios-log-out' : 'md-log-out'}
            />
          }
          centerComponent={{
            text: 'Companies',
            style: { color: '#fff', fontSize: 20, fontWeight: '500' }
          }}
          rightComponent={
            <HeaderButton
              onPress={this.onAddCompanyPress}
              name={PlatformIOS ? 'ios-add-circle' : 'md-add-circle'}
            />
          }
          innerContainerStyles={{ alignItems: 'center' }}
        />
        <View style={{ flexDirection: 'row' }}>
          <SearchBar
            ref={search => (this.search = search)}
            onSubmitEditing={this.onEndChangeText}
            onBlur={this.onEndChangeText}
            onClearText={this.onEndChangeText}
            value={this.state.value}
            onFocus={() => {
              this.setState({ searchFocused: true });
            }}
            lightTheme
            showLoading
            containerStyle={{ backgroundColor: '#e0e0e2', flex: 0.9 }}
            platform={PlatformIOS ? 'ios' : 'android'}
            searchIcon={{ size: 24 }}
            clearIcon={{ color: 'grey' }}
            onChangeText={this.onChangeText}
            onClear={t => t}
            placeholder="Type Here..."
          />
          <Icon
            name={this.state.sortKey === 'asc' ? 'sort-ascending' : 'sort-descending'}
            type="material-community"
            color="#fff"
            size={35}
            containerStyle={{ flex: 0.1, paddingRight: 8 }}
            onPress={() => {
              this.setState(previousState => ({
                sortKey: previousState.sortKey === 'asc' ? 'desc' : 'asc'
              }));
            }}
            underlayColor="transparent"
          />
          <Icon
            name="sort-by-alpha"
            type="materialicons"
            color={this.state.alphabetList ? '#008fff' : '#ffffff'}
            size={35}
            containerStyle={{ flex: 0.1, paddingRight: 8 }}
            onPress={() => {
              this.setState(previousState => ({ alphabetList: !previousState.alphabetList }));
            }}
            underlayColor="transparent"
          />
        </View>
        {this.props.listerFetching ? (
          <View style={{ marginHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
            {/* <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
              <Text style={{ fontSize: 18, paddingHorizontal: 15 }}>Fetching companies...</Text>
              <Icon name="check" type="materialicons" color={'#008fff'} size={35} />
            </View> */}
            <ActivityIndicator size={PlatformIOS ? 'large' : 50} />
          </View>
        ) : null}
        {_.isEmpty(data) ? this.renderBlankList() : this.renderList(data)}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
  companies: state.company.companies,
  employees: state.employee.employees,
  memos: state.memo.memos,
  listerFetching: state.company.listerFetching,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    logoutAction,
    getCompanies,
    getEmployees,
    getMemos,
    toggleListenerFetching,
    unsubscribe
  }
)(Companies);
