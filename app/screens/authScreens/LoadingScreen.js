import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, PlatformIOS, Alert } from 'react-native';
import firebase from 'firebase';
import NotifService from '../memoScreens/notification/NotifService';

import { loginAction, alreadyLoggedIn, getNotificationMemo } from '../../redux/actions';
import Container from '../../components/Container';

class LoadingScreen extends Component {
  constructor() {
    super();
    this.unsubscriber = null;
    this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.alreadyLoggedIn(navigation);
        return;
      }
      this.props.navigation.navigate('Auth');
    });
  }

  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  onNotif(notif) {
    const { navigation } = this.props;
    this.props.getNotificationMemo(notif.group, notif.tag, notif, navigation);
  }

  onRegister(token) {
    Alert.alert('Registered !', JSON.stringify(token));
    this.setState({ registerToken: token.token, gcmRegistered: true });
  }

  handlePerm(perms) {
    Alert.alert('Permissions', JSON.stringify(perms));
  }

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
  { loginAction, alreadyLoggedIn, getNotificationMemo }
)(LoadingScreen);
