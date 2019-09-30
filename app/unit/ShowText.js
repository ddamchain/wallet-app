import {BigNumber} from 'bignumber.js/bignumber';
import i18n from './i18n/index';
import * as Config from './Config';
import CoinConfig from './CoinConfig';

/// 设置数字小数点位数，和增加千分号
export function toFix(amount, precision = 6, isMoney) {
  let n = BigNumber(amount).toFixed(precision, 1)
  if (isNaN(n)) {
    return 0;
  }

  if (isMoney) {
    return formatNumber(n)
  }
  return n
}

//增加千分号
export function formatNumber(num) {
  if (isNaN(num)) {
    return 0;
  }

  let groups = (/([\-\+]?)(\d*)(\.\d+)?/g).exec("" + num),
    mask = groups[1], //符号位
    integers = (groups[2] || "").split(""), //整数部分
    decimal = groups[3] || "", //小数部分
    remain = integers.length % 3;

  let temp = integers.reduce(function (previousValue, currentValue, index) {
    if (index + 1 === remain || (index + 1 - remain) % 3 === 0) {
      return previousValue + currentValue + ",";
    } else {
      return previousValue + currentValue;
    }
  }, "").replace(/\,$/g, "");

  return mask + temp + decimal;
}

export const showCoin = coin => {
  let {balance, precision} = coin;
  return toFix(BigNumber(balance).div(1e8), precision, true)
}

export const showZV = (value, n = 4) => {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

//时间戳转换显示
export const time2Text = (time, fmt = 'hh:mm MM/dd') => {
  if (time <= 0) {
    return ''
  }
  time = new Date(time)
  let o = {
    "M+": time.getMonth() + 1, //月份
    "d+": time.getDate(), //日
    "h+": time.getHours(), //小时
    "m+": time.getMinutes(), //分
    "s+": time.getSeconds(), //秒
    "q+": Math.floor((time.getMonth() + 3) / 3), //季度
    "S": time.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) 
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o) 
    if (new RegExp("(" + k + ")").test(fmt)) 
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export const billShowDate = (time) => {
  const today = new Date(new Date().toLocaleDateString()).getTime()
  const day = 1000 * 60 * 60 * 24
  const diff = today - time;

  if (diff <= 0) {
    return i18n.bill_today
  } else if (diff < day) {
    return i18n.bill_yesterday
  } else {
    return time2Text(time, 'M-d')
  }
}

export function lastLoginText(time) {
  const now = new Date().getTime()
  const min = 1000 * 60
  const diff = now - time

  if (diff >= now / 2 || diff < min || time < min || !time) {
    return i18n.my_justNow
  } else if (diff < min * 60) {
    let showMin = parseInt(diff / min)
    if (showMin > 1 && Config.isEn) {
      return showMin + 'mins ago'
    }
    return showMin + i18n.my_min
  } else if (diff < min * 60 * 12) {
    let showHour = parseInt(diff / (min * 60));
    let showMin = parseInt(diff % (min * 60) / min);
    let my_hour = i18n.my_hour;
    let my_min = i18n.my_min;
    if (showHour > 1 && Config.isEn) 
      my_hour = 'hrs'
    if (showMin > 1 && Config.isEn) 
      my_min = 'mins ago'
    return `${showHour}${my_hour} ${showMin}${my_min}`
  } else {
    return time2Text(time, 'yyyy-MM-dd hh:mm')
  }
}

export function cardNumber(card = '') {
  if (!card || card.length < 4) {
    return ''
  }
  return card.substr(0, 4) + '******' + card.substr(card.length - 4, 4)
}

export function phone(phone = '') {
  if (!phone || phone.length < 4) {
    return ''
  }

  return phone.substr(0, 3) + '****' + phone.substr(phone.length - 4, 4)
}

export function dataFromQrcode(qrcode = '') {
  let qrData = {};
  if (!qrcode) {
    return qrData;
  }
  let index = qrcode.indexOf('?');
  if (qrcode.indexOf('http') == 0) {
    qrData.url = qrcode;
  } else {
    if (index < 0) {
      qrData.address = qrcode
    } else {
      qrData.address = qrcode.substr(0, index);
    }
  }
  if (index > 0) {
    const paramStrng = qrcode.substr(index + 1, qrcode.length - index - 1);
    const paramArray = paramStrng.split('&');
    paramArray.forEach(item => {
      let tmp = item.split('=');
      if (tmp.length >= 1) {
        qrData[tmp[0]] = tmp[1]
      }
    });
  }

  return qrData;
}

/**
 *
 * @param {*} str
 * @param {*} number
 * @returns {string}
 */
export function addressSting(str = '', number = 5) {
  if (!str) {
    return '';
  }
  if (str.length < number) {
    return str;
  }
  return str.substr(0, number) + '...' + str.substr(str.length - number, number)
}

export const __string2byte = (str) => {
  var bytes = new Array();
  var len,
    c;
  len = str.length;
  for (var i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10FFFF) {
      bytes.push(((c >> 18) & 0x07) | 0xF0);
      bytes.push(((c >> 12) & 0x3F) | 0x80);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00FFFF) {
      bytes.push(((c >> 12) & 0x0F) | 0xE0);
      bytes.push(((c >> 6) & 0x3F) | 0x80);
      bytes.push((c & 0x3F) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007FF) {
      bytes.push(((c >> 6) & 0x1F) | 0xC0);
      bytes.push((c & 0x3F) | 0x80);
    } else {
      bytes.push(c & 0xFF);
    }
  }
  return bytes
}

function __bytes2Str(arr) {
  var str = "";
  for (var i = 0; i < arr.length; i++) {
    var tmp = arr[i].toString(16);
    if (tmp.length == 1) {
      tmp = "0" + tmp;
    }
    str += tmp;
  }
  return '0x' + str;
}

export function stringToByteString(str) {
  const bytes = __string2byte(str)
  return __bytes2Str(bytes);
}
/**
 *
 * @param {Number} n
 */
export const toRa = (n) => {
  var arr = ['Ra', 'kRa', 'MRa', 'DDAM']
  var i;
  var len = arr.length - 1

  for (i = 0, n = +n || 0; i < len && n >= 1000; ++i, n /= 1000) {}
  n = n.toFixed(9);
  return (i === len
    ? numberAddComma(n)
    : n) + ' ' + arr[i]
}

export function numberAddComma(n) {
  n = +n || 0

  var parts = n
    .toString()
    .split('.')

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}