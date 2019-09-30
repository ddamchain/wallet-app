import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  Clipboard,
  ImageBackground
} from 'react-native';
import {NavBar, TopPadding, Button, Shadow} from '../../widget/AllWidget'
import {Config, Toast, i18n} from '../../unit/AllUnit';
import QRCode from 'react-native-qrcode-svg';
import ImageCapInset from 'react-native-image-capinsets';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletPassword from './view/WalletPassword';
import WalletAction from '../../redux/actions/WalletAction';
class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      showInput: false
    };
    const {address} = WalletAction.selectedAccount();
    this.address = address;
  }

  onSharePress = () => {}
  onInputHide = (amount = '') => {
    this.setState({showInput: false, amount})
  }
  onShowInput = () => this.setState({showInput: true})

  render() {
    const {amount, showInput} = this.state;
    let qrcode = this.address;
    if (amount > 0) {
      qrcode = this.address + '?value=' + amount
    }

    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_receipt}/>
        <TopPadding></TopPadding>
        <ImageBackground
          style={styles.shadow}
          source={require('../../img/ddam/img_shoukuan_bg.png')}>
          <Text style={styles.text}>DDAM-Wallet</Text>
          <QRCode size={218} value={qrcode || "123"}></QRCode>
          <Text style={styles.address}>{this.address}</Text>
        </ImageBackground>
        <View style={styles.container}></View>
        <Button
          style={styles.copy}
          onPress={() => {
          Clipboard.setString(this.address);
          Toast(i18n.reload_copySuccess)
        }}>复制</Button>

      </View>
    )
  }

}

const topBgHeight = Config.width / 375 * 214;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  shadow: {
    width: 325,
    height: 375,
    alignItems: 'center',
    marginTop: 59
  },
  address: {
    fontSize: 13,
    color: '#999',
    margin: 20,
    marginHorizontal: 30
  },
  copy: {
    marginBottom: 70
  },
  infoView: {
    marginTop: -20,
    height: 49,
    width: Config.width - 74,
    backgroundColor: Config.appColor,
    borderTopLeftRadius: 4,
    borderTopEndRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  text: {
    fontSize: 15,
    color: '#fff',
    padding: 17,
    marginBottom: 18
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({}))(Page)