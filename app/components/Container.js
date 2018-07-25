import React from 'react';
import { View } from 'react-native';

const Container = ({ children, style, onStartShouldSetResponderCapture }) => (
  <View
    style={[styles.container, style]}
    onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
  >
    {children}
  </View>
);

export default Container;

const styles = {
  container: { flex: 1, backgroundColor: '#e0e0e2' }
};
