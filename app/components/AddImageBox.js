import React from 'react';
import { Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, Text } from 'react-native-elements';

const deviceWidth = Dimensions.get('screen').width;

const AddImageBox = ({ onPress, size, iconType, iconName, iconSize, text }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={[styles.container, { width: deviceWidth * size, height: deviceWidth * size }]}
    onPress={onPress}
  >
    <Icon
      type={iconType}
      name={iconName}
      color={'#b7bbbf'}
      size={iconSize}
      underlayColor="transparent"
    />
    <Text style={{ color: '#b7bbbf' }}>{text}</Text>
  </TouchableOpacity>
);

export default AddImageBox;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: deviceWidth * 0.45,
    height: deviceWidth * 0.45,
    borderWidth: 3,
    borderColor: '#d4d5d6',
    borderRadius: 5,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e8ea',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5
  }
});
