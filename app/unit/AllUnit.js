import {AsyncStorage} from 'react-native';
import * as Config from './Config';
import ValueVerify from './ValueVerify';
import Toast from './Toast';
import AppUpdate from './AppUpdate';
import * as ShowText from './ShowText';
import * as UserData from './UserData';
import i18n from './i18n/index';
import * as ConstValue from './ConstValue';
import CoinConfig from './CoinConfig';
import NavigationService from './NavigationService';
import {get, post, chainRequest, fullUrlRequest} from './fetchUnit';
import TxManager from './TxManager';

const clearUser = () => {
  AsyncStorage.removeItem('user')
  Config.userData = {
    ...Config.defaultUserData
  }
}

// const post = fetchUnit.post const get = fetchUnit.get

export {
  post,
  get,
  chainRequest,
  fullUrlRequest,
  Config,
  Toast,
  ValueVerify,
  clearUser,
  AppUpdate,
  ShowText,
  UserData,
  i18n,
  ConstValue,
  CoinConfig,
  NavigationService,
  TxManager
}
