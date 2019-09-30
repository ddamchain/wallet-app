import {Dimensions, Platform, StatusBar, NativeModules} from 'react-native'
import DeviceInfo from 'react-native-device-info';
import {KYC_STATUS_NONE} from './ConstValue';

export const defaultUserData = {
  name: '未登录',
  mobile: '',
  cardNumber: '',
  sessionId: '',
  lastLogin: 0,
  realNameSta: KYC_STATUS_NONE
}
export const userData = {
  ...defaultUserData
}

// 颜色
export const appColor = '#2F62F5'
export const bgColor = '#F5F5F5'
export const lineColor = '#e5e5e5'
export const navColor = '#00b3fd'
export const disableColor = '#ccc'
export const borderColor = '#D5D5D5'

// 设备信息
const window = Dimensions.get('window')
export const width = window.width
export const height = window.height
export const isIos = Platform.OS == 'ios'
export const isAndroid = Platform.OS == 'android'
export const statusBarHeight = isIos
  ? parseFloat(NativeModules.iOSInfo.statusbarHeight)
  : StatusBar.currentHeight
export const navBarHeight = statusBarHeight + 44
export const videoHeight = width * 210 / 375
export const isEn = DeviceInfo
  .getDeviceLocale()
  .indexOf('en') > -1
export const isZh = DeviceInfo
  .getDeviceLocale()
  .indexOf('zh') > -1

// 通知
export const eventUpdateHomeData = 'eventUpdateHomeData'

export const isAppstore = true;
export const isDev = false;

export const WEB_HOST = "http://web.ddam.one/"; //  浏览器
export const API_HOST = "https://h2.codinge.cn/"; //  api
export const CHAIN_NODES = ["http://47.99.188.72:8101/"]

// export const API_HOST = "http://ddamapi.ssyuntu.com"; //  api