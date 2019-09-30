import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  Image,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import {
  NavBar,
  TopPadding,
  Button,
  ScrollTab,
  KeyboardAwareScrollView,
  InputView
} from '../../widget/AllWidget'
import {Config, post, i18n, NavigationService, Toast} from '../../unit/AllUnit';
import WalletAction from '../../redux/actions/WalletAction';

export default class Page extends Component {

  constructor(props) {
    super(props);
    const {address} = WalletAction.selectedAccount();
    this.state = {
      deviceFingerprint: '',
      blockAddress: address,
      senderBlockAddress: ''
    };

    this.scrollHeight = Config.height - Config.navBarHeight - 50;
  }

  onDeviceFingerprintChange = deviceFingerprint => this.setState({deviceFingerprint})
  onSenderBlockAddressChange = senderBlockAddress => this.setState({senderBlockAddress})

  onBindPress = () => {
    const {deviceFingerprint, blockAddress} = this.state;
    if (!deviceFingerprint) {
      Toast('请输入设备指纹')
      return;
    }
    if (!blockAddress) {
      Toast('请输入绑定地址')
      return;
    }

    post(Config.API_HOST + '/ops/wallet/sendRequest', {
      requestType: 1,
      deviceFingerprint,
      blockAddress
    }, 'POST').then(data => {
      console.warn(data);

      if (!data) {
        this.successWithTitle('绑定申请提交成功')
        return;
      }
      if (data.code < 0) {
        Toast(data.description);
        return
      }

    })

  }

  onChangeBindPress = () => {
    const {deviceFingerprint, senderBlockAddress} = this.state;
    const {address} = WalletAction.selectedAccount();

    if (!deviceFingerprint) {
      Toast('请输入设备指纹')
      return;
    }
    if (!senderBlockAddress) {
      Toast('请输入转绑地址')
      return;
    }

    post(Config.API_HOST + '/ops/wallet/sendRequest', {
      requestType: 2,
      deviceFingerprint,
      blockAddress: address,
      senderBlockAddress
    }, 'POST').then(data => {
      console.warn(data);
      if (!data) {
        this.successWithTitle('转绑申请提交成功')
        return;
      }

      if (data.code < 0) {
        Toast(data.description);
        return
      }
    })
  }

  successWithTitle = title => {
    this.setState({deviceFingerprint: ''})
    NavigationService.navigate('Success', {title})
  }

  render() {
    const {deviceFingerprint, blockAddress, senderBlockAddress} = this.state

    return (
      <View style={styles.container}>
        <NavBar title='UMID 管理'/>
        <ScrollTab titles={['绑定', '转绑']}>
          <KeyboardAwareScrollView height={this.scrollHeight}>
            <InputView
              borderBottomWidth={0.5}
              inputProps={{
              placeholder: '请输入设备指纹',
              value: deviceFingerprint,
              onChangeText: this.onDeviceFingerprintChange
            }}>设备指纹</InputView>
            <InputView
              borderBottomWidth={0.5}
              readOnly={true}
              inputProps={{
              value: blockAddress
            }}>绑定地址</InputView>
            <View style={styles.container}></View>
            <Button style={styles.button} onPress={this.onBindPress}>绑定</Button>
          </KeyboardAwareScrollView>
          <KeyboardAwareScrollView height={this.scrollHeight}>
            <InputView
              borderBottomWidth={0.5}
              inputProps={{
              placeholder: '请输入设备指纹',
              value: deviceFingerprint,
              onChangeText: this.onDeviceFingerprintChange
            }}>设备指纹</InputView>
            <InputView
              borderBottomWidth={0.5}
              inputProps={{
              placeholder: '请输入转绑地址',
              value: senderBlockAddress,
              onChangeText: this.onSenderBlockAddressChange
            }}>转绑地址</InputView>
            <View style={styles.container}></View>
            <Button style={styles.button} onPress={this.onChangeBindPress}>转绑</Button>
          </KeyboardAwareScrollView>
        </ScrollTab>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    marginBottom: 100
  }
});