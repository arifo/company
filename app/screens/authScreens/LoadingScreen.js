import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';
import firebase from 'firebase';

import { loginAction } from '../../redux/actions';
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
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      if (user != null) {
        this.props.loginAction();
      }
    });

    this.props.navigation.navigate(this.props.loggedIn ? 'App' : 'Auth');
  }
  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    return (
      <Container style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Progress.CircleSnail
          progress={this.state.progress}
          indeterminate={this.state.indeterminate}
          thickness={3}
          duration={500}
          size={60}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
});

export default connect(
  mapStateToProps,
  { loginAction }
)(LoadingScreen);
