import Toast from './Toast';
import * as Config from './Config';
import {AsyncStorage} from 'react-native';
import ErrorCode from './ErrorCode';
import * as UserData from './UserData';
import i18n from './i18n/index';

__chainURL = '';
__startInit = false;

const _initChainUrl = (ipList) => {
  if (ipList.length == 1) {
    __chainURL = ipList[0];
    return;
  }
  if (__startInit) {
    return;
  }
  __startInit = true;

  ipList.map(url => {
    chainRequest({
      "method": "Gx_blockHeight",
      "params": []
    }, url).then(data => {
      if (!__chainURL) {
        __chainURL = url;
      }
    })
  });
}

const post = (url, data) => {
  url = url;
  body = new FormData();
  body.append('key', 'value')
  for (var o in data) {
    body.append(o, data[o])
  }
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      "Connection": "close",
      'sessionId': Config.userData.sessionId
    },
    body
  };
  return fetchUnit(url, fetchOptions)
}

const get = (url, data) => {
  url = url + '?';
  for (var o in data) {
    url += o + "=" + data[o] + "&";
  }
  const fetchOptions = {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      "Connection": "close",
      'sessionId': Config.userData.sessionId
    }
  };
  return fetchUnit(url, fetchOptions)
}

const chainRequest = (data = {}, url) => {
  if (!url) {
    url = __chainURL;
  }

  if (!url) {
    url = Config.CHAIN_NODES[0];
    _initChainUrl(Config.CHAIN_NODES);
  }

  data.jsonrpc = "2.0";
  data.id = "1";
  return fullUrlRequest(url, data, 'POST', true)
}

const fullUrlRequest = (url, data, method = 'POST', isChain) => {

  const fetchOptions = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (method == 'POST') {
    fetchOptions.body = JSON.stringify(data)
  }
  if (method == 'GET' && Object.getOwnPropertyNames(data).length > 0) {
    url = url + '?';
    for (var o in data) {
      url += o + "=" + data[o] + "&";
    }
  }

  return fetchUnit(url, fetchOptions)
}

const fetchUnit = (url, fetchOptions = {}) => {

  return new Promise(function (resolve, reject) {

    let gotData = false;
    const timer = setTimeout(() => {
      if (gotData == false) {
        Toast(i18n.network_err)
        console.warn(url);

        reject(-1);
      }
    }, 10000);

    fetch(url, fetchOptions)
      .then(response => response.json())
      .then(json => {

        gotData = true;
        clearTimeout(timer)

        console.warn(`请求网址：${url}\n请求数据:${JSON.stringify(fetchOptions)}\n返回结果:${JSON.stringify(json)}`)

        if (json.id == 1) {
          resolve(json)
        } else if (json.code == 0 && json.success == true) {
          resolve(json.data)
        } else if (json.code == 200) {
          resolve(json.data)
        } else if (json.code > 0) {
          return json
        } else {
          resolve(json)
        }

      })
      .then(json => {

        if (json.code == 1000) { //登录过期
          UserData.logOut()
        } else if (json.code == 1035) { //在其他设备登录
          Config.userData.sessionId && Toast(ErrorCode(json.code))
          UserData.logOut()
        } else {
          Toast(ErrorCode(json.code, json.params))
        }
        reject(json)

      })
      .catch((err) => {

        if (err.line || err.code) {
          if (err.line && err.line == 25779) {
            Toast(i18n.toast_serverError)
          }
          return
        }

        reject(err);
      })
  })

};

export {post, get, chainRequest, fullUrlRequest}