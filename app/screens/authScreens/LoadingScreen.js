import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, PlatformIOS } from 'react-native';
import firebase from 'firebase';

import { loginAction, alreadyLoggedIn } from '../../redux/actions';
import Container from '../../components/Container';

class LoadingScreen extends Component {
  constructor() {
    super();
    this.unsubscriber = null;
    this.state = {
      progress: 0,
      indeterminate: true
    };
  }

  componentDidMount() {
    console.log('loading screen this.props.loggedIn', this.props.loggedIn);
    const { navigation } = this.props;
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.alreadyLoggedIn(navigation);
        // if (this.props.loggedIn) {
        //   this.props.navigation.navigate('App');
        // }
        console.log('user not null loggedIn state', this.props.loggedIn);
        return;
      }
      console.log(' this.props.navigation.navigate("Auth");');
      this.props.navigation.navigate('Auth');
      // this.props.navigation.navigate(this.props.loggedIn ? 'App' : 'Auth');
    });
  }

  componentWillUpdate() {}
  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
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
  { loginAction, alreadyLoggedIn }
)(LoadingScreen);
