import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, PlatformIOS } from 'react-native';
import firebase from 'firebase';

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
