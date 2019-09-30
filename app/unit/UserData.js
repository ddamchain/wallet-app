import {AsyncStorage} from 'react-native';
import * as Config from './Config';
import NavigationService from './NavigationService';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'crypto-js';
const AES = CryptoJS.AES;

export function logOut() {
  Config.userData = {
    ...Config.defaultUserData
  }
  AsyncStorage.removeItem('user')
  NavigationService.resetRoot('Login')
}

export function saveCard(cardNumber) {

  if (Config.userData.cardNumber != cardNumber) {
    Config.userData.cardNumber = cardNumber
    AsyncStorage.setItem('user', JSON.stringify(Config.userData))
  }
}

export function saveRealNameSta(realNameSta) {
  if (Config.userData.realNameSta != realNameSta) {
    Config.userData.realNameSta = realNameSta
    AsyncStorage.setItem('user', JSON.stringify(Config.userData))
  }
}

export function saveIpConfig(ipConfig) {
  if (Config.ipConfig.selectedNet != ipConfig.selectedNet) {
    ipConfig.useChainNet = '';
  }
  updateIp(ipConfig)
  AsyncStorage.setItem('ipConfig', JSON.stringify(Config.ipConfig))
}

export function updateIp(ipConfig) {
  Config.ipConfig = {
    ...Config.ipConfig,
    ...ipConfig
  }
  Config.PLEDGE_HOST = Config.ipConfig[Config.ipConfig.selectedNet].stake;
}