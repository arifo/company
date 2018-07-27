import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { FormInput, FormValidationMessage, FormLabel } from 'react-native-elements';

class Input extends PureComponent {
  state = {
    isFocused: false
  };

  handleTouch = () => {
    this.setState({ isFocused: false });
    this.props.onTouch(this.props.name);
  };

  handleFocus = () => this.setState({ isFocused: true });

  handleTextChange = value => {
    this.props.onChange(this.props.name, value);
  };

  render() {
    const { label, error, containerStyle, inputContainerStyle, inputStyle, ...rest } = this.props;
    return (
      <View style={containerStyle}>
        <FormLabel>{label}</FormLabel>
        <FormInput
          placeholderTextColor="#cccccc"
          onBlur={this.handleTouch}
          onFocus={this.handleFocus}
          onChangeText={this.handleTextChange}
          ref={input => this.props.inputRef && this.props.inputRef(input)}
          underlineColorAndroid="transparent"
          containerStyle={inputContainerStyle}
          inputStyle={[
            inputStyle,
            {
              width: '100%',
              borderBottomColor: this.state.isFocused ? '#0082C0' : '#828282',
              borderBottomWidth: this.state.isFocused ? 2 : 1
            }
          ]}
          {...rest}
        />
        {error && <FormValidationMessage>{error}</FormValidationMessage> ? (
          error && <FormValidationMessage>{error}</FormValidationMessage>
        ) : (
          <Text style={{ color: 'transparent' }}>hello</Text>
        )}
      </View>
    );
  }
}

export default Input;
