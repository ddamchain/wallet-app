import React, {Component} from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {Config, CoinConfig} from '../unit/AllUnit';

export default function CommonCell(props) {
  const {
    left,
    right,
    icon,
    arrow = true,
    source
  } = props
  return <View style={styles.view}>
    {source && <Image style={styles.titleImg} source={source}/>}
    <Text style={styles.title}>{left}</Text>
    <Text style={styles.detail}>{right}</Text>
    {arrow && <Image style={styles.arrow} source={require('../img/ddam/icon_fanhui.png')}/>}
  </View>
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 54,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Config.lineColor,
    alignItems: 'center'
  },
  title: {
    fontSize: 15,
    color: '#333',
    flex: 1
  },
  detail: {
    fontSize: 13,
    color: '#999'
  },
  arrow: {
    marginLeft: 10
  },
  titleImg: {
    resizeMode: 'contain',
    marginRight: 8
  }

});