/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */
import 'react-native-gesture-handler'
import React, {Component} from 'react';
import {Text, TextInput} from 'react-native';
import RootNav from './app/page/RootNav';
import {Provider} from 'react-redux';
import ConfigureStore from './app/redux/store/ConfigureStore';
import codePush from "react-native-code-push";
import _ from 'lodash'

const store = ConfigureStore()

TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, {allowFontScaling: false,contextMenuHidden:false})
Text.defaultProps = Object.assign({}, Text.defaultProps, {allowFontScaling: false})
// console.warn = console.log;

class App extends Component {
  render() {
    return <Provider store={store}>
      <RootNav/>
    </Provider>
  }
}

MyApp = codePush(App);
export default MyApp;