import {combineReducers} from 'redux'
import wallet from './WalletReducer';

const rootReducer = combineReducers({
  wallet
})

export default rootReducer; //导出，作为统一入口