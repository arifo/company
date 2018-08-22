import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  fullTextWrapper: {
    opacity: 0,
    position: 'absolute',
    left: 0,
    top: 0
  },
  viewMoreText: {
    color: 'blue'
  },
  transparent: {
    opacity: 0
  }
});

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

class ViewMoreText extends React.Component {
  trimmedTextHeight = null;
  fullTextHeight = null;
  shouldShowMore = false;

  state = {
    isFulltextShown: true,
    numberOfLines: this.props.numberOfLines
  };

  hideFullText = () => {
    if (this.state.isFulltextShown && this.trimmedTextHeight && this.fullTextHeight) {
      this.shouldShowMore = this.trimmedTextHeight < this.fullTextHeight;
      this.setState({
        isFulltextShown: false
      });
    }
  };

  onLayoutTrimmedText = event => {
    this.trimmedTextHeight = event.nativeEvent.layout.height;
    this.hideFullText();
  };

  onLayoutFullText = event => {
    this.fullTextHeight = event.nativeEvent.layout.height;
    this.hideFullText();
  };

  onPressMore = () => {
    this.setState({ numberOfLines: null }, () => this.props.afterExpand());
  };

  onPressLess = () => {
    this.setState({ numberOfLines: this.props.numberOfLines }, () => this.props.afterCollapse());
  };

  getWrapperStyle = () => {
    if (this.state.isFulltextShown) {
      return styles.transparent;
    }
    return {};
  };

  renderFooter = () => {
    const { numberOfLines } = this.state;

    if (this.shouldShowMore === true) {
      if (numberOfLines > 0) {
        return <ViewText text="View more" onPress={this.onPressMore} />;
      }
      return <ViewText text="View less" onPress={this.onPressLess} />;
    }
    return null;
  };

  renderFullText = () => {
    if (this.state.isFulltextShown) {
      return (
        <View onLayout={this.onLayoutFullText} style={styles.fullTextWrapper}>
          <Text style={this.props.textStyle}>{this.props.text}</Text>
        </View>
      );
    }
    return null;
  };

  render() {
    return (
      <View style={this.getWrapperStyle()}>
        <View onLayout={this.onLayoutTrimmedText}>
          <Text style={this.props.textStyle} numberOfLines={this.state.numberOfLines}>
            {this.props.text}
          </Text>
          {this.renderFooter()}
        </View>

        {this.renderFullText()}
      </View>
    );
  }
}

ViewMoreText.propTypes = {
  renderViewMore: PropTypes.func,
  renderViewLess: PropTypes.func,
  afterCollapse: PropTypes.func,
  afterExpand: PropTypes.func,
  numberOfLines: PropTypes.number.isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

ViewMoreText.defaultProps = {
  afterCollapse: () => {},
  afterExpand: () => {},
  textStyle: {}
};

export default ViewMoreText;
