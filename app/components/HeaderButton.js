import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const HeaderButton = ({ onPress, name, type, color, size }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
    <Icon
      containerStyle={{ padding: 12 }}
      name={name}
      type={type || 'ionicon'}
      color={color || '#fff'}
      size={size || 25}
      underlayColor="transparent"
    />
  </TouchableOpacity>
);

export default HeaderButton;
