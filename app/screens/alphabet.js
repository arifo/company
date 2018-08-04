import React, { Component } from 'react';
import AlphabetListView from 'react-native-alphabetlistview';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getCompanies } from '../redux/actions';

class MyComponent extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      companies: [{}]
    };
  }

  componentDidMount() {
    this.props.getCompanies();
  }

  getFirstLetterFrom(value) {
    return value.slice(0, 1).toUpperCase();
  }

  renderItem = item => <Text style={styles.text}>{item.item.name}</Text>;

  renderHeader = headerItem => <Text style={styles.header}>{headerItem.section.key}</Text>;

  render() {
    let dataSource = this.props.companies;
    dataSource = _
      .chain(dataSource)
      .orderBy(['name'], 'asc')
      .groupBy(d => this.getFirstLetterFrom(d.name))
      .value();
    console.log('dataSource before reduce', dataSource);

    dataSource = _.reduce(
      dataSource,
      (acc, next, index) => {
        acc.push({
          key: index,
          data: next
        });
        return acc;
      },
      []
    );
    console.log('dataSource', dataSource);

    return (
      // <View style={styles.container}>
      //   <SectionList
      //     renderItem={this.renderItem}
      //     renderSectionHeader={this.renderHeader}
      //     sections={dataSource}
      //     keyExtractor={item => item.name}
      //   />
      // </View>

      <AlphabetListView
        data={dataSource}
        cell={item => {
          console.log(' cell item ', item);
          return <Text style={styles.text}>{item.item.key}</Text>;
        }}
        cellHeight={30}
        sectionListItem={item => {
          console.log(' sction list item ', item);
          return <Text style={styles.text}>{item.item.data}</Text>;
        }}
        sectionHeader={this.renderHeader}
        sectionHeaderHeight={22.5}
      />
    );
  }
}

const mapStateToProps = state => ({
  companies: state.company.companies
});

export default connect(
  mapStateToProps,
  { getCompanies }
)(MyComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5fcff',
    padding: 20,
    paddingTop: 40
  },
  text: {
    fontSize: 24,
    color: 'rgba(0,0,0,.5)'
  },
  header: {
    fontSize: 40
  }
});
