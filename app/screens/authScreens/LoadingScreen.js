import React from 'react';
import { connect } from 'react-redux';
import * as Progress from 'react-native-progress';

import Container from '../../components/Container';

class LoadingScreen extends React.Component {
  state = {
    progress: 0,
    indeterminate: true
  };
  componentDidMount() {
    this.props.navigation.navigate(this.props.loggedIn ? 'App' : 'Auth');
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

export default connect(mapStateToProps)(LoadingScreen);
