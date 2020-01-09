import {getPlatform} from "../../lib/utils";
import {Req} from "../network/Req";
import {LinkTo} from "../../core/native/native";
import alias from './alias';
import { EVENT } from "../event";

/**
 * type 数据源类型 input-输入  select-选择  fixed-定值
 * placeholder 占位符
 * style input-only 输入框的类型 number tel text password
 * length input-only 输入的长度限制  仅 text password tel生效
 * float input-only 限制输入的内容是否包含小数点
 * nonzero input-only 限制输入的内容最后一位是否不为0
 * min input-only number-tel only 限制输入的数字的最小值
 * max input-only number-tel only 限制输入的数字的最大值
 * chn 中文限制 true-只能中文  false-非中文
 */

export const PAYMENT = {
    Alert: null,
    list: [],
    route: {},
    payFirst: 0,
    payList:[],
    updateDuration:30000,
    setAlert(func) {
        if (typeof func === 'function') {
            this.Alert = func;
        }
    },
    _caution(msg) {
        if (this.Alert) {
            this.Alert(msg);
        } else {
            console.error(msg);
        }
    },
    alias(name) {
        return alias[name] || name;
    },
    async _updatePayment(i=0) {
        try {
            let res  = await Req({
                url: '/api/pay/recharge.htm',
                type: 'POST',
                data: {
                    action: 'getPayList',
                    switchType: 1,
                    paymentWay:i,
                    platform: getPlatform()
                }
            });

            this.payList = res.payList;

            setTimeout(() => {
                this._updatePayment(i)
            }, this.updateDuration);

            return res
        } catch (error) {
            this.payList = [];
            return {payList:[],payFirst:1}
        }
    },
    _package(list,local) {
        let e;
        let data = list
        let tempList = [];
        data.forEach(({id,area,description,name,url}) => {
            e = {id,area,subtitle:description,name};
            let [route,key] = url.split('?');
            
            if(local[route]){
                const transfer = JSON.stringify(local[route])
                e = Object.assign(e,JSON.parse(transfer));
                
                key = key.split('&');
                if (key.length > 0) {
                    key.forEach((ele) => {
                        if (ele) {
                            const [key, val] = ele.split('=');

                            if (key === 'min') {
                                e.param.money.min = val
                            }

                            if (key === 'max') {
                                e.param.money.max = val
                            }
                            e.param[key] = {
                                type: 'fixed',
                                value: val
                            }
                        }
                    })
                }
                tempList.push(e);
                this.route[id] = e;
            }
        });
        this.list = tempList;
        return this.list;
    },
    getConfig(id) {
        return Object.assign({}, this.route[id])
    },
    getList(i) {
        return new Promise(async (resolve,reject) => {
            try {
                const branch = this.alias(process.env.BRANCH);
                const {default:_} = await import(/* webpackPrefetch: true, webpackChunkName: "payment" */'./branch/' + branch);
                if (this.list.length > 0) {
                    let tempPayList = this.payList;
                    tempPayList.forEach((item)=>{
                        const desc = item.descr || item.description;
                        item.descr = item.description = desc
                    });
                    return resolve(this._package(tempPayList,_))
                }
                const {payList, payFirst} = await this._updatePayment(i);

                /**新旧接口兼容  旧接口 description 字段改为 desc */
                    payList.forEach((item)=>{
                        const desc = item.descr || item.description;
                        item.descr = item.description = desc
                    });
                /** */

                this.payFirst = payFirst;

                resolve(this._package(payList,_))
            } catch (err) {
                reject(err)
            } 
        })
    },
    isFirstPay() {
        return this.payFirst;
    },
    verify(obj) {
        return Object.entries(obj).every(([key, o]) => {
            if (o.type === 'input' || o.type.indexOf('input') !== -1) {
                if (o.value === '') {
                    this._caution(`请输入${o.title}`);
                    return false;
                }
                if ((o.style === 'number' || o.style === 'tel') && o.min !== undefined && o.min > 0) {
                    if (Number(o.value) < Number(o.min)) {
                        this._caution(`${o.title}最低${o.min}`);
                        return false;
                    }
                }
                if ((o.style === 'number' || o.style === 'tel') && o.max !== undefined && o.max > 0) {
                    if (Number(o.value) > Number(o.max)) {
                        this._caution(`${o.title}最高${o.max}`);
                        return false;
                    }
                }
                if (o.float !== undefined) {
                    if ((o.value.toString().indexOf('.') !== -1) !== o.float) {
                        this._caution(`${o.title}${o.float ? '必须' : '不能'}含有小数`);
                        return false;
                    }
                }else{
                    if (o.value.toString().indexOf('.') !== -1) {
                        this._caution(`${o.title}不能含有小数`);
                        return false;
                    }
                }
                if (o.nonzero !== undefined && o.nonzero) {
                    if (o.value.toString().slice(-1) === '0') {
                        this._caution(`${o.title}最后一位不能为0`);
                        return false;
                    }
                }
                
                if (o.aliName !== undefined && o.aliName) {
                    if (o.aliName.length === 0) {
                        this._caution(`请输入${o.title}`);
                        return false;
                    }
                }
                if (o.chn !== undefined) {
                    o.value = o.value.replace(/\r\n/g, '');
                    let pattern = /^([u4e00-u9fa5]|[ufe30-uffa0])*$/gi;
                    let other = /\d/g;
                    if (o.chn) {
                        if (pattern.test(o.value)) {
                            this._caution(`${o.title}请输入中文`);
                            return false
                        }
                    } else {
                        if (!pattern.test(o.value)) {
                            this._caution(`${o.title}请不要输入中文`);
                            return false
                        }
                    }
                }
                return true
            } else if (o.type === 'select') {
                if (o.value === '') {
                    this._caution(`请选择${o.title}`);
                    return false;
                }
                return true
            } else {
                return true
            }
        })
    },
    fast(obj,pc) {
        return new Promise(async (resolve, reject) => {
            try {
                let o = {};
                for (let [key, {value}] of Object.entries(obj.param)) {
                    if (key === 'money') {
                        o[key] = Number(value);
                    } else {
                        if (value === 'origin') value = window.location.origin;
                        o[key] = value
                    }
                }
                const data = await Req({
                    url: obj.url,
                    type: 'POST',
                    data: o,
                    animate: true
                });
                debugger
                if(pc){
                    resolve(`/api/vf/tdCode.gif?url=${data.redirectURL}`);
                }else{
                    if (data.html) {
                        document.write(data.html)
                    } else if (data.redirectURL) {
                        if (window.isSuperman) {
                            LinkTo(data.redirectURL)
                        } else {
                            window.location.href = data.redirectURL
                        }
                    }
                    resolve();
                }
            } catch (err) {
                reject(err)
            }
        });
    },

    //todo 验证真实姓名
    valid(name) {
        return new Promise (async(resolve,reject)=>{
            try {
                if (name.length === 0) reject('请输入您的真实姓名');
                if (!/^[\u4e00-\u9fa5]+$|^[\u4e00-\u9fa5]+·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*[\u4e00-\u9fa5]+$/.test(name)) return EVENT.Error.PROMISE('请输入真实姓名（只支持中文）');
                let result = await Req({
                    url: '/api/pay/recharge.htm',
                    type: 'POST',
                    data: {
                        action: 'checkName',
                        name: name,
                    },
                    animate: true
                });
                this.payFirst = result.payFirst;
                resolve({msg:result.message,first:result.payFirst});
            } catch (error) {
                reject(error);
            }
        })
    }
};

