import React from 'react';
import { TouchableOpacity, View, FlatList, StyleSheet, Image } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import moment from 'moment';

const Item = props => {
  const { onPress, isMemoTab, item, visible, close, avatarPress } = props;
  return (
    <TouchableOpacity onPress={() => onPress(item)} activeOpacity={0.8}>
      {isMemoTab ? (
        <View style={styles.rowContainer}>
          <Text numberOfLines={1} style={{ color: '#39393d', fontWeight: '500' }}>
            {item.title}
          </Text>
          <Text style={{ color: '#39393d' }}>
            {moment(item.createdAt).format('M/DD/YYYY, HH:mm:ss')}
          </Text>
        </View>
      ) : (
        <View style={styles.employeRowStyle}>
          {item.avatar ? (
            <View>
              <TouchableOpacity activeOpacity={0.9} onPress={() => avatarPress(item.avatar)}>
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.profileImage}
                  resizeMethod="resize"
                />
              </TouchableOpacity>
            </View>
          ) : (
            <Avatar
              rounded
              medium
              icon={{ type: 'font-awesome', name: 'user-o', size: 25 }}
              containerStyle={{ paddingHorizontal: 4 }}
            />
          )}
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
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#b2b2b2'
  }
});
