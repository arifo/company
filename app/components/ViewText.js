import * as React from 'react';
import { View, Text } from 'react-native';

const ViewText = ({ onPress, text }) => (
  <View
    style={{
      height: 25,
      marginTop: 5,
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Text onPress={onPress} style={{ fontWeight: '500' }}>
      {text}
    </Text>
  </View>
);

export default ViewText;
