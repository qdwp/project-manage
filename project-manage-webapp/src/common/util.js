import MD5 from 'crypto-js/md5';
import BASE64 from 'crypto-js/enc-base64';
import ENC_UTF8 from 'crypto-js/enc-utf8';
import { openNotice } from '../common/antdUtil';
import { rspInfo } from '../common/authConstant';
import { url } from '../config/server';

/**
 * 检测是否已登录(判断sessionStorage中loginInfo是否为null)
 *
 * 返回: boolean
 */
export function checkLogin() {
  return !(sessionStorage.getItem('man_login_info') === null);
}

/**
 * 设置登录信息(将登录信息loginInfo设置到sessionStorage中)
 * 使用BASE64编码
 * 参数：
 * info: 登录信息对象
 */
export function setLoginInfo(info) {
  let str = '';
  if (Object.prototype.toString.call(info) !== '[object String]') {
    str = JSON.stringify(info);
  } else {
    str = info;
  }
  sessionStorage.removeItem('man_login_info');
  sessionStorage.setItem('man_login_info', BASE64.stringify(ENC_UTF8.parse(str)));
}

/**
 * 获取登录信息(从sessionStorage中获取loginInfo)
 * 使用BASE64解码
 * 返回: Object
 */
export function getLoginInfo() {
  let info = {};
  if (checkLogin() === true) {
    // 获取loginInfo后需解密
    info = JSON.parse(BASE64.parse(sessionStorage.getItem('man_login_info')).toString(ENC_UTF8));
  }
  return info;
}

/**
 * 移除登录信息(从localStorage中移除loginInfo,同时移除appState)
 */
export function removeLoginInfo() {
  sessionStorage.clear();
  localStorage.clear();
}

export function setLocalItem(k, v) {
  localStorage.removeItem(k);
  if (v !== null) {
    localStorage.setItem(k, BASE64.stringify(ENC_UTF8.parse(v.toString())));
  }
}

export function getLocalItem(k) {
  const item = localStorage.getItem(k);
  try {
    return item === null ? null : BASE64.parse(item).toString(ENC_UTF8);
  } catch (e) {
    console.error(e, item);
    localStorage.removeItem(k);
    return null;
  }
}

/**
 * 在localStorage中存登录token信息
 */
export function setLocalToken(token) {
  localStorage.removeItem('man_info_token');
  if (token !== null) {
    localStorage.setItem('man_info_token', BASE64.stringify(ENC_UTF8.parse(token.toString())));
  }
}

/**
 * 在localStorage中取登录token信息
 */
export function getLocalToken() {
  const tk = localStorage.getItem('man_info_token');
  try {
    return tk === null ? null : BASE64.parse(tk).toString(ENC_UTF8);
  } catch (e) {
    console.error(e, 'man_info_token');
    localStorage.removeItem('man_info_token');
    return null;
  }
}

/**
 * 移除在localStorage中登录token信息
 */
export function removeLocalStorageToken() {
  localStorage.removeItem('man_info_token');
}

export function getCookie(name) {
  let ck = null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    ck = parts.pop().split(';').shift();
  }
  return ck;
}

/**
 * 获取url中指定key的value
 */
export function getUrlVal(url, key) {
  let val = '';
  const idx = url.indexOf(`${key}=`);
  if (idx !== -1) {
    const nurl = url.substring(idx);
    const idx2 = nurl.indexOf('&');
    val = nurl.substring(1 + key.length, idx2 === -1 ? url.length : idx2);
  }
  return val;
}

/**
 * 判断是否为数组
 */
export function isArray(v) {
  return Object.prototype.toString.call(v) === '[object Array]';
}

/**
 * 判断是否为对象(包括函数和数组)
 */
export function isObject(obj) {
  const type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

/**
 * 判断{}对象空不空
 */
export function isEmptyObject(e) {
  for (const t in e) {
    if (e[t]) {
      return !1;
    }
  }
  return !0;
}

/**
 * 判断是否支持promise
 * 参数:
 * 被判断对象
 * 返回: Boolean
 */
export function isPromise(value) {
  let result = false;
  if (value !== null && typeof value === 'object') {
    result = value.promise && typeof value.promise.then === 'function';
  }
  return result;
}

/**
 * 构建签名用原始字符串
 */
function buildSignString(ori, dat) {
  let str = ori;
  if (dat !== null && dat !== undefined) {
    const keys = Object.keys(dat).sort();  // key的升序排序
    for (let i = 0; i < keys.length; i++) {
      const v = dat[keys[i]];
      if (keys[i] === 'token' || v === undefined || v === null || isArray(v) || isObject(v) || v.toString().trim === '') {
        continue;
      }
      str += v.toString();
    }
  }
  return str;
}

/**
 * 校验响应签名
 * 校验方式：
 * 1. 从响应信息的header中取出rsp-auth作为签名(改为从response中取rspAuth)
 * 2. 响应信息签名的构建方式为repCode拼接repData(key升序排序拼接值)作为原始字符串(改为拼接rspCod和rspHash)
 * 3. 对原始字符串进行base64转换
 * 4. 转换后的base64的值拼接token(如果不为空)进行md5计算(改为不拼接token)
 * 5. 与header中的rsp-auth对比(改为与response中的rspAuth对比)
 * 参数：
 * code：响应码(一般为result.rspCod)
 * dat：响应数据(一般为result.rspData)
 * sign：响应签名
 * tk：当前token(可为null)
 */
export function validResSign(code, dat, sign, tk) {
  let str = buildSignString(code, dat);
  str = MD5(BASE64.stringify(ENC_UTF8.parse(str))).toString();
  // str = MD5(tk !== null ? (str + tk) : str).toString();
  const result = str === sign;
  if (result === false) {
    console.log('响应签名校验失败');
    console.log('响应签名', sign);
    console.log('计算签名', str);
  } else {
    console.log('签名校验通过');
  }
  return result;
}

/**
 * 构建请求签名
 * 构建方式：
 * 1. 请求参数按key的升序排序，拼接参数值(去除token、Object和Array等参数值)，组成原始字符串
 * 2. 对原始字符串进行base64转换
 * 3. 转换后的base64的值拼接token(如果不为空)进行md5计算
 * 4. 构建完成后的签名放在请求的header中，属性为req-auth
 * 参数：
 * req: 请求名
 * dat：请求参数对象
 * tk：当前token(可为null)
 */
export function buildReqSign(req, dat, tk) {
  let str = buildSignString(req, dat);
  if (str !== '') {
    str = BASE64.stringify(ENC_UTF8.parse(str));
  }
  return MD5(tk !== null ? (str + tk) : str).toString();
}

/**
 * 刷新session中的loginInfo信息
 */
export function refreshLoginInfo(tk, asyn) {
  if (tk === null) {
    console.log('检查登录');
    openNotice('error', '登录检查失败，请重新登录');
    setTimeout(() => {
      if (document.getElementById('hiddenLogoutBtn')) {
        document.getElementById('hiddenLogoutBtn').click();
      } else {
        window.location.href = '/#/login';
      }
    }, 3200);
  } else {
    const dat = { token: tk };
    window.$.support.cors = true;  // IE8下cors跨域访问
    window.$.ajax({
      type: 'POST',
      url: url.user.validToken,
      data: dat,
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      async: asyn,
      crossDomain: true,
      cache: false,
      // beforeSend: (req) => {
      //   req.setRequestHeader('req-auth', buildReqSign(name, dat, tk));
      // },
      success: (result, status, xhr) => {
        // validResSign(result.rspCod + result.rspHash, null, result.rspAuth, tk);
        if (result.rspCode === rspInfo.RSP_SUCCESS) {
          const info = result.rspData;
          setLoginInfo(info); // 将登录信息保存到当前页面的 sessionStorage 中
          // asyn为false时，代表直接从浏览器输入地址同步查询loginInfo
          if (asyn.toString() === 'true') {
            openNotice('info', '您可能已使用其他账户登录，3秒后将刷新页面');
            setTimeout(() => { location.reload(); }, 3000);
          }
        } else if (result.rspCode === rspInfo.RSP_OTHER) {
          openNotice('warning', result.rspMsg);
          setTimeout(() => {
            if (document.getElementById('hiddenLogoutBtn')) {
              document.getElementById('hiddenLogoutBtn').click();
            } else {
              window.location.href = '/#/login';
            }
          }, 3200);
        } else {
          openNotice('warning', result.rspMsg);
        }
      },
      error: () => {
        openNotice('warning', '请求发送失败', '错误');
      },
    });
  }
}

// inner function
function doNormalRequest(type, opt, data, dataType, contentType, asyn, successCallback, errorCallback) {
  const tk = data.token ? data.token : null;
  const arr = opt.url.split('/');
  const name = arr[arr.length - 1].split('.')[0];
  data.token = getLoginInfo().token;
  window.$.support.cors = true;  // IE8下cors跨域访问
  window.$.ajax({
    type,
    url: opt.url,
    data,
    dataType,
    contentType,
    async: asyn,
    crossDomain: true,
    cache: false,
    // beforeSend: (req) => {
    //   req.setRequestHeader('req-auth', buildReqSign(name, data, tk));
    // },
    success: (result, status, xhr) => {
      const cod = result.rspCod;
      // validResSign(cod + result.rspHash, null, result.rspAuth, cod === '_SSO_ERR' ? null : tk);
      if (cod === rspInfo.RSP_OTHER) {
        openNotice('error', result.rspMsg);
        setTimeout(() => {
          document.getElementById('hiddenLogoutBtn').click();
        }, 3200);
        return;
      }
      if (typeof successCallback === 'function') {
        successCallback(result);
      }
    },
    error: (req, info, o) => {
      if (typeof errorCallback === 'function') {
        errorCallback(req, info, o);
      } else {
        openNotice('error', '请求发送失败', '错误');
      }
    },
  });
}

function equals(str1, str2) {
  if ((str1 === undefined || str1 === null) && (str2 === undefined || str2 === null)) {
    return true;
  }
  const s1 = str1.split('.');
  const s2 = str2.split('.');
  console.log(s1, s2);
  for (let i = 0; i < 3; i++) {
    console.log(s1[i], s2[i]);
  }
  if (s1[0] === s2[0] && s1[1] === s2[1] && s1[2] === s2[2]) {
    return true;
  }
  return false;
}

/**
 * 发送ajax请求(使用jQuery发送ajax)
 *
 * 参数:
 * opt: 请求参数对象
 *      url: 请求地址, 必选
 *      type: 请求类型, 可选(默认POST)
 *      data: 请求参数, 可选(默认{})
 *      dataType: 参数类型, 可选(默认json)
 *      async: 请求模式, 可选(默认true 异步)
 *      contentType: 发送编码类型, 可选(默认application/x-www-form-urlencoded)
 * successCallback: 发送成功回调方法
 * errorCallback: 发送失败回调方法
 */
export function callAjax(opt, successCallback, errorCallback) {
  let type = 'POST';
  let data = {};
  let dataType = 'json';
  let async = true;
  let contentType = 'application/x-www-form-urlencoded';
  if (opt) {
    type = opt.type ? opt.type : type;
    data = opt.data ? opt.data : data;
    dataType = opt.dataType ? opt.dataType : dataType;
    async = opt.async ? async : opt.async;
    contentType = opt.contentType ? opt.contentType : contentType;
  }
  // const info = getLoginInfo();
  // const ltk = getLocalToken();
  // console.log('object');
  // console.log('比较', info.token, ltk);
  // if (equals(ltk, info.token)) {
  //   console.log('相等');
  // }
  // if (ltk === info.token) {
  //   if (info) {
  //     data.token = info.token;
  //   }
  //   doNormalRequest(type, opt, data, dataType, contentType, async, successCallback, errorCallback);
  // } else {
  //   console.log(123);
  //   refreshLoginInfo(ltk, true);
  // }
  // } else {
  //   if (info) {
  //     data.token = info.token;
  //   }
  doNormalRequest(type, opt, data, dataType, contentType, async, successCallback, errorCallback);
  // }
}

/**
 * 过滤对象属性(去掉值为null,undefined的属性)
 * 参数：
 * obj：待过滤的对象
 * 返回：
 * 过滤后的对象
 */
export function filterObject(obj) {
  const o = {};
  for (const k in obj) {
    if (obj[k]) {
      if (obj[k].length > 0 && (obj[k].indexOf('@@') > -1 || obj[k].indexOf('%') > -1)) {
        delete obj[k];
      } else {
        o[k] = obj[k];
      }
    }
  }
  return o;
}

/**
 * 格式化日期
 *
 * 参数：
 * date：带格式化日期(Date类型)
 * fmt：格式(yyyy-MM-dd hh:mm:ss.S 等)
 */
export function formatDate(d, f) {
  const date = d;
  let fmt = f;
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
  }
  return fmt;
}

/**
 * 格式化日期字符串，只能格式化形如yyyyMMddHHmmss为yyyy-MM-dd HH:mm:ss
 * 参数：
 * dateStr：日期字符串(String类型)
 */
export function parseDate(dateStr) {
  let str = dateStr;
  if (dateStr && dateStr !== null && dateStr.length === 8) {
    str = `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(6, 2)}`;
  } else if (dateStr && dateStr !== null && dateStr.length >= 14) {
    str = `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(6, 2)} ${dateStr.substr(8, 2)}:${dateStr.substr(10, 2)}:${dateStr.substr(12, 2)}`;
  }
  return str;
}

export function setDict(dictData) {
  localStorage.setItem('DICT', JSON.stringify(dictData));
}

export function getSelectOption(key) {
  const DICT_DATA_JSON = JSON.parse(localStorage.getItem('DICT'));
  if (DICT_DATA_JSON[key] === undefined || DICT_DATA_JSON[key] === '') {
    return null;
  }
  return DICT_DATA_JSON[key];
}

/**
 * 将查询的码表信息放到本地
 * type    : 码表类型
 * dictData: 码表列表
 */
export function setDictType(type, dictData) {
  sessionStorage.setItem(`DICT_SELECT_${type}`, JSON.stringify(dictData));
}

/**
 * 通过值获取名
 */
export function getDict(key, val) {
  const sRes = sessionStorage.getItem(`DICT_SELECT_${key}`);
  if (sRes === null && sRes === undefined) {
    return '';
  }
  const arrTemp = JSON.parse(sRes);
  if (arrTemp === null || arrTemp.length <= 0) {
    return '';
  }
  let sname = '';
  for (let j = 0; j < arrTemp.length; j++) {
    const oTemp = arrTemp[j];
    if (oTemp.attrMap.DICT_VALUE === val) {
      sname = oTemp.attrMap.DICT_NAME;
      break;
    }
  }
  let v = '';
  if (sname === '') {
    v = val;
  } else {
    v = sname;
  }
  return v;
}

/**
 * 查询本地的码表信息
 * type : 码表类型
 */
export function getDictByType(type) {
  const sRes = sessionStorage.getItem(`DICT_SELECT_${type}`);
  if (sRes === null && sRes === undefined) {
    return null;
  }
  return JSON.parse(sRes);
}

function getDictCallbackObj(arrType) {
  const oRes = {};
  let arrTemp = null;
  let sTemp = null;
  for (let i = 0; i < arrType.length; i++) {
    sTemp = arrType[i];
    arrTemp = getDictByType(sTemp);
    oRes[sTemp] = [];
    if (arrTemp === null) {
      continue;
    }
    for (let j = 0; j < arrTemp.length; j++) {
      const oTemp = arrTemp[j];
      oRes[sTemp][oRes[sTemp].length] = { value: oTemp.attrMap.DICT_VALUE, text: oTemp.attrMap.DICT_NAME };
    }
  }
  return oRes;
}

/**
 * 查询远程的下拉选项信息
 * url   : 请求地址
 * param ：请求的参数
 *     -type    : ['STATUS','SEX'...] 请求后台的码表类型
 * reload  : true|false 是否直接从远程查询
 * callback: 回调函数
 */
export function requestSelectData(url, para, re, callback) {
  const arrType = para.type;
  let param = para;
  let sRemoteParams = '';
  let oRes = {};
  let sType = '';
  let reload = re;
  // reload 默认为false
  if (typeof (reload) === undefined) {
    reload = false;
  }
  for (let i = 0; i < arrType.length; i++) {
    sType = arrType[i];
    // 设置重新加载 或 本地未找到 都需要从服务器获取
    if (reload || getDictByType(sType) === null) {
      sRemoteParams += `${sType},`;
      continue;
    }
  }
  if (sRemoteParams === '') {
    oRes = getDictCallbackObj(arrType);
    callback(oRes);
  } else {
    param = { TYPES: sRemoteParams };
    // 此处发送ajax请求获取数据更新
    const opt = {
      url,
      type: 'GET',
      dataType: 'json',
      data: param,
    };
    let oTypeTemp = null;
    callAjax(opt, (result) => {
      oTypeTemp = result.rspData.DATA;
      for (const sKey in oTypeTemp) {
        // 本地不存在，后台查询成功，更新本地存储
        if (oTypeTemp[sKey]) {
          setDictType(sKey, oTypeTemp[sKey]);
        }
      }
      oRes = getDictCallbackObj(arrType);
      callback(oRes);
    });
  }
}

/**
 * 格式化金额(如：12345.67格式化为 12,345.67)
 * @param s
 * @param n
 * @returns {String}
 */
export function formatMoney(amt, pos) {
  let s = amt;
  let n = pos;
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s.toString()).replace(/[^\d\.-]/g, '')).toFixed(n).toString();
  const l = s.split('.')[0].split('').reverse();
  const r = s.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '');
  }
  return `${t.split('').reverse().join('')}.${r}`;
}

/**
 * 分转元
 */
export function cent2Yuan(cent) {
  if (cent === null || cent === '' || isNaN(cent)) {
    return '0.00';
  }
  const yuan = formatMoney(cent / 100, 2);
  return yuan.replace(/[0]+$/, '').replace(/[.]+$/, '');
}
/**
 * 格式化金额:  12345.67格式化为 12,345.67
 * @param s
 * @param n
 * @returns {String}
 */
function TDFormatMoney(s, n) {
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
  var l = s.split('.')[0].split('').reverse(),
    r = s.split('.')[1];
  let t = '';
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
  }
  return t.split('').reverse().join('') + '.' + r;
}
// 分转化为元去除分号
export function cent2YuanRemoveComma(cent) {
  let yuan = cent2Yuan(cent);
  return yuan !== '0.00' ? yuan.replace(/,/g, '') : yuan;
}

// 元去除逗号
export function YuanRemoveComma(yuan) {
  return yuan !== '0.00' ? yuan.replace(/,/g, '') : yuan;
}

// 元转分
export function Yuan2Fen(value) {
  return Number(value) * 100;
}

export function getDay(day) {
  const today = new Date();

  const targetdayMilliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  // console.log('targetday_milliseconds', targetday_milliseconds);
  today.setTime(targetdayMilliseconds); // 注意，这行是关键代码
  // console.log('time', today.getTime());
  // let tYear = today.getFullYear();
  let tMonth = today.getMonth();
  let tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);
  // return tYear + "-" + tMonth + "-" + tDate;
  return today.getTime();
}

function doHandleMonth(month) {
  let m = month;
  if (month.toString().length === 1) {
    m = `0${month}`;
  }
  return m;
}
