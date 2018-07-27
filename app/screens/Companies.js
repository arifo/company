import React, { Component } from 'react';
import { PlatformIOS, ScrollView, TouchableOpacity, View, Dimensions, Picker } from 'react-native';
import { Header, Icon, List, ListItem, SearchBar, Text } from 'react-native-elements';
import { connect } from 'react-redux';

import { logoutAction, sortList } from '../redux/actions';

import Container from '../components/Container';

const deviceWidth = Dimensions.get('screen').width;

class Companies extends Component {
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
            name="sort"
            type="MaterialCommunityIcons"
            color="#fff"
            size={35}
            containerStyle={{ flex: 0.1, paddingRight: 8 }}
            onPress={() => {
              const newArray = JSON.parse(JSON.stringify(this.props.companies)).sort((a, b) => {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
              this.props.sortList(newArray);
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
                this.props.navigation.navigate('AddCompany', {
                  title: 'New Company'
                })
              }
            >
              <Icon
                type="entypo"
                name="add-to-list"
                color={'#b7bbbf'}
                size={80}
                underlayColor="transparent"
              />
              <Text
                style={{
                  // fontSize: 12,
                  color: '#b7bbbf'
                }}
              >
                Add company
              </Text>
            </TouchableOpacity>
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
