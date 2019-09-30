import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  ImageBackground,
  ScrollView,
  Clipboard
} from 'react-native';
import {NavBar, Button, TopPadding} from '../../../widget/AllWidget'
import {Config, i18n, Toast, NavigationService} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      wallet: {},
      showButton: false
    };
  }

  onPress = () => {
    NavigationService.navigate('CreateWalletConfirm', {wallet: this.state.wallet})
  }

  componentDidMount() {
    this.timerout = setTimeout(() => {
      clearTimeout(this.timerout)
      this.setState({wallet: this.props.wallet, showButton: true});
      this
        .props
        .updateWallet({
          data: {
            aesSK: '',
            mnemonic: '',
            usedIndex: 0,
            selectedIndex: 0,
            accounts: []
          }
        })
    }, 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timerout)
  }

  render() {
    let wallet = this.state.wallet;
    if (!wallet.mnemonic) {
      wallet = this.props.wallet;
    }

    const {name, mnemonic, accounts} = wallet;
    if (!mnemonic) {
      return null;
    }
    let mnemonic_list = [];
    let sk = '';
    if (mnemonic && mnemonic.length > 0) {
      mnemonic_list = mnemonic.split(' ')
    }
    if (accounts && accounts.length > 0) {
      sk = accounts[0].sk;
    }

    return (
      <View style={styles.container}>

        <NavBar title='钱包备份'/>
        <TopPadding></TopPadding>

        <Text style={styles.topText}>请备份你的私钥和助记词</Text>
        <Text style={styles.info}>请抄写记录下你的私钥和助记词，防止泄露造成损失，一旦丢失将不可找回</Text>
        <Image source={require('../../../img/ddam/img_beifen_chahua.png')}/>
        <Text style={styles.title}>助记词</Text>
        <View style={styles.words}>
          {mnemonic_list.map((item, k) => {
            return <Text key={k} style={styles.word}>{item}</Text>
          })}
        </View>

        <Text style={styles.title}>钱包名称</Text>
        <Text style={styles.walletName}>{name}</Text>
        {this.state.showButton && <Button onPress={this.onPress} style={styles.button}>{i18n.wallet_add_next}</Button>}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  topText: {
    fontSize: 15,
    color: '#333',
    marginTop: 20
  },
  info: {
    fontSize: 13,
    color: Config.appColor,
    marginTop: 15,
    marginHorizontal: 35
  },
  title: {
    alignSelf: 'flex-start',
    margin: 15,
    fontSize: 15,
    color: '#333'
  },

  words: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 30
  },
  word: {
    fontSize: 13,
    color: '#666',
    marginRight: 10
  },
  walletName: {
    alignSelf: 'flex-start',
    marginLeft: 35,
    color: "#666666",
    fontSize: 13,
    flex: 1
  },
  button: {
    marginBottom: 70
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch)
}))(Page)