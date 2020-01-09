import {Req} from "../network/Req";
import {getPlatform} from "../../lib/utils";

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

export default {
    getList() {
        return Req({
            url: '/api/pay/recharge.htm',
            type: 'POST',
            data: {
                action: 'getPayList',
                switchType: 1,
                platform: getPlatform()
            },
            animate: true
        })
    },
    async updatePayment() {
        return new Promise((async (resolve, reject) => {
            try {
                if (this.isUpdated) return resolve();
                const {payList} = await this.getList();
				console.log("TCL: updatePayment -> payList", payList)
                payList.forEach(({url, name: des, description}) => {
                    let [name, key] = url.split('?');
					console.log("TCL: updatePayment -> [name, key]", [name, key])
                    if (this.config[name]) {
                        this.config[name].name = des;
                        this.config[name].subtitle = description;
                        key = key.split('&');
                        if (key.length > 0) {
                            key.forEach((e) => {
                                if (e) {
                                    const [m, n] = e.split('=');
                                    this.config[name].param[m] = {
                                        type: 'fixed',
                                        value: n
                                    }
                                }
                            })
                        }
                    }
                });
                this.isUpdated = true;
                resolve();
            } catch (err) {
                reject(err);/**/
            }
        }))
    },
    isUpdated: false,
    config: {
        '/rechargeXXPayHuyun': {
            title: '支付宝转账',
            bank: false,
            url: '/api/pay/rechargeXXPay.htm',
            param: {
                money: {
                    type: 'input',
                    title: '充值金额',
                    placeholder: '单笔最低100元，最高10000元',
                    value: '',
                    style: 'number',
                    float: false,
                    min: 100,
                    max: 10000,
                    length: 5
                }
            },
            des: [
                '◆申请金额与转账金额必须一致，否则无法到账。',
                '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
            ]
        },
        '/rechargeXXPayCP': {
            title: '支付宝转账', //cbc
            bank: false,
            url: '/api/pay/rechargeXXPay.htm',
            param: {
                money: {
                    type: 'input',
                    title: '充值金额',
                    placeholder: '单笔最低100元，最高20000元',
                    value: '',
                    style: 'number',
                    float: false,
                    min: 100,
                    max: 20000,
                    length: 5
                }
            },
            des: [
                '◆申请金额与转账金额必须一致，否则无法到账。',
                '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
            ]
        },
        '/rechargeXXPayCPBank': {
            title: '银行转账', //cbc
            bank: false,
            url: '/api/pay/rechargeXXPay.htm',
            param: {
                money: {
                    type: 'input',
                    title: '充值金额',
                    placeholder: '单笔最低100元，最高20000元',
                    value: '',
                    style: 'number',
                    float: false,
                    min: 100,
                    max: 20000,
                    length: 5
                }
            },
            des: [
                '◆申请金额与转账金额必须一致，否则无法到账。',
                '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
            ]
        }
    }
}