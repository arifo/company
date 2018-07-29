import React, { Component } from 'react';
import { PlatformIOS, ScrollView, TouchableOpacity, View, FlatList } from 'react-native';
import { Header, Icon, List, ListItem, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash';

import { logoutAction, sortList } from '../redux/actions';

import Container from '../components/Container';
import AddImageBox from '../components/AddImageBox';

class Companies extends Component {
  state = {
    sortKey: 'asc',
    value: ''
  };
  componentDidUpdate() {
    const { loggedIn, navigation } = this.props;
    if (!loggedIn) {
      navigation.navigate('AuthLoading');
    }
  }

  onChangeText = value => {
    this.setState({ value });
  };

  onListItemPress = l => {
    this.props.navigation.navigate('ViewCompany', {
      title: l.name,
      company: l
    });
  };

  onAddImagePress = () => {
    this.props.navigation.navigate('AddCompany', {
      title: 'New Company'
    });
  };

  render() {
    const { companies } = this.props;
    const data = _
      .chain(companies)
      .orderBy(['name'], [this.state.sortKey])
      .filter(item => item.name.includes(this.state.value))
      .value();

    return (
      <Container>
        <Header
          leftComponent={
            <Icon
              type="ionicon"
              name={PlatformIOS ? 'ios-log-out' : 'md-log-out'}
              color="#fff"
              size={25}
              onPress={() => this.props.logoutAction()}
              underlayColor="transparent"
            />
          }
          centerComponent={{
            text: 'Companies',
            style: { color: '#fff', fontSize: 20, fontWeight: '500' }
          }}
          rightComponent={
            <Icon
              name={PlatformIOS ? 'ios-add-circle' : 'md-add-circle'}
              type="ionicon"
              color="#fff"
              size={25}
              onPress={() =>
                this.props.navigation.navigate('AddCompany', {
                  title: 'New Company'
                })
              }
              underlayColor="transparent"
            />
          }
          innerContainerStyles={{ alignItems: 'center' }}
        />
        <View style={{ flexDirection: 'row' }}>
          <SearchBar
            value={this.state.value}
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
        </View>

        {this.props.companies.length > 0 ? (
          <FlatList
            data={data}
            contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fff', marginHorizontal: 10 }}
            component={TouchableOpacity}
            renderItem={({ item }) => (
              <ListItem title={item.name} onPress={() => this.onListItemPress(item)} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <AddImageBox
            size={0.45}
            iconType="entypo"
            iconName="add-to-list"
            iconSize={100}
            text="Add Company"
            onPress={this.onAddImagePress}
          />
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
  companies: state.app.companies
});

export default connect(
  mapStateToProps,
  { logoutAction, sortList }
)(Companies);
