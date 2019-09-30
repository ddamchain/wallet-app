import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TextInput,
  ScrollView
} from 'react-native';
import {
  NavBar,
  TopPadding,
  Button,
  InputView,
  Loading,
  KeyboardAwareScrollView
} from '../../widget/AllWidget'
import {
  Config,
  Toast,
  i18n,
  post,
  ShowText,
  NavigationService,
  ConstValue
} from '../../unit/AllUnit';
import ImageCapInset from 'react-native-image-capinsets';
import Confirm from './view/Confirm';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../redux/actions/WalletAction';
import {BigNumber} from 'bignumber.js/bignumber';
import WalletPassword from './view/WalletPassword';
import GasSet from './view/GasSet';
import {NavigationEvents} from 'react-navigation';

const {MIN_GAS_LIMIT, MIN_GAS_PRICE, TX_TYPE_TRANSEFER} = ConstValue;
// import {useScreens} from 'react-native-screens'; useScreens(true)

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      target: '',
      value: '',
      showConfirm: false,
      showPassword: false,
      showLoading: false,
      extraData: ''
    };

  }

  onValueChange = value => {

    value = BigNumber(value)
    if (isNaN(value)) 
      value = ''
    this.setState({value})
  }
  onTargetChange = target => {
    this.setState({target})
  }

  oneEtraDataChange = extraData => this.setState({extraData})

  componentDidMount() {
    const {updateNonce, updateSelectedBalance} = this.props;
    updateNonce(); //更新nonce
    updateSelectedBalance();

    // 处理从钱包首页传入qrcode的情况
    const params = this.props.navigation.state.params;
    if (params && params.data) {
      this.onSetQrdata(params.data)
    }
  }

  onDidFocus() {
    if (this.props) {
      const {updateNonce, updateSelectedBalance} = this.props;
      updateNonce && updateNonce(); //更新nonce
      updateSelectedBalance && updateSelectedBalance();
    }
  }

  onSetQrdata = data => {
    let {target, value} = this.state;
    if (data.address) {
      target = data.address
    }
    if (data.value) {
      value = BigNumber(data.value)
      if (isNaN(value)) 
        value = ''
    }
    this.setState({
      target,
      value: value + ''
    })
  }
  getQRCodeCallBack = (qrcode = '') => {
    const data = ShowText.dataFromQrcode(qrcode)
    this.onSetQrdata(data)
  }
  onQrPress = () => {
    NavigationService.toQrcode(this.getQRCodeCallBack);
  }

  onGasChange = ({gas, gasprice}) => {
    this.gas = gas;
    this.gasprice = gasprice;
  }

  onNextPress = () => {

    const {target, value} = this.state;

    const {gas, gasprice} = this;

    if (!value) {
      Toast(i18n.wallet_transfer_amountInfo)
      return;
    }
    let balance = WalletAction
      .selectedAccount()
      .value;

    if (value >= balance) {
      Toast(i18n.recharge_tooMore)
      return;
    }
    if (!target) {
      Toast(i18n.wallet_transfer_addressErr)
      return;
    }
    if (gas < MIN_GAS_LIMIT) {
      Toast(i18n.wallet_transfer_gasLimitErr + MIN_GAS_LIMIT)
      return;
    }
    this.setState({showConfirm: false, showPassword: true})
  }

  onConfirmPress = () => {
    this.setState({showConfirm: false, showPassword: true})
  }

  onGetPassword = pwd => {
    this.setState({showPassword: false})
    if (!pwd) {
      return;
    }
    const {password} = this.props.wallet;
    if (password != pwd) {
      Toast(i18n.wallet_manager_pwdErr)
      return;
    }
    const noncePlus = this.props.noncePlus;
    const {nonce, sk, address} = WalletAction.selectedAccount();

    const {target, value, extraData} = this.state;
    const {gas, gasprice} = this;
    this.setState({showLoading: true})

    WalletAction.SignAndPost({
      sk: sk,
      data: '',
      target,
      value: value,
      gas,
      gasprice: gasprice,
      tx_type: TX_TYPE_TRANSEFER,
      nonce,
      data: extraData
    }, data => {
      console.warn(data);
      this.setState({showLoading: false})
      if (data.result.status != 0) {
        Toast(data.result.message || 'error')
      } else {
        const params = this.props.navigation.state.params;
        const hash = data.result.data;
        if (params && params.callback) {
          params.callback(address, hash)
        }
        NavigationService.navigate('Success', {hash, title: '转账交易成功'});
        noncePlus();
        this.setState({extraData: '', value: '', target: ''})
      }

    })

  }

  render() {
    const {target, value, showConfirm, showPassword, extraData} = this.state;
    const account = WalletAction.selectedAccount()
    const address = account.address;
    let balance = account.value;

    let allBalance = ShowText.toFix(balance, 4, true)
    if (!allBalance || allBalance.length < 6) {
      allBalance = '0.0000'
    }
    const {gas, gasprice} = this;

    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={this.onDidFocus}></NavigationEvents>

        <Image
          source={require('../../img/ddam/img_zhuanzhangbg.png')}
          style={styles.topBg}/>
        <NavBar
          title='DDAM 转账'
          color='#fff'
          backgroundColor='rgba(44, 95, 243, 0.5)'
          hideLine
          left={{
          title: 'white_back',
          onPress: NavigationService.pop
        }}
          right={[{
            title: 'white_qrcode',
            onPress: this.onQrPress
          }
        ]}/>

        <View style={styles.balanceV}>
          <Text style={styles.balance}>{i18n.recharge_balance}</Text>
          <Text style={styles.textValue} numberOfLines={0}>{allBalance.slice(0, -5)}
            <Text style={styles.decimalValue}>
              {allBalance.slice(allBalance.length - 5)}
              &nbsp;DDAM
            </Text>

          </Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}>
          <KeyboardAwareScrollView>
            <TopPadding></TopPadding>

            <InputView
              borderBottomWidth={0.5}
              inputProps={{
              placeholder: i18n.wallet_transfer_amountInfo,
              value: value,
              onChangeText: this.onValueChange,
              keyboardType: 'number-pad'
            }}>DDAM</InputView>
            <InputView
              borderBottomWidth={0.5}
              inputProps={{
              placeholder: '请输入' + i18n.wallet_transfer_address,
              contextMenuHidden: false,
              value: target,
              onChangeText: this.onTargetChange
            }}>{i18n.wallet_transfer_address}</InputView>
            <InputView
              leftColor='#999'
              inputProps={{
              placeholder: i18n.wallet_transfer_mark,
              onChangeText: this.oneEtraDataChange,
              value: extraData
            }}>{i18n.wallet_transfer_mark}</InputView>
            <TopPadding/>

            <GasSet onGasChange={this.onGasChange}></GasSet>

            <View style={styles.line}></View>
            <Button style={styles.button} onPress={this.onNextPress}>{i18n.my_continue}</Button>

          </KeyboardAwareScrollView>
        </ScrollView>

        {showConfirm && <Confirm
          value={value}
          target={target}
          gas={gasprice * gas}
          address={address}
          onPress={this.onConfirmPress}
          onHide={() => this.setState({showConfirm: false})}/>}

        {showPassword && <WalletPassword
          title={i18n.wallet_manager_password}
          placeholder={i18n.wallet_manager_password}
          onHide={this.onGetPassword}/>}
        {this.state.showLoading && <Loading showLoading={true}></Loading>}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  topBg: {
    position: 'absolute',
    width: Config.width,
    height: Config.navBarHeight + 75 + 2,
    top: 0,
    resizeMode: 'stretch'
  },
  balanceV: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    height: 75,
    paddingHorizontal: 35,
    justifyContent: 'space-between',
    width: Config.width
  },
  textValue: {
    fontSize: 25,
    fontFamily: "PingFangSC-Medium",
    fontWeight: '500',
    color: "#fff"
  },
  decimalValue: {
    fontSize: 18
  },
  balance: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'left',
    width: 85
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Config.width - 30,
    padding: 10,
    paddingRight: 15,
    paddingLeft: 25
  },
  text: {
    fontSize: 15,
    color: '#333'
  },
  flex1: {
    flex: 1,
    width: 100
  },
  button: {
    marginTop: 35,
    marginBottom: 20
  },
  line: {
    width: Config.width,
    height: 1,
    backgroundColor: '#D5D5D5'
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  deleteAccount: bindActionCreators(WalletAction.deleteAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch),
  updateNonce: bindActionCreators(WalletAction.updateNonce, dispatch),
  noncePlus: bindActionCreators(WalletAction.noncePlus, dispatch),
  updateSelectedBalance: bindActionCreators(WalletAction.updateSelectedBalance, dispatch)
}))(Page)