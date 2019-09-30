import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard
} from 'react-native';
import {Config, ShowText, i18n} from '../unit/AllUnit'
import EmptyComponent from './EmptyComponent';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import AssetAction from '../redux/actions/AssetAction';
import PropTypes from 'prop-types';

const coin_images = {
  MXM: require('../img/money/MXM.png'),
  BTC: require('../img/money/BTC.png'),
  ETH: require('../img/money/ETH.png')
}

class Page extends Component {

  state = {
    filtrate: '',
    coin: this.props.asset.coin,
    keyboardHeight: 0
  }

  componentWillUnmount() {
    this
      .keyboardDidShowListener
      .remove();
    this
      .keyboardDidHideListener
      .remove();
    this
      .keyboardWillShowListener
      .remove();
    this
      .keyboardWillHideListener
      .remove();
  }

  componentWillMount() {
    Keyboard.dismiss();
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  _keyboardDidShow = e => {
    this.setState({keyboardHeight: 250})
  }

  _keyboardDidHide = e => {
    this.setState({keyboardHeight: 0})
  }

  onChangeText = filtrate => {
    let coin = this.props.asset.coin
    const upperF = filtrate.toUpperCase();
    coin = coin.filter(element => {
      const coinName = element.coinName + ''
      return coinName.indexOf(upperF) > -1
    })
    this.setState({filtrate, coin})
  }

  renderItem = (info) => {
    const {coinName, onSelect, showBalance} = this.props
    const item = info.item
    return <TouchableOpacity onPress={() => onSelect(item)}>
      <View style={styles.cell}>
        <Image style={styles.img} source={item.logo}/>
        <View style={{
          flex: 1
        }}>
          <Text style={styles.coinName}>{item.coinName}</Text>
          {showBalance && <Text style={styles.balance}>余额：{ShowText.showCoin(item)} {item.coinName}</Text>}
        </View>
        {coinName == item.coinName && <Image source={require('../img/money/coin_sel.png')}/>}
      </View>
    </TouchableOpacity>

  }

  render() {

    return <View style={styles.container}>

      <TouchableOpacity style={{
        flex: 1
      }} onPress={this.props.onHide}>
        <View ></View>
      </TouchableOpacity>

      <View
        style={[
        styles.view, {
          height: Config.height / 3 + 100 + this.state.keyboardHeight,
          paddingBottom: this.state.keyboardHeight
        }
      ]}>
        <View style={styles.searchView}>
          <View style={styles.inputView}>
            <Image style={styles.searchImg} source={require('../img/home/search.png')}/>
            <TextInput
              autoCapitalize="none"
              style={styles.input}
              placeholder={i18n.search}
              value={this.state.filtrate}
              onChangeText={this.onChangeText}
              underlineColorAndroid='transparent'/>
          </View>

        </View>
        <FlatList
          data={this.state.coin}
          renderItem={this.renderItem}
          keyExtractor={(k, i) => k + i}
          ListFooterComponent={< EmptyComponent img = 'no_coin' text = {
          i18n.no_data
        }
        hide = {
          this.state.coin.length > 0
        } />}/>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1
  },
  view: {
    backgroundColor: '#fff',
    width: Config.width,
    height: Config.height / 3 + 100,
    borderTopRightRadius: 6,
    borderTopLeftRadius: 6
  },
  searchView: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#F5F7F9',
    borderRadius: 3
  },
  searchImg: {
    margin: 10
  },
  input: {
    height: 40,
    flex: 1
  },
  cell: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    width: Config.width,
    borderColor: Config.lineColor,
    borderTopWidth: 1
  },
  img: {
    width: 30,
    height: 30,
    resizeMode: 'center',
    marginRight: 10
  },
  coinName: {
    fontSize: 16,
    color: '#333'
  },
  balance: {
    fontSize: 14,
    color: '#999',
    paddingTop: 5
  }
})

// const {coinName, onSelect, showBalance} = this.props

Page.PropTypes = {
  coinName: PropTypes.string.isRequired,
  onSelect: PropTypes.string.isRequired,
  showBalance: PropTypes.bool
}

// export default connect(state => ({ asset: state.asset }), () => { })(Page)
export default connect(state => ({asset: state.asset}), dispatch => ({
  getAsset: bindActionCreators(AssetAction.getAsset, dispatch)
}))(Page)