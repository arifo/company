'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';

const returnTrue = () => true;
let firstSectionOffset = 0;
let sectionHeight = 0;

export default class SectionList extends Component {
  constructor(props, context) {
    super(props, context);

    this.onSectionSelect = this.onSectionSelect.bind(this);
    this.resetSection = this.resetSection.bind(this);
    this.detectAndScrollToSection = this.detectAndScrollToSection.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.lastSelectedIndex = null;
  }

  onSectionSelect(sectionId, fromTouch) {
    this.props.onSectionSelect && this.props.onSectionSelect(sectionId);

    if (!fromTouch) {
      this.lastSelectedIndex = null;
    }
  }

  resetSection() {
    this.lastSelectedIndex = null;
  }

  detectAndScrollToSection(e) {
    const ev = e.nativeEvent.touches[0];
    const targetY = ev.locationY;
    let index =
      targetY < firstSectionOffset ? 0 : Math.floor((targetY - firstSectionOffset) / sectionHeight);

    index = Math.min(index, this.props.sections.length - 1);

    if (this.lastSelectedIndex !== index) {
      this.lastSelectedIndex = index;
      this.onSectionSelect(this.props.sections[index], true);
    }
  }

  onLayout(event) {
    firstSectionOffset = event.nativeEvent.layout.y;
    sectionHeight = event.nativeEvent.layout.height;
  }

  render() {
    const SectionComponent = this.props.component;
    const sections = this.props.sections.map((section, index) => {
      const title = this.props.getSectionListTitle
        ? this.props.getSectionListTitle(section)
        : section;

      const textStyle = this.props.data[section].length ? styles.text : styles.inactivetext;

      const child = SectionComponent ? (
        <SectionComponent sectionId={section} title={title} />
      ) : (
        <View style={styles.item}>
          <Text style={textStyle}>{title}</Text>
        </View>
      );

      return (
        <View
          key={index}
          onLayout={index === 0 ? this.onLayout : undefined}
          ref={`sectionItem${index}`}
          pointerEvents="none"
        >
          {child}
        </View>
      );
    });

    return (
      <View
        ref="view"
        style={[styles.container, this.props.style]}
        onStartShouldSetResponder={returnTrue}
        onMoveShouldSetResponder={returnTrue}
        onResponderGrant={this.detectAndScrollToSection}
        onResponderMove={this.detectAndScrollToSection}
        onResponderRelease={this.resetSection}
      >
        {sections}
      </View>
    );
  }
}

SectionList.propTypes = {
  /**
   * A component to render for each section item
   */
  component: PropTypes.func,

  /**
   * Function to provide a title the section list items.
   */
  getSectionListTitle: PropTypes.func,

  /**
   * Function to be called upon selecting a section list item
   */
  onSectionSelect: PropTypes.func,

  /**
   * The sections to render
   */
  sections: PropTypes.array.isRequired,

  /**
   * A style to apply to the section list container
   */
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
    width: 15
  },

  item: {
    padding: 0
  },

  text: {
    fontWeight: '700',
    color: '#008fff'
  },

  inactivetext: {
    fontWeight: '700',
    color: '#CCCCCC'
  }
});
