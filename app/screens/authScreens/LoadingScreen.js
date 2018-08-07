import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, PlatformIOS, Alert } from 'react-native';
import firebase from 'firebase';
import NotifService from '../memoScreens/notification/NotifService';
import { NavigationActions, StackActions } from 'react-navigation';

import {
  loginAction,
  alreadyLoggedIn,
  toggleMemoFetching,
  toggleCompanyFetching
} from '../../redux/actions';
import Container from '../../components/Container';

class LoadingScreen extends Component {
  constructor() {
    super();
    this.unsubscriber = null;
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  componentDidMount() {
    this.getUserSession();
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  getUserSession = () => {
    const { navigation } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user true');
        this.props.alreadyLoggedIn(navigation);
        return;
      }
      console.log('user false');
      this.props.navigation.navigate('Auth');
    });
  };

  onRegister(token) {
    Alert.alert('Registered !', JSON.stringify(token));
    console.log(token);
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  onNotif(notif) {
    console.log(notif);
    const { navigation } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('user check onNotif true');
        this.props.alreadyLoggedIn(navigation);
        this.props.toggleCompanyFetching(true);
        this.props.toggleMemoFetching(true);
        this.resetStack(notif);
        this.notif.cancelNotif(notif.id);
        return;
      }
      console.log('user check onNotif false');
      this.props.navigation.navigate('Auth');
    });
  }

  handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }

  resetStack = notif => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 2,
        actions: [
          NavigationActions.navigate({
            routeName: 'Companies'
          }),
          NavigationActions.navigate({
            routeName: 'ViewCompany',
            params: {
              title: notif.title,
              companyID: notif.group
            }
          }),
          NavigationActions.navigate({
            routeName: 'ViewMemo',
            params: {
              title: notif.message,
              memoID: notif.tag
            }
          })
        ]
      })
    );
  };

  render() {
    return (
      <Container style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={PlatformIOS ? 'large' : 50} />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
});

export default connect(
  mapStateToProps,
  { loginAction, alreadyLoggedIn, toggleMemoFetching, toggleCompanyFetching }
)(LoadingScreen);
