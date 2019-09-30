import React, {Component} from 'react';
import {StyleSheet, Text, Image, View} from 'react-native';
import {Config} from '../unit/AllUnit'

const no_list = require('../img/ddam/img_zanwushuju.png')
const no_data = require('../img/ddam/img_zanwushuju.png')
const no_coin = require('../img/ddam/img_zanwushuju.png')
const allNoImg = {
  no_list,
  no_data,
  no_coin
}

export default class Space extends Component {

  render() {

    let {text, img, hide, buttonText, onPress} = this.props
    if (hide) 
      return <View style={{
        height: 50
      }}></View>
    if (!text) 
      text = '暂无数据'
    img = allNoImg[img] || no_list

    return (
      <View style={styles.view}>
        <Image style={styles.imgstyle} source={img}/>
        <Text style={styles.text}>{text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0)'
  },

  imgstyle: {},

  text: {
    color: '#666',
    fontSize: 14,
    padding: 20
  }

})
