import React, {Component} from 'react';
import {Text, TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Config} from '../unit/AllUnit'

export default class Page extends Component {

  render() {

    const {
      inputProps = {},
      borderBottomWidth,
      borderTopWidth,
      renderRight,
      width = Config.width,
      leftWidth = 100,
      height = 56,
      color = '#333',
      leftColor = '#333',
      fontSize = 15,
      marginHorizontal = 0,
      paddingHorizontal = 15,
      onPress
    } = this.props
    let {readonly, value} = inputProps;
    const title = this.props.children;
    if (onPress) {
      readonly = true;
    }

    const textInputViewStyle = {
      height,
      marginHorizontal,
      paddingHorizontal,
      fontSize,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderColor: '#D8D8D8'
    }
    return (
      <View
        style={[
        styles.container, {
          width,
          height
        }
      ]}>
        <View
          style={{
          ...textInputViewStyle,
          borderBottomWidth,
          borderTopWidth
        }}>
          <Text
            style={[
            styles.textInputT, {
              width: leftWidth,
              color: leftColor
            }
          ]}>{title}</Text>

          {!readonly && <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            style={styles.input}
            underlineColorAndroid='transparent'
            {...inputProps}/>}
          {renderRight}
        </View>

        {onPress && <TouchableOpacity
          style={{
          width: Config.width,
          height: height,
          marginTop: -height
        }}
          onPress={onPress}></TouchableOpacity>}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    height: 56,
    backgroundColor: "#fff",
    alignItems: 'center'
  },

  textInputT: {
    fontSize: 15,
    color: '#333',
    width: 100
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 13,
    color: '#333',
    textAlign: 'right'
  },
  readonly: {
    flex: 1,
    fontSize: 15,
    color: '#333'
  }
});