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
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log('firebase current User exists');
        // this.notif = new NotifService(this.onRegister.bind(this), this.onNotif.bind(this));
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

  // onNotif(notif) {
  //   const { navigation } = this.props;
  //   console.log('notification', notif);
  //   if (this.props.loggedIn) {
  //     const memo = this.props.memo[notif.memoID];
  //     const company = this.props.company[notif.companyID];
  //     this.props.getNotificationMemo(memo, company, notif, navigation);
  //   }
  // }

  // onRegister(token) {
  //   Alert.alert('Registered !', JSON.stringify(token));
  //   this.setState({ registerToken: token.token, gcmRegistered: true });
  // }

  render() {
    console.log('loading screen state', this.props.state);
    return (
      <Container style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={PlatformIOS ? 'large' : 50} />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
  company: state.company.companies,
  memo: state.memo.memos,
  state
});

export default connect(
  mapStateToProps,
  { loginAction, alreadyLoggedIn, getNotificationMemo }
)(LoadingScreen);
