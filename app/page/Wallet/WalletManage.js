import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  Clipboard,
  ImageBackground,
  TouchableWithoutFeedback
} from 'react-native';
import {NavBar, CommonCell, TopPadding, Shadow} from '../../widget/AllWidget'
import {Config, post, i18n, Toast, NavigationService} from '../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../redux/actions/WalletAction';
import WalletPassword from './view/WalletPassword';

class Page extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showInput: false
    };
    this.secureTextEntry = true;
  }

  onNameChange = (name = '') => {
    this.name = name;
    if (name.length) {
      const {props} = this;
      const {mnemonic, selectedIndex, accounts} = this.props.wallet;
      Toast(i18n.wallet_manager_changeSuccess)
      accounts[selectedIndex].name = name
      props.updateWallet({data: {
          accounts
        }})
    }
    this.setState({showInput: false})
  }

  onPwd2Sk = (pwd = '') => {
    if (!pwd) {
      this.setState({showInput: false});
      return;
    }
    const {password, selectedIndex, accounts} = this.props.wallet;
    if (pwd != password) {
      Toast(i18n.wallet_manager_pwdErr)
    } else {
      Toast(i18n.reload_copySuccess);
      Clipboard.setString(accounts[selectedIndex].sk);
      this.setState({showInput: false});
    }
  }

  onPwd2Memonic = (pwd = '') => {
    if (!pwd) {
      this.setState({showInput: false});
      return;
    }
    const {password, mnemonic} = this.props.wallet;
    if (pwd != password) {
      Toast(i18n.wallet_manager_pwdErr);
    } else {
      Toast(i18n.reload_copySuccess);
      Clipboard.setString(mnemonic);
      this.setState({showInput: false});
    }
  }

  onShowInput = (title, placeholder, callback) => {
    this.inputTitle = title
    this.inputPlaceholder = placeholder
    this.onInputHide = callback;
    this.setState({showInput: true})
  }

  onPress = title => {
    const {selectedIndex, accounts} = this.props.wallet;
    this.secureTextEntry = true;
    if (title == 'UMID 管理') {
      NavigationService.navigate('UMIDManager')
    } else if (title == i18n.wallet_manager_changeName) {
      this.secureTextEntry = false;
      this.onShowInput(i18n.wallet_manager_changeName, accounts[selectedIndex].name, this.onNameChange);
    } else if (title == i18n.wallet_manager_exportSk) {
      this.onShowInput(i18n.wallet_manager_password, i18n.wallet_manager_password, this.onPwd2Sk);
    } else if (title == i18n.wallet_manager_exportMnemonic) {
      this.onShowInput(i18n.wallet_manager_password, i18n.wallet_manager_password, this.onPwd2Memonic);
    } else if (title == i18n.wallet_manager_deleteAccount) {

      if (accounts.length <= 1) {
        Toast(i18n.wallet_manager_deleteErr)
      } else {
        Alert.alert('', i18n.wallet_manager_deleteInfo, [
          {
            text: i18n.my_continue,
            onPress: this.onDeleteAccount
          }, {
            text: i18n.my_cancel
          }
        ])
      }
    }
  }

  onDeleteAccount = () => {
    const {props} = this;
    const {selectedIndex, accounts} = this.props.wallet;
    const newAccounts = [...accounts];
    newAccounts.splice(selectedIndex, 1)
    props.updateWallet({
      data: {
        selectedIndex: 0,
        accounts: newAccounts
      }
    })
    Toast(i18n.wallet_manager_deleted)
    NavigationService.pop();
  }

  render() {
    const {showInput} = this.state;
    const {name} = WalletAction.selectedAccount();

    if (!name) {
      return null;
    }

    const const_data = [
      {
        left: i18n.wallet_manager_exportSk,
        right: '',
        arrow: true
      }, {
        left: i18n.wallet_manager_exportMnemonic,
        right: '',
        arrow: true
      }, {
        left: 'UMID 管理'
      }
    ];
    return (
      <View style={styles.container}>

        <ImageBackground
          source={require('../../img/ddam/img_my_bg.png')}
          style={styles.bg}
          resizeMode='stretch'>
          <NavBar
            title={i18n.wallet_my_accountManager}
            backgroundColor='rgba(0,0,0,0)'
            color='#fff'/>
          <TouchableOpacity
            style={styles.nameV}
            onPress={() => {
            this.onPress(i18n.wallet_manager_changeName)
          }}>
            <Text style={styles.name}>{name}</Text>
            <Image source={require('../../img/ddam/icon_xiugai.png')}/>
          </TouchableOpacity>
        </ImageBackground>

        <TouchableWithoutFeedback
          onPress={() => NavigationService.navigate('WalletSwitch')}>
          <View>
            <ImageBackground
              style={styles.shadow}
              source={require('../../img/ddam/shadow.png')}>
              <Text style={styles.text}>{i18n.wallet_account}</Text>
              <Image source={require('../../img/ddam/icon_fanhui.png')}/>
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>

        {const_data.map((item, key) => {
          return <TouchableOpacity onPress={() => this.onPress(item.left)} key={key}>
            <CommonCell {...item}/>
          </TouchableOpacity>
        })}

        <TopPadding></TopPadding>

        <TouchableOpacity
          onPress={() => this.onPress(i18n.wallet_manager_deleteAccount)}>
          <CommonCell left={i18n.wallet_manager_deleteAccount}/>
        </TouchableOpacity>

        {showInput && <WalletPassword
          secureTextEntry={this.secureTextEntry}
          title={this.inputTitle}
          placeholder={this.inputPlaceholder}
          onHide={this.onInputHide}/>}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bg: {
    width: Config.width,
    height: 196
  },
  nameV: {
    marginTop: 112 - Config.navBarHeight,
    marginLeft: 40,
    alignItems: 'center',
    flexDirection: 'row'
  },
  name: {
    marginRight: 10,
    fontSize: 18,
    color: '#fff',
    fontWeight: '600'
  },
  shadow: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: Config.width - 20,
    paddingLeft: 25,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 76,
    marginTop: -38
  },
  text: {
    color: '#333',
    fontSize: 15
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  deleteAccount: bindActionCreators(WalletAction.deleteAccount, dispatch),
  updateWallet: bindActionCreators(WalletAction.updateWallet, dispatch)
}))(Page)