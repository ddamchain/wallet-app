import * as types from '../types/WalletType'
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'crypto-js';
import {NativeModules, AsyncStorage} from 'react-native';
import {
  ShowText,
  ConstValue,
  chainRequest,
  Toast,
  i18n,
  TxManager
} from '../../unit/AllUnit';
import {Base64} from 'js-base64';
import {BigNumber} from 'bignumber.js/bignumber';
const {TX_TYPE_STAKEADD, TX_TYPE_STAKEREFUND, TX_TYPE_STAKEREDUCE} = ConstValue

const WalletModule = NativeModules.Wallet;
const AES = CryptoJS.AES;


const INITIAL_WALLET = {
  aesSK: '',
  mnemonic: '',
  usedIndex: 0,
  selectedIndex: 0,
  accounts: []
}

function createWalletACtion(mnemonic, password, account) {
  return {type: types.WALLET_CREATE, mnemonic, password, account}
}

function walletUpdateAction(data = {}) {
  data.type = types.WALLET_UPDATE
  return data
}

function deleteACcountAction(index) {
  return {type: types.WALLET_DELETE_ACCOUNT, index}
}

function createAccountAction(account) {
  return {type: types.WALLET_CREATE_ACCOUNT, account}
}

function updatePasswordAction(password) {
  return {type: types.UPDATE_PASSWOED, password}
}

function updateWalletWithoutSave(data = {}) {
  data.type = types.WALLET_UPDATE_WITHOUT_SAVE;
  return data;
}

export default {
  createWallet,
  importWallet,
  updateWallet,
  updateWalletWithoutSave,
  createAccount,
  importAccount,
  deleteAccount,

  initWallet,
  saveWallet,
  SignAndPost,
  selectedAccount,

  updateSelectedBalance,
  updateAllBalance,
  updateNonce,
  noncePlus
}

function selectedAccount() {
  const {selectedIndex, accounts} = _currentWallet;
  if (!accounts || accounts.length == 0 || accounts.length < selectedIndex + 1) {
    return {}
  }

  return accounts[selectedIndex]
}

// 更新选中账户的余额
function updateSelectedBalance() {
  return dispatch => {
    _updateBalance(dispatch, selectedAccount());
  }
}

// 更新所有账户的余额
function updateAllBalance() {
  return dispatch => {
    const {accounts} = _currentWallet;
    accounts.forEach(account => {
      _updateBalance(dispatch, account);
    });
  }
}

// 从链上获取nonce
function updateNonce() {
  return dispatch => {
    _updateNonce(dispatch, selectedAccount());
  }
}

// 交易完成后 账户 nonce +1
function noncePlus() {
  return dispatch => {
    let accounts = [..._currentWallet.accounts]
    accounts[_currentWallet.selectedIndex].nonce += 1;
    dispatch(updateWalletWithoutSave({accounts}))
  }
}

function _updateNonce(dispatch, account) {

  chainRequest({
    "method": 'Gx_nonce',
    "params": [account.address]
  }).then(data => {

    if (data.result && data.result.status == 0) {
      let accounts = [..._currentWallet.accounts]
      accounts.forEach(item => {
        if (item.address == account.address) {
          item.nonce = data.result.data;
        }
      });
      dispatch(updateWalletWithoutSave({accounts}))
    }
  })
}

function _updateBalance(dispatch, account) {

  chainRequest({
    "method": "Gx_balance",
    "params": [account.address]
  }).then(data => {
    console.warn(data);

    if (data.result && data.result.status == 0) {
      let accounts = [..._currentWallet.accounts]
      accounts.forEach(item => {
        if (item.address == account.address) {
          item.value = data.result.data;
        }
      });
      dispatch(updateWalletWithoutSave({accounts}))
    }

  })
}

function SignAndPost({
  sk = '',
  data = '',
  target = '',
  value = 0,
  gas = 500,
  gasprice = 1000,
  tx_type,
  nonce,
  extra_data = ''
}, callback) {

  if (!sk) {
    sk = selectedAccount().sk;
  }
  if (!nonce) {
    nonce = selectedAccount().nonce;
  }

  const signValue = (BigNumber(value) * BigNumber(1e9))
    .toFixed(0)
    .toString()

  data = ShowText.__string2byte(data);

  WalletModule.signTx(sk, JSON.stringify(data), signValue, nonce, target, tx_type, parseInt(gas), parseInt(gasprice), extra_data, (err, sign) => {

    const params = {
      sign,
      target,
      value: parseInt(value * 1e9),
      gas: parseInt(gas),
      gasprice: parseInt(gasprice),
      tx_type: tx_type,
      nonce: nonce,
      data: data,
      extra_data: extra_data
    }

    chainRequest({
      "method": 'Gx_tx',
      "params": [JSON.stringify(params)]
    }).then(data => {
      console.warn(data);
      callback(data);

      if (data.result) {
        TxManager.add({
          type: tx_type,
          source: selectedAccount().address,
          target: target,
          value: value,
          curTime: ShowText.time2Text((new Date).getTime(), 'yyyy-MM-dd hh:mm:ss'),
          hash: data.result.data,
          localStatus: 1
        })
      }

    }).catch(err => {})
  })

}