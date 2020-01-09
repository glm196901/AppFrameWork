/*
 ** 银行卡背景图
 */
import ICBC from '@/app/base/static/images/svg/bankBg/icbc.svg';
import CMB from '@/app/base/static/images/svg/bankBg/cmb.svg';
import CCB from '@/app/base/static/images/svg/bankBg/ccb.svg';
import ABC from '@/app/base/static/images/svg/bankBg/abc.svg';
import BOC from '@/app/base/static/images/svg/bankBg/boc.svg';
import COMM from '@/app/base/static/images/svg/bankBg/comm.svg';
import CMBC from '@/app/base/static/images/svg/bankBg/cmbc.svg';
import SPDB from '@/app/base/static/images/svg/bankBg/spdb.svg';
import CITIC from '@/app/base/static/images/svg/bankBg/citic.svg';
import GDB from '@/app/base/static/images/svg/bankBg/gdb.svg';
import SZPAB from '@/app/base/static/images/svg/bankBg/szpab.svg';
import CIB from '@/app/base/static/images/svg/bankBg/cib.svg';
import HXB from '@/app/base/static/images/svg/bankBg/hxb.svg';
import CEB from '@/app/base/static/images/svg/bankBg/ceb.svg';
import PSBC from '@/app/base/static/images/svg/bankBg/psbc.svg';

/*
 ** 银行卡icon
 */
import iconICBC from '@/app/base/static/images/svg/bankIcon/icbc.png';
import iconCMB from '@/app/base/static/images/svg/bankIcon/cmb.png';
import iconCCB from '@/app/base/static/images/svg/bankIcon/ccb.png';
import iconABC from '@/app/base/static/images/svg/bankIcon/abc.png';
import iconBOC from '@/app/base/static/images/svg/bankIcon/boc.png';
import iconCOMM from '@/app/base/static/images/svg/bankIcon/comm.png';
import iconCMBC from '@/app/base/static/images/svg/bankIcon/cmbc.png';
import iconSPDB from '@/app/base/static/images/svg/bankIcon/spdb.png';
import iconCITIC from '@/app/base/static/images/svg/bankIcon/citic.png';
import iconGDB from '@/app/base/static/images/svg/bankIcon/gdb.png';
import iconSZPAB from '@/app/base/static/images/svg/bankIcon/szpab.png';
import iconCIB from '@/app/base/static/images/svg/bankIcon/cib.png';
import iconHXB from '@/app/base/static/images/svg/bankIcon/hxb.png';
import iconCEB from '@/app/base/static/images/svg/bankIcon/ceb.png';
import iconPSBC from '@/app/base/static/images/svg/bankIcon/psbc.png';

// 引入省市对照json
import address from './address.json';

export const bankNames = [
  '工商银行',
  '招商银行',
  '建设银行',
  '农业银行',
  '中国银行',
  '交通银行',
  '民生银行',
  '浦发银行',
  '中信银行',
  '广发银行',
  '兴业银行',
  '华夏银行',
  '光大银行',
  '邮政储蓄'
];

export function matchBank(name, property = '') {
  switch (name) {
    case '工商银行':
      if (!property) return ICBC;
      else return iconICBC;
    case '招商银行':
      if (!property) return CMB;
      else return iconCMB;
    case '建设银行':
      if (!property) return CCB;
      else return iconCCB;
    case '农业银行':
      if (!property) return ABC;
      else return iconABC;
    case '中国银行':
      if (!property) return BOC;
      else return iconBOC;
    case '交通银行':
      if (!property) return COMM;
      else return iconCOMM;
    case '民生银行':
      if (!property) return CMBC;
      else return iconCMBC;
    case '浦发银行':
      if (!property) return SPDB;
      else return iconSPDB;
    case '中信银行':
      if (!property) return CITIC;
      else return iconCITIC;
    case '广发银行':
      if (!property) return GDB;
      else return iconGDB;
    case '平安银行':
      if (!property) return SZPAB;
      else return iconSZPAB;
    case '兴业银行':
      if (!property) return CIB;
      else return iconCIB;
    case '华夏银行':
      if (!property) return HXB;
      else return iconHXB;
    case '光大银行':
      if (!property) return CEB;
      else return iconCEB;
    case '邮政储蓄':
      if (!property) return PSBC;
      else return iconPSBC;
  }
}

export function invariant(check, message, thing) {
  if (!check) throw new Error('数据有限性验证失败: ' + message + (thing ? ` in '${thing}'` : ''));
}

export function getCloseTime(arr) {
  let o = new Date().getTime();
  return arr.find(e => {
    return o < e;
  });
}

/**
 *
 * @param {String} format
 * @param {Object} [options]
 * @returns {*}
 */
export function formatDate(format, options = {}) {
  let { date, isUTC } = options;

  /***新旧接口兼容 旧接口返回nunber类型 新接口返回string类型 string类型时间戳无法直接转化为时间对象 */
  date = Number(date) || date;
  /** */

  if (!format) return null;

  if (!date) {
    date = new Date();
  } else {
    date = new Date(date);
  }

  let y, m, d, h, i, s;

  if (isUTC) {
    y = date.getFullYear();
    m = completeNum(date.getUTCMonth() + 1);
    d = completeNum(date.getUTCDate());
    h = completeNum(date.getUTCHours());
    i = completeNum(date.getUTCMinutes());
    s = completeNum(date.getUTCSeconds());
  } else {
    y = date.getFullYear();
    m = completeNum(date.getMonth() + 1);
    d = completeNum(date.getDate());
    h = completeNum(date.getHours());
    i = completeNum(date.getMinutes());
    s = completeNum(date.getSeconds());
  }

  return format
    .replace('y', y)
    .replace('m', m)
    .replace('d', d)
    .replace('h', h)
    .replace('i', i)
    .replace('s', s);
}

export function completeNum(num) {
  return num < 10 ? '0' + num : num;
}

export function getIdentity(len) {
  let SEED = '0Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4Yy5Zz6789'.split(
    ''
  );
  let SIZE = SEED.length;
  let LEN = 20;
  if (!len || typeof len !== 'number') {
    len = LEN;
  }

  let uid = '';
  while (len-- > 0) {
    uid += SEED[(Math.random() * SIZE) | 0];
  }

  return uid;
}

export function toPassword(val) {
  const n = val.length;
  let result = '';
  for (let o = 0; o < n; o++) {
    result += '*';
  }
  return result;
}

/**
 * 获取当前平台名
 * @returns {string}
 */
export function getPlatform() {
  let result = '';
  let u = navigator.userAgent;
  if (u.match(/AppleWebKit.*Mobile.*/)) {
    if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      result = 'ios';
    } else if (/(Android)/i.test(navigator.userAgent)) {
      result = 'android';
    } else {
      result = 'h5';
    }
  } else {
    if (/(Android)/i.test(navigator.userAgent)) {
      result = 'android';
    } else {
      result = 'pc';
    }
  }
  return result;
}

/**
 * 获取查询字符串
 * @example ?t=1  返回{t:1}
 * @returns {{}}
 */
export function getSearch() {
  let search = {};
  let address = window.location.href;
  if (address.indexOf('?') !== -1) {
    [, address] = address.split('?');
    address = address.split('&');
    for (let o of address) {
      let [key, val] = o.split('=');
      search[key] = val;
    }
  }
  return search;
}

/**
 * 设置cookie
 * @param name
 * @param value
 * @param exp
 */
export function setCookie(name, value, exp) {
  let d = new Date();
  d.setTime(d.getTime() + exp * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

export function getCookie(name) {
  let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

export function removeCookie(name) {
  let exp = new Date();
  exp.setTime(exp.getTime() - 1);
  let val = getCookie(name);
  if (val != null) document.cookie = `${name}=${val};expires=${exp.toUTCString()}`;
}

/**
 * 隐藏姓名
 * */
export function nameMark(name) {
  return name.replace(/.(?=.)/g, '*');
}

/**
 * 隐藏电话
 * */
export function mobileMask(mobile) {
  return mobile && mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2');
}

/**
 * 隐藏银行卡或身份证
 * */
export function idMark(id) {
  //return id.replace(/(\d{8})\d{4}(\d{6})/, "$1****$2");
  if (id.length === 16) {
    return id.replace(/\d{12}(\d{4})/, '**** **** **** **** $1');
  } else if (id.length === 17) {
    return id.replace(/\d{13}(\d{4})/, '**** **** **** **** $1');
  } else if (id.length === 18) {
    return id.replace(/\d{14}(\w{4})/, '**** **** **** **** $1');
  } else if (id.length === 19) {
    return id.replace(/\d{15}(\d{4})/, '**** **** **** **** $1');
  }
}

/**
 * 去除空格
 * */
export function removeAllSpace(str) {
  return str.replace(/\s+/g, '');
}

/**
 * 判断是否空数组
 * */
export function isEmptyAry(e) {
  let t;
  for (t in e) return !1;
  return !0;
}

/**
 *
 * @param name
 * @param value
 * @param split
 */
export function insertLocalStore(name, value, split = ',') {
  const o = getLocalStore(name, 'Array', { split });
  o.push(value);
  Storage.setItem(name, o.join(split));
}

/**
 *
 * @param name
 * @param val
 * @param type
 * @param options
 * @returns {*}
 */
export function setLocalStore(name, val, type, options = {}) {
  if (type === 'Object') {
    val = JSON.stringify(val);
  } else if (type === 'Array') {
    val = val.join(options.split || ',');
  }
  Storage.setItem(name, val);
}

/**
 *
 * @param name
 * @param type
 * @param options
 * @returns {*}
 */
export function getLocalStore(name, type, options = {}) {
  let val = Storage.getItem(name);
  if (val === null) {
    if (type === 'Object') return {};
    if (type === 'Array') return [];
    if (type === 'Boolean') return false;
    return null;
  }
  if (type === 'Object') {
    return JSON.parse(val);
  } else if (type === 'Array') {
    return val.split(options.split || ',');
  } else if (type === 'Boolean') {
    return Boolean(val);
  }
  return val;
}

/**
 * 根据弹出键盘弹性的调整界面高度
 * @param value
 */
export function flexResize(value) {
  if (value) {
    let body = document.body,
      html = document.documentElement;
    let height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
      window.innerHeight
    );
    document.body.style.height = `${height}px`;
  } else {
    document.body.style.height = 'auto';
  }
}

export const Storage = {
  getItem(key) {
    try {
      if (window.localStorage) {
        return localStorage.getItem(key);
      } else {
        return getCookie(key);
      }
    } catch (err) {
      console.warn(err);
      return null;
    }
  },
  setItem(key, value) {
    try {
      if (window.localStorage) {
        localStorage.setItem(key, value);
      } else {
        setCookie(key, value, 365);
      }
    } catch (err) {
      console.warn(err);
    }
  },
  removeItem(key) {
    try {
      if (window.localStorage) {
        localStorage.removeItem(key);
      } else {
        removeCookie(key);
      }
    } catch (err) {
      console.warn(err);
    }
  }
};
// 省市选择
function formatData(province) {
  let data = province ? address[province] : address;
  let result = [];
  for (let key in data) {
    result.push({
      value: key
    });
  }
  return result;
}

export function provinceData(antPicker = false) {
  if (antPicker) {
    let result = [].concat(formatData());
    result.map(item => {
      item.label = item.value;
      return item;
    });
    return result;
  }
  return formatData();
}

/**
 * @deprecated 拼写错误，心里没点儿逼数么
 * @param province
 * @param antPicker
 * @returns {*[]}
 */
export function cityeData(province, antPicker = false) {
  if (antPicker) {
    let result = [].concat(formatData(province));
    result.map(item => {
      item.label = item.value;
      return item;
    });
    return result;
  }
  return formatData(province);
}

export function cityData(province, antPicker = false) {
  if (antPicker) {
    let result = [].concat(formatData(province));
    result.map(item => {
      item.label = item.value;
      return item;
    });
    return result;
  }
  return formatData(province);
}

export function copyToClipboard(str) {
  const el = document.createElement('textarea');
  el.value = str;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
}
