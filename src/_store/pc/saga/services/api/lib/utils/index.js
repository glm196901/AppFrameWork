export function invariant(check, message, thing) {
    if (!check)
        throw new Error("数据有限性验证失败: " + message + (thing ? ` in '${thing}'` : ""));
}

export function getCloseTime(arr) {
    let o = new Date().getTime();
    return arr.find((e) => {
        return o < e;
    })

}

/**
 *
 * @param {String} format
 * @param {Object} [options]
 * @returns {*}
 */
export function formatDate(format, options = {}) {
    let {date, isUTC} = options;

    /***新旧接口兼容 旧接口返回nunber类型 新接口返回string类型 string类型时间戳无法直接转化为时间对象 */
    date = Number(date) || date;
    /** */

    if (!format)
        return null;

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

    return format.replace('y', y).replace('m', m).replace('d', d).replace('h', h).replace('i', i).replace('s', s);
}

export function completeNum(num) {
    return num < 10 ? "0" + num : num;
}

export function getIdentity(len) {
    let SEED = '0Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4Yy5Zz6789'.split('');
    let SIZE = SEED.length;
    let LEN = 20;
    if (!len || typeof len !== 'number') {
        len = LEN
    }

    let uid = '';
    while (len-- > 0) {
        uid += SEED[Math.random() * SIZE | 0]
    }

    return uid
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
            result = 'ios'
        } else if (/(Android)/i.test(navigator.userAgent)) {
            result = 'android'
        } else {
            result = 'h5'
        }
    } else {
        if (/(Android)/i.test(navigator.userAgent)) {
            result = 'android'
        } else {
            result = 'pc'
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
    d.setTime(d.getTime() + (exp * 24 * 60 * 60 * 1000));
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
    if (val != null)
        document.cookie = `${name}=${val};expires=${exp.toUTCString()}`;
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
    return mobile.replace(/(\d{3})\d{4}(\d{4})/, "$1 **** $2");
}

/**
 * 隐藏银行卡或身份证
 * */
export function idMark(id) {
    //return id.replace(/(\d{8})\d{4}(\d{6})/, "$1****$2");
    if (id.length === 16) {
        return id.replace(/\d{12}(\d{4})/, "**** **** **** **** $1");
    } else if (id.length === 17) {
        return id.replace(/\d{13}(\d{4})/, "**** **** **** **** $1");
    } else if (id.length === 18) {
        return id.replace(/\d{14}(\w{4})/, "**** **** **** **** $1");
    } else if (id.length === 19) {
        return id.replace(/\d{15}(\d{4})/, "**** **** **** **** $1");
    }

}

/**
 * 去除空格
 * */
export function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}

/**
 * 判断是否空数组
 * */
export function isEmptyAry(e) {
    let t;
    for (t in e)
        return !1;
    return !0;
}

/**
 *
 * @param name
 * @param value
 * @param split
 */
export function insertLocalStore(name, value, split = ',') {
    const o = getLocalStore(name, 'Array', {split});
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
        val = JSON.stringify(val)
    } else if (type === 'Array') {
        val = val.join(options.split || ',');
    }
    Storage.setItem(name, val)
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
        return null
    }
    if (type === 'Object') {
        return JSON.parse(val)
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
        let body = document.body, html = document.documentElement;
        let height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight, window.innerHeight);
        document.body.style.height = `${height}px`;
    } else {
        document.body.style.height = 'auto';
    }

}

export const Storage = {
    getItem(key) {
        try {
            if (window.localStorage) {
                return localStorage.getItem(key)
            } else {
                return getCookie(key)
            }
        } catch (err) {
            console.warn(err);
            return null;
        }
    },
    setItem(key, value) {
        try {
            if (window.localStorage) {
                localStorage.setItem(key, value)
            } else {
                setCookie(key, value, 365)
            }
        } catch (err) {
            console.warn(err)
        }
    },
    removeItem(key) {
        try {
            if (window.localStorage) {
                localStorage.removeItem(key)
            } else {
                removeCookie(key)
            }
        } catch (err) {
            console.warn(err)
        }
    }
};