import * as types from '../types/WalletType'
import {Toast, i18n} from '../../unit/AllUnit';

const INITIAL_STATE = {
  aesSK: '',
  mnemonic: '',
  usedIndex: 0,
  selectedIndex: 0,
  password: '',
  accounts: []
}

export default function reducer(state = INITIAL_STATE, action) {

  switch (action.type) {
    case types.WALLET_CREATE:
      return {
        ...state,
        status: action.type
      }
    case types.WALLET_UPDATE:
      return {
        ...state,
        ...action
      }
    case types.WALLET_UPDATE_WITHOUT_SAVE:
      return {
        ...state,
        ...action
      }
    case types.WALLET_CREATE_ACCOUNT:
      {

        return {
          ...state,
          ...action
        }
      }
    case types.WALLET_DELETE_ACCOUNT:
      {

        return {
          ...state,
          ...action
        }
      }

    case types.UPDATE_PASSWOED:
      return {
        ...INITIAL_STATE
      }
    default:
      return state;
  }
}
