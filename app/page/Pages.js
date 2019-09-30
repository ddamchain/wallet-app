import React from 'react';
import {Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation';
import {Config, i18n, NavigationService} from '../unit/AllUnit';

import ScannerQRCode from './Wallet/AddWallet/ScannerQRCode';
import Wallet from './Wallet/Wallet';
import CreateOrImport from './Wallet/AddWallet/CreateOrImport';
import CreateWallet from './Wallet/AddWallet/CreateWallet';
import CreateWalletBackup from './Wallet/AddWallet/CreateWalletBackup';
import CreateWalletConfirm from './Wallet/AddWallet/CreateWalletConfirm';
import ImportWallet from './Wallet/AddWallet/ImportWallet';
import WalletManage from './Wallet/WalletManage';
import WalletReceive from './Wallet/WalletReceive';
import WalletTransfer from './Wallet/WalletTransfer';
import WalletSwitch from './Wallet/AddWallet/WalletSwitch';
import TransactionDetails from './Wallet/AddWallet/TransactionDetails'
import Success from './Wallet/Success'
import UMIDManager from './Wallet/UMIDManager';

const tabsImage = {
  Home: require('../img/tabbar/icon_home_unchoose.png'),
  Home_sel: require('../img/tabbar/icon_home_choose.png'),
  My: require('../img/tabbar/icon_my_unchoose.png'),
  My_sel: require('../img/tabbar/icon_my_choose.png'),
  WalletDiscover: require('../img/tabbar/icon_zhuanzhang_unchoose.png'),
  WalletDiscover_sel: require('../img/tabbar/icon_zhuanzhang_choose.png')
}

const WalletTab = createBottomTabNavigator({
  Home: {
    screen: Wallet,
    navigationOptions: {
      tabBarLabel: i18n.tab1
    }
  },
  WalletDiscover: {
    screen: WalletTransfer,
    navigationOptions: {
      tabBarLabel: '转账',
      tabBarOnPress: () => {
        NavigationService.navigate('WalletTransfer')
      }
    }
  },
  My: {
    screen: WalletManage,
    navigationOptions: {
      tabBarLabel: '我的'
    }
  }
}, {
  defaultNavigationOptions: ({navigation}) => ({

    tabBarIcon: ({focused}) => {
      let {routeName} = navigation.state;
      routeName = focused
        ? routeName + '_sel'
        : routeName
      const img = tabsImage[routeName]
      return <Image source={img} style={{
        marginTop: 3
      }}/>
    }
  }),
  tabBarOptions: {
    activeTintColor: Config.appColor,
    inactiveTintColor: '#999',
    allowFontScaling: false
  }
});

export default pages = {
  WalletTab,
  Wallet,
  CreateOrImport,
  CreateWallet,
  ImportWallet,
  WalletManage,
  CreateWalletBackup,
  CreateWalletConfirm,
  WalletReceive,
  WalletTransfer,
  WalletSwitch,
  TransactionDetails,
  ScannerQRCode,
  Success,
  UMIDManager
}
