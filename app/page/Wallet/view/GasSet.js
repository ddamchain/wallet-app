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
import {Config, i18n, ConstValue} from '../../../unit/AllUnit'
import {InputView} from '../../../widget/AllWidget'
import TransferProgress from './TransferProgress';
const {MIN_GAS_LIMIT, MIN_GAS_PRICE, TX_TYPE_TRANSEFER} = ConstValue;
import {BigNumber} from 'bignumber.js/bignumber';

export default class Page extends Component {

  state = {
    showSet: false,
    gas: '5000',
    gasprice: MIN_GAS_PRICE + ''
  }
  allSeek = 2000;
  minSeek = 500;

  componentDidMount() {
    console.warn(this.state);

    this
      .props
      .onGasChange(this.state)
  }

  onGasLimitChange = gas => {
    gas = BigNumber(gas).toFixed()
    if (isNaN(gas)) 
      gas = ''
    this.setState({gas})
    this
      .props
      .onGasChange({
        ...this.state,
        gas
      });

  }

  onProgressChange = progress => {
    this.setState({
      gasprice: (progress | 0) + 500
    });
    this
      .props
      .onGasChange({
        ...this.state,
        gasprice: (progress | 0) + 500
      });
  }

  onSetPress = () => {
    this.setState({
      showSet: !this.state.showSet
    })
    this
      .props
      .onGasChange({
        ...this.state,
        showSet: !this.state.showSet
      });
  }

  render() {
    const {showSet, gas, gasprice} = this.state;

    return <View style={styles.gasSet}>
      <View style={styles.row}>
        <Text style={styles.text}>{i18n.wallet_transfer_minerGas}</Text>
        <Text style={styles.ddam}>{(gasprice * gas / 1e9).toFixed(4)}
          &nbsp;DDAM</Text>
      </View>

      {!showSet && <View style={styles.line}></View>}

      {showSet && <View style={styles.setV}>
        <TransferProgress
          onProgressChange={this.onProgressChange}
          seek={gasprice - this.minSeek}
          allSeek={this.allSeek - this.minSeek}/>
        <Text style={styles.gasPrice}>{gasprice}RA</Text>

        <InputView
          width={Config.width - 70}
          paddingHorizontal={0}
          borderBottomWidth={0.5}
          height={40}
          color='#999'
          leftColor='#666'
          inputProps={{
          value: gas,
          placeholder: gas,
          keyboardType: 'numeric',
          onChangeText: this.onGasLimitChange
        }}>Gas Limit</InputView>

      </View>}

      <View style={{
        flex: 1
      }}></View>

      <TouchableOpacity style={styles.set} onPress={this.onSetPress}>
        <Text style={styles.setText}>{i18n.wallet_transfer_set}</Text>
        <View style={styles.circle}>
          <View
            style={[
            styles.dot, {
              backgroundColor: showSet
                ? Config.appColor
                : '#999999'
            }
          ]}></View>
        </View>
      </TouchableOpacity>

    </View>
  }
}

const styles = StyleSheet.create({

  gasSet: {
    alignItems: 'center',
    width: Config.width,
    height: 216
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: Config.width,
    paddingHorizontal: 15,
    paddingTop: 23,
    paddingBottom: 18,
    width: Config.width
  },
  text: {
    fontSize: 15,
    color: '#333'
  },
  ddam: {
    fontSize: 13,
    color: Config.appColor
  },
  line: {
    width: Config.width,
    height: 1,
    backgroundColor: '#D5D5D5'
  },
  button: {
    marginBottom: 50,
    width: Config.width - 50
  },
  gasPrice: {
    fontSize: 12,
    color: '#999',
    paddingTop: 5,
    marginBottom: 15,
    paddingRight: 35,
    alignSelf: 'flex-end'
  },
  set: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 10
  },
  setText: {
    color: '#999',
    fontSize: 12,
    paddingRight: 8
  },
  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderColor: '#DFDFDF',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Config.appColor
  },
  setV: {
    padding: 15,
    alignItems: 'center'
  }
});