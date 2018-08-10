import React from 'react';
import { Card, FormLabel, Text, TouchableOpacity } from 'react-native-elements';

const CustomCard = ({ label, text, children, containerStyle, textStyle }) => (
  <Card containerStyle={containerStyle}>
    <FormLabel labelStyle={{ marginTop: 0, marginLeft: 0 }}>{label}</FormLabel>

    <Text style={textStyle}>{text}</Text>

    {children}
  </Card>
);

export default CustomCard;
