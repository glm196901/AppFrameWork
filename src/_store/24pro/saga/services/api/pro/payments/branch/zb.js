import {EVENT} from "../../event";

export default {
    '/rechargeXXPayCPBank':{
        title: '银行卡支付',
        bank: true,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '入金金额',
                placeholder: '单笔限额100-20000元',
                value: '',
                style: 'number',
                min: 528,
                max: 5125,
                length: 5,
                store:['528', '998', '1998', '2978', '3978', '5128',],
                id:'',
            },
            channel: {
                type: 'fixed',
                value: 'ALIPAY_WAP' 
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },

    '/rechargeXXPayBY': {
        title: '支付宝',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'select',
                title: '入金金额',
                placeholder: '单笔限额500-10000元',
                value: '',
                style: 'number',
                min: 500,
                max: 10000,
                length: 5,
                store:['297', '499', '785', '998', '1588', '1999','2466','2999','3480','3998','4588','4999'],
                id:'    ',
            },
            channel: {
                type: 'fixed',
                value: 'ALIPAY_WAP' 
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPay': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '入金金额',
                placeholder: '单笔限额100-20000元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 20000,
                length: 5,
                store:[199,499,999,1999,2999,4999,9999,19999]
            },
            channel:{
                type:'fixed',
                value:'ALIPAY_WAP'
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    }, 
    '/rechargeXXPayWZPay': {
        title: '微众扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔最低100元，最高4999元',
                value: '',
                style: 'number',
                float: true,
                nonzero: true,
                min: 100,
                max: 4999,
                length: 5,
            },
            callbackUrl: {
                type: 'fixed',
                value: 'origin'
            },
        },
        des: [
            '◆充值必须含有小数，否则无法充值，例如101.1。',
            '◆申请金额与转账金额必须一致，否则无法到账。'
        ]
    },  
    '/rechargeXXPayCP': {
        title: '支付宝转卡',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '入金金额',
                placeholder: '单笔限额300-20000元',
                value: '',
                style: 'number',
                min: 300,
                max: 20000,
                length: 5,
                store:['399', '999', '1999', '5999', '9999', '19999']
            },
            bank: {
                type: 'fixed',
                value: 'alipay'
            },
            channel: {
                type: 'fixed',
                value: 'ALIPAY_WAP'
            },
        },
        des: [
            '◆仅支持以下相关银行App充值：',
            '银联云闪付、工行、农行、建行、招行、中信、兴业、浦发、中国银行等手机银行；',
            '◆二维码仅可使用一次，再次充值需要重新获取二维码，重复扫码付款造成的资金损失，由客户自行承担！',
        ]
    },       




}