import React from 'react';
import { TouchableOpacity, View, FlatList, StyleSheet } from 'react-native';
import { Avatar, Text } from 'react-native-elements';

const Item = props => {
  const { onPress, isMemoTab, item } = props;
  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8}>
      {isMemoTab ? (
        <View style={styles.rowContainer}>
          <Text numberOfLines={1} style={{ color: '#39393d', fontWeight: '500' }}>
            {item.title}
          </Text>
          <Text style={{ color: '#39393d' }}>{item.createdAt}</Text>
        </View>
      ) : (
        <View style={styles.employeRowStyle}>
          <Avatar medium rounded source={{ uri: item.avatar }} />
          <Text style={[styles.ratingTextStyle, { flex: 0.9 }]}>{item.name}</Text>
          <Text>
            rating: <Text style={styles.ratingTextStyle}>{item.rating}</Text>
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const CustomFlatList = props => (
  <FlatList
    data={props.data}
    keyExtractor={(item, index) => `${index}`}
    renderItem={({ item }) => <Item item={item} {...props} />}
  />
);

export default CustomFlatList;

const styles = StyleSheet.create({
  rowContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#b2b2b2',
    padding: 13
  },
  employeRowStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#b2b2b2',
    padding: 13,
    alignItems: 'center'
  },
  ratingTextStyle: {
    color: '#39393d',
    fontSize: 16,
    paddingHorizontal: 15
  }
});
