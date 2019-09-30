import {get, post, chainRequest, fullUrlRequest} from './fetchUnit';

let __tx = null;
const max_save_time = 1000 * 60 * 10;
const max_pack_time = 1000 * 15;
let __timeOut = null;
let __statusUpdateCallback = null;
/*

      "type": 0,
      "hash": "0x3174334e53a7f634d2f20958e1bff94bd04ce9573915babde03f2831ccd23859",
      "blockHash": "0x0ffb8d406bd5ba468c21c524f14507496c2b08a66b3f3def3446a6dac7232178",
      "source": "0x01cf40d3a25d0a00bb6876de356e702ae5a2a379c95e77c5fd04f4cc6bb680c0",
      "target": "0xd4d108ca92871ab1115439db841553a4ec3c8eddd955ea6df299467fbfd0415e",
      "value": 501,
      "curTime": 1567493904000,
      localStatus:1,    // 1 打包中   2 确认中
*/

function add(tx) {
  __tx = tx;
  updateUnpackTx()
}

function del() {
  __tx = null;
  clearTimeout(__timeOut)
}

function txPacked(hash) {
  console.warn(hash, __tx.hash, hash == __tx.hash);

  if (!__tx) 
    return del();
  
  if (hash == __tx.hash) {
    __tx.localStatus = 2;
    __statusUpdateCallback && __statusUpdateCallback()
  }
}

function updateUnpackTx(times = 10) {
  if (!__tx || __tx.localStatus != 1) {
    return;
  }

  if ((new Date).getTime() - __tx.curTime > max_pack_time) {
    return del();
  }

  const hash = __tx.hash
  chainRequest({method: "Gx_txReceipt", params: [hash]}).then(e => {
    if (e.result) {
      txPacked(hash)
    } else {
      setTimeout(() => this.updateUnpackTx(times - 1), 1000 * 60);
    }
  }).catch(err => {
    this.setState({showLoading: false})
  })

}

function getPaddingTx(list, body, address, statusUpdateCallback) {

  if (!__tx) {
    return;
  }

  if (!body.source || !body.target) {
    if (body.source && __tx.source != body.source) {
      return;
    }
    if (body.target && __tx.target != body.target) {
      return;
    }
  }

  __statusUpdateCallback = statusUpdateCallback

  if ((new Date).getTime() - __tx.curTime > max_save_time) {
    __tx = null;
    return;
  }

  list.forEach(tx => {
    if (tx.hash == __tx.hash) {
      __tx = null;
    }
  });
  return __tx
}

export default {
  add,
  getPaddingTx,
  txPacked,
  updateUnpackTx
};