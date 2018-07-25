import React, { Component } from 'react';
import { PlatformIOS, ScrollView, TouchableOpacity } from 'react-native';
import { Header, Icon, List, ListItem } from 'react-native-elements';

import Container from '../components/Container';

const TEMP_DATA = [
  { name: 'ICBC' },
  { name: 'Apple Inc.' },
  { name: 'Berkshire Hathaway' },
  { name: 'ExxonMobil' },
  { name: 'Walmart' },
  { name: 'Toyota Motor' },
  { name: 'CITIBANK' },
  { name: 'Volkswagen' },
  { name: 'CVS' },
  { name: 'Royal Dutch Shell' },
  { name: 'State Grid Corporation of China' },
  { name: 'Nestlé' },
  { name: 'Procter & Gamble' },
  { name: 'The Walt Disney Company' },
  { name: 'AT&T' },
  { name: 'JPMorgan Chase' },
  { name: 'Wells Fargo' },
  { name: 'Alibaba' },
  { name: 'American Express' },
  { name: 'ICBC' }
];

class Companies extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Header
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
                  title: 'New Company',
                  type: 'new'
                })
              }
            />
          }
          innerContainerStyles={{ alignItems: 'center' }}
        />
        <ScrollView style={{ paddingHorizontal: 10 }}>
          <List containerStyle={{ marginBottom: 20 }}>
            {TEMP_DATA.map((l, i) => (
              <ListItem
                key={i}
                title={l.name}
                onPress={() =>
                  this.props.navigation.navigate('ViewCompany', {
                    title: `${l.name}`,
                    type: 'view'
                  })
                }
                component={TouchableOpacity}
              />
            ))}
          </List>
        </ScrollView>
      </Container>
    );
  }
}

export default Companies;

const styles = {
  container: { flex: 1 }
};
