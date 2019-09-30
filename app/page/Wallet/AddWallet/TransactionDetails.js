import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Linking,
  Clipboard
} from 'react-native';
import {NavBar, TopPadding, Button, InputWithAnimate, Loading} from '../../../widget/AllWidget'
import {
  Config,
  chainRequest,
  Toast,
  ShowText,
  fullUrlRequest,
  i18n,
  TxManager
} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import ImageCapInset from 'react-native-image-capinsets';
const statusObj = { // todo 未知type 祥ConsValue.js
  0: i18n.wallet_tx_type0,
  1: i18n.wallet_tx_type1,
  2: i18n.wallet_tx_type2,
  3: i18n.wallet_tx_type3,
  4: '',
  5: i18n.wallet_tx_type5,
  6: i18n.wallet_tx_type6
}
export default class Page extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Transaction: {
        type: ''
      },
      Receipt: {},
      td: {},
      showLoading: true
    }
    if (this.props.navigation.state.params) {
      this.hash = this.props.navigation.state.params.hash;
      this.key = this.props.navigation.state.params.key
    }
    // this.hash =
    // '0x34fa69c3cfb958b386eb2fcde1961693f90df7a517f7b344af8cc15bc810cad9';
    // Toast('hash 是写死的')
  }

  componentDidMount = () => {
    this.getTransactionDetails();
  };
  componentWillUnmount = () => {
    this.unmount = true;
    const Receipt = this.state.Receipt
    if (!Receipt || !Receipt.height) {
      TxManager.updateUnpackTx();
    }
  }
  toRa = (n) => {
    console.log(ShowText.toRa(n));
    return ShowText.toRa(n)
  }
  getTransactionDetails = () => {

    console.warn(this.key, this.hash);
    chainRequest({
      method: "Gx_txReceipt",
      params: [this.hash]
    }).then(e => {
      if (e.result.status == 0) {
        let data = e.result.data
        let {Receipt, Transaction} = data
        this.setState({td: data, Receipt, Transaction, showLoading: false});
        TxManager.txPacked(this.hash)
      } else {
        if (this.unmount) {
          return;
        }
        setTimeout(this.getTransactionDetails, 2000);
      }
    }).catch(err => {
      this.setState({showLoading: false})
    })
  }

  copyString = string => {
    if (string && typeof string == 'string' && string.length > 10) {
      Clipboard.setString(string);
      Toast(i18n.reload_copySuccess)
    }
  }

  renderItem = (left, right, canCopy = false) => {
    return <View style={styles.itemRow}>
      <Text style={styles.left}>{left}</Text>
      {canCopy && <Text style={styles.right} onPress={() => this.copyString(right)}>{right}</Text>}
      {!canCopy && <Text style={styles.right}>{right}</Text>}
    </View>
  }

  render() {
    const {Receipt, Transaction} = this.state
    console.warn(Receipt.contractAddress)
    let statusData = statusObj[Transaction.type] || "" // todo 未知Type
    let gas_price = this.toRa(Transaction.gas_price) || 0;
    let cumulativeGasUsed = Receipt.cumulativeGasUsed || 0;
    let gasfee = this.toRa(Transaction.gas_price * cumulativeGasUsed) || 0;
    return (
      <View style={styles.container}>
        <NavBar title='交易详情'></NavBar>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <TopPadding></TopPadding>

          <View style={styles.amountV}>
            <Text style={styles.text}>转账金额</Text>
            <Text style={styles.amount}>{`${Transaction.value || ''} DDAM`}</Text>
          </View>
          {this.renderItem('交易类型', '转账')}
          {this.renderItem('收款地址', Transaction.target, true)}
          {this.renderItem('付款地址', Transaction.source, true)}
          {this.renderItem('矿工费用', cumulativeGasUsed + " * " + gas_price)}
          {this.renderItem('交易号', Transaction.hash, true)}
          {this.renderItem('区块', Receipt.height)}
          <View style={styles.itemRow}></View>
          <Text style={styles.mark}>{i18n.wallet_tx_mark}</Text>
          <View style={styles.line}/>

          <Text style={styles.noteBox} numberOfLines={3}>
            {Transaction.extra_data || '无'}
          </Text>
          <View style={styles.line}/>
          <Text
            style={styles.toWeb}
            onPress={() => {
            Linking.openURL(`${Config.WEB_HOST}?${ (new Date).getTime()}#/tx/${this.hash}`)
          }}>{i18n.wallet_tx_toWeb}</Text>

          {this.state.showLoading && <Loading showLoading={true}></Loading>}
        </ScrollView>
      </View>
    )
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  amountV: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 23,
    paddingBottom: 19
  },
  amount: {
    fontSize: 18,
    color: Config.appColor,
    fontWeight: '600'
  },
  text: {
    fontSize: 15,
    color: '#333'
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 25,
    backgroundColor: '#F9F8F8'
  },
  left: {
    fontSize: 15,
    color: '#666'
  },
  right: {
    fontSize: 15,
    color: '#999',
    width: Config.width - 100,
    textAlign: 'right'
  },
  mark: {
    paddingTop: 28,
    paddingBottom: 18,
    paddingLeft: 15,
    fontSize: 15,
    color: '#333'
  },
  toWeb: {
    fontSize: 13,
    color: Config.appColor,
    padding: 15
  },
  line: {
    width: Config.width,
    height: 1,
    backgroundColor: '#D5D5D5'
  },
  noteBox: {
    height: 100,
    fontSize: 13,
    color: '#999',
    padding: 15
  }
})