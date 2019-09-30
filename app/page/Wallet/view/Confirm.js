import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
import {Config, i18n, ShowText} from '../../../unit/AllUnit'
import {Button} from '../../../widget/AllWidget'

export default class Page extends Component {

  render() {

    const {
      title = i18n.wallet_confirm_tx,
      info = i18n.wallet_confirm_info,
      value,
      address,
      target,
      gas,
      onHide,
      onPress
    } = this.props;

    return <View style={styles.container}>
      <TouchableOpacity style={styles.flex1} onPress={onHide}>
        <View/>
      </TouchableOpacity>

      <ImageBackground
        source={require('../../../img/wallet/bg_confirm.png')}
        resizeMode='stretch'
        style={styles.bg}>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amountV}>{value + ' DDAM'}</Text>

        <View style={styles.textV}>
          <Text style={styles.left}>{i18n.wallet_confirm_payInfo}</Text>
          <Text style={styles.right}>{info}</Text>
        </View>

        <View style={styles.textV}>
          <Text style={styles.left}>{i18n.wallet_confirm_target}</Text>
          <Text style={styles.right}>{ShowText.addressSting(target, 10)}</Text>
        </View>

        <View style={styles.textV}>
          <Text style={styles.left}>{i18n.wallet_confirm_source}</Text>
          <Text style={styles.right}>{ShowText.addressSting(address, 10)}</Text>
        </View>

        <View style={styles.textVWithoutL}>
          <Text style={styles.left}>{i18n.wallet_transfer_minerGas}</Text>
          <Text style={styles.right}>{gas}RA</Text>
        </View>

        <View style={styles.flex1}/>
        <Button style={styles.button} onPress={onPress}>下一步</Button>
      </ImageBackground>

      <TouchableOpacity style={styles.flex1} onPress={onHide}>
        <View/>
      </TouchableOpacity>
    </View>
  }
}

const textV = {
  flexDirection: 'row',
  height: 54,
  paddingHorizontal: 10,
  justifyContent: "space-between",
  backgroundColor: '#fff',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderColor: Config.borderColor
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  flex1: {
    flex: 1
  },
  bg: {
    width: Config.width - 30,
    height: 489,
    marginLeft: 15
  },
  title: {
    marginLeft: 50,
    marginTop: 54,
    color: "#fff",
    fontSize: 15,
    marginBottom: 15
  },
  amountV: {
    fontSize: 22,
    color: Config.appColor,
    padding: 13,
    alignSelf: 'center',
    fontWeight: '600'
  },
  textV,
  textVWithoutL: {
    ...textV,
    borderBottomWidth: 0
  },
  left: {
    fontSize: 15,
    color: '#333'
  },
  right: {
    fontSize: 13,
    color: '#999'
  },

  button: {
    marginBottom: 25,
    width: Config.width - 50
  }
})