import Spinner from 'react-native-loading-spinner-overlay';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  View,
  Image,
  Easing
} from 'react-native';

export default render = (props) => {
  const {showLoading} = props
  if (!showLoading) {
    return null;
  }
  return <Spinner
    visible={true}
    textContent={'Loading...'}
    textStyle={{
    color: "#fff"
  }}/>
}
