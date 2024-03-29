import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity
} from 'react-native';
import {NavBar, ScrollTab, Button, InputView, TopPadding} from '../../../widget/AllWidget'
import {Config, post, Toast, NavigationService, i18n} from '../../../unit/AllUnit';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import WalletAction from '../../../redux/actions/WalletAction';

const login_sel = require('../../../img/ddam/icon_login_choosetiaokuan.png')
const login_no = require('../../../img/ddam/login_no.png')

class Page extends Component {

  constructor(props) {
    super(props);
    this.isFirst = false;
    this.titles = [i18n.wallet_add_sk, i18n.wallet_add_mnemonic]
    if (this.props.navigation.state.params) {
      this.isFirst = this.props.navigation.state.params.isFirst;
      this.titles = [i18n.wallet_add_mnemonic];

    }
    this.state = {
      isSelected: false
    };
    this.tabIndex = 0;
  }

  onMnemonicChange = mnemonic => this.mnemonic = mnemonic;
  onChildChange = child => this.child = child
  onPasswordChange = password => this.password = password;
  onPassword2Change = password2 => this.password2 = password2;
  onSelectChange = () => this.setState({
    isSelected: !this.state.isSelected
  })

  onPress = () => {

    let {mnemonic, child, password, password2, props} = this;

    if (this.isFirst == false && this.tabIndex == 0) {
      // 导入私钥
      if (!child) {
        Toast(i18n.wallet_add_pkErr)
        return
      }

      props.importAccount({child, name: 'Acount'})
      NavigationService.pop();
      return;
    }

    if (this.isFirst || this.tabIndex == 1) {
      //有钱包的情况 导入助记词
      if (!this.isFirst && !this.state.isSelected) {
        Toast(i18n.wallet_add_backupErr);
        return;
      }

      if (!mnemonic) {
        Toast(i18n.wallet_add_mnemonicEmp)
        return
      }
      if (!password) {
        Toast(i18n.wallet_add_pwdErr);
        return
      }
      if (password.length > 16) {
        Toast(i18n.wallet_add_pwdToLong);
        return
      }
      if (password != password2) {
        Toast(i18n.pwd_newError);
        return
      }
      props.importWallet({
        name: 'Acount',
        password,
        mnemonic,
        callback: status => {
          if (status != -1) {
            setTimeout(() => {
              if (this.isFirst) {
                // 无钱包时导入钱包
                NavigationService.resetRoot('WalletTab');
                NavigationService.deleteRoute('ImportWallet')
                NavigationService.deleteRoute('CreateOrImport')
              } else {
                // 有钱包时 覆盖钱包
                NavigationService.resetRoot('WalletTab');
                NavigationService.deleteRoute('ImportWallet')
                NavigationService.deleteRoute('WalletSwitch')
              }
            }, 500);
          }
        }
      });

    }

  }

  renderSK = () => {
    if (this.titles.length < 2) {
      return null;
    }
    return <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.inputV}>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder={i18n.wallet_add_pkErr}
            autoCapitalize="none"
            underlineColorAndroid='transparent'
            onChangeText={this.onChildChange}
            style={styles.input}></TextInput>
        </View>
        <View style={styles.line}></View>

      </ScrollView>
      <Button style={styles.button} onPress={this.onPress}>{i18n.wallet_import_do}</Button>
    </View>

  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title={i18n.wallet_add_import}/>
        <ScrollTab titles={this.titles} onTabChanged={index => this.tabIndex = index}>

          {this.renderSK()}

          <View style={styles.container}>

            {this
              .titles
              .indexOf(i18n.wallet_add_mnemonic) > -1 && <ScrollView contentContainerStyle={styles.scroll}>

                <View style={styles.inputV}>
                  <TextInput
                    multiline
                    numberOfLines={3}
                    placeholder={i18n.wallet_add_mnemonicEmp}
                    onChangeText={this.onMnemonicChange}
                    autoCapitalize="none"
                    underlineColorAndroid='transparent'
                    style={styles.input}></TextInput>
                </View>
                <View style={styles.line}></View>

                {this.isFirst == false && <Text style={styles.warn}>{i18n.wallet_import_mnemonicInfo}</Text>}

                {this.isFirst == false && <TouchableOpacity onPress={this.onSelectChange} style={styles.selectedV}>
                  <Image
                    source={this.state.isSelected
                    ? login_sel
                    : login_no}/>
                  <Text style={styles.selectedinfo}>{i18n.wallet_import_backuped}</Text>
                </TouchableOpacity>
}
                {this.isFirst && <Text style={styles.info}>{i18n.wallet_import_mnemonicPwd}</Text>}

                <InputView
                  borderBottomWidth={0.5}
                  inputProps={{
                  secureTextEntry: true,
                  onChangeText: this.onPasswordChange,
                  placeholder: "请输入密码"
                }}>{i18n.wallet_add_pwd}</InputView>
                <InputView
                  borderBottomWidth={0.5}
                  inputProps={{
                  onChangeText: this.onPassword2Change,
                  secureTextEntry: true,
                  placeholder: "请再次输入密码"
                }}>{i18n.wallet_add_pwd}</InputView>

              </ScrollView>
}
            <Button style={styles.button} onPress={this.onPress}>{i18n.wallet_import_do}</Button>
          </View>

        </ScrollTab>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroll: {
    width: Config.width,
    height: Config.height,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  inputV: {
    width: Config.width - 30,
    height: 90,
    padding: 15,
    paddingHorizontal: 10,
    margin: 15,
    borderRadius: 4
  },
  input: {
    width: Config.width - 50,
    height: 60,
    textAlign: 'auto',
    fontSize: 13,
    color: '#333'
  },
  info: {
    fontSize: 13,
    color: '#999',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    marginVertical: 10
  },
  button: {
    marginBottom: 70
  },
  line: {
    width: Config.width,
    height: 1,
    backgroundColor: '#D5D5D5'
  },
  warn: {
    color: Config.appColor,
    fontSize: 13,
    alignSelf: "flex-start",
    margin: 10,
    marginHorizontal: 15
  },
  selectedV: {
    flexDirection: 'row',
    alignSelf: "flex-start",
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row'
  },
  selectedinfo: {
    fontSize: 13,
    color: '#999',
    paddingLeft: 10
  }
});

export default connect(state => ({wallet: state.wallet}), dispatch => ({
  importWallet: bindActionCreators(WalletAction.importWallet, dispatch),
  importAccount: bindActionCreators(WalletAction.importAccount, dispatch)
}))(Page);
