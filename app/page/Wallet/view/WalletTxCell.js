import React, {Component} from 'react';
import {StyleSheet, Text, Image, View, TouchableOpacity} from 'react-native';
import {Config, ShowText, NavigationService} from '../../../unit/AllUnit';
import {Shadow} from '../../../widget/AllWidget';

function getSymbolAndImg(params) {}

export default function Cell(props) {
  let ads = props.userAdderss;
  let item = props.item;
  let valueSymbol = '';
  let imgSource = require('../../../img/ddam/tx_1.png');
  let valueStyle = styles.normalValue;

  if (item.target == ads) { // 转入
    status = 0;
    valueSymbol = '+'
    showAddress = ShowText.addressSting(item.source);
    imgSource = require('../../../img/ddam/tx_2.png');
    valueStyle = styles.value;
  } else if (item.source + "" == ads) {
    showAddress = ShowText.addressSting(item.target)
    valueSymbol = '-'
  }

  const {localStatus} = item;
  let statusText = ''
  if (localStatus) {
    statusText = ['未打包', '确认中', '确认'][(localStatus - 1) % 2];
  }

  return (
    <TouchableOpacity
      onPress={() => {
      if (!localStatus) {
        NavigationService.navigate('TransactionDetails', {hash: item.hash})
      }
    }}>
      <View style={styles.cell}>
        <Image source={imgSource} style={styles.img}/>
        <View style={styles.rowV}>
          <View style={styles.left}>
            <Text style={styles.address}>{ShowText.addressSting(item.target)}</Text>
            <Text style={styles.time}>{item.curTime}</Text>
          </View>
          <View>
            <Text style={valueStyle}>{valueSymbol}{item.value + " DDAM"}</Text>
            {statusText.length > 0 && <Text style={styles.status}>{statusText}</Text>}
          </View>

        </View>
      </View>

    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({

  cell: {
    width: Config.width,
    height: 69,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  img: {
    marginLeft: 15,
    marginRight: 12
  },
  rowV: {
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#D5D5D5',
    flex: 1,
    height: 69
  },

  left: {
    flex: 1
  },
  address: {
    fontSize: 15,
    color: '#333333'
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 8
  },
  value: {
    fontSize: 15,
    color: Config.appColor,
    marginRight: 15
  },
  normalValue: {
    fontSize: 15,
    color: '#999999',
    marginRight: 15
  },
  status: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    alignSelf: 'flex-end',
    marginRight: 15
  }

});

/*


      <Shadow style={styles.bg}>
        <View
          style={[
          styles.cell, {
            height: cellHeight
          }
        ]}>
          <View
            style={[
            styles.line, {
              height: lineHeight
            }
          ]}></View>
          <View style={styles.flex1}>
            <View style={styles.rowCenter}>

              <Image style={styles.imgBox} source={imgSource}></Image>
              <View style={styles.flex1}>
                <Text style={styles.userName}>{ShowText.addressSting(item.target)}</Text>
                <Text style={styles.userDate}>{item.curTime}</Text>
              </View>
              <View >
                <Text style={styles.userNumber}>{valueSymbol}{item.value + " DDAM"}</Text>
                <Image
                  style={styles.img}
                  source={valueSymbol == '+'
                  ? require('../../../img/wallet/img_receiveAllPage.png')
                  : require('../../../img/wallet/img_sendAllPage.png')}></Image>
              </View>
            </View>
            {localStatus > 0 && <View style={styles.row}>
              {statusList.map((item, index) => {
                if (index < localStatus) {
                  return <Image
                    source={require('../../../img/wallet/icon_chanpinzhouqi_choose.png')}
                    key={index}></Image>
                } else {
                  return <View style={styles.unchose} key={index}></View>
                }
              })}
            </View>
}

            {localStatus > 0 && <View style={styles.rowText}>
              {statusList.map((item, index) => {
                let textStyle = index < localStatus
                  ? styles.choseText
                  : styles.unchoseText;
                return <Text style={textStyle} key={index}>{item}</Text>
              })}
            </View>
}

          </View>

        </View>

      </Shadow>

*/