import React from 'react';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import Container from '../../components/Container';

class LoadingScreen extends React.Component {
  componentDidMount() {
    this.props.navigation.navigate(this.props.loggedIn ? 'App' : 'Auth');
  }

  render() {
    return (
      <Container>
        <ActivityIndicator />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn
});

export default connect(mapStateToProps)(LoadingScreen);
