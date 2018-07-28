import React, { Component } from 'react';
import { PlatformIOS, ScrollView, TouchableOpacity, View } from 'react-native';
import { Header, Icon, List, ListItem, SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';

import { logoutAction, sortList } from '../redux/actions';

import Container from '../components/Container';
import AddImageBox from '../components/AddImageBox';

class Companies extends Component {
  state = {
    isSorted: false
  };
  componentDidUpdate() {
    const { loggedIn, navigation } = this.props;
    if (!loggedIn) {
      navigation.navigate('AuthLoading');
    }
  }

  render() {
    return (
      <Container>
        <Header
          leftComponent={
            <Icon
              type="ionicon"
              name={PlatformIOS ? 'ios-log-out' : 'md-log-out'}
              color="#fff"
              size={35}
              onPress={() => this.props.logoutAction()}
              underlayColor="transparent"
            />
          }
          centerComponent={{
            text: 'Company',
            style: { color: '#fff', fontSize: 16, fontWeight: '500' }
          }}
          rightComponent={
            <Icon
              name={PlatformIOS ? 'ios-add-circle' : 'md-add-circle'}
              type="ionicon"
              color="#fff"
              size={35}
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
            lightTheme
            showLoading
            containerStyle={{ backgroundColor: '#e0e0e2', flex: 0.9 }}
            platform={PlatformIOS ? 'ios' : 'android'}
            searchIcon={{ size: 24 }}
            clearIcon={{ color: 'grey' }}
            onChangeText={t => t}
            onClear={t => t}
            placeholder="Type Here..."
          />
          <Icon
            name={this.state.isSorted ? 'sort-alpha-desc' : 'sort-alpha-asc'}
            type="font-awesome"
            color="#fff"
            size={35}
            containerStyle={{ flex: 0.1, paddingRight: 8 }}
            onPress={() => {
              this.props.sortList(this.props.companies, this.state.isSorted);
              this.setState(previousState => ({ isSorted: !previousState.isSorted }));
            }}
            underlayColor="transparent"
          />
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 0, justifyContent: 'center' }}>
          {this.props.companies.length > 0 ? (
            <List containerStyle={{ marginBottom: 20 }}>
              {this.props.companies.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.name}
                  onPress={() => {
                    this.props.navigation.navigate('ViewCompany', {
                      title: `${l.name}`,
                      company: l
                    });
                  }}
                  component={TouchableOpacity}
                />
              ))}
            </List>
          ) : (
            <AddImageBox
              size={0.45}
              iconType="entypo"
              iconName="add-to-list"
              iconSize={100}
              text="Add Company"
              onPress={() =>
                this.props.navigation.navigate('AddCompany', {
                  title: 'New Company'
                })
              }
            />
          )}
        </ScrollView>
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
