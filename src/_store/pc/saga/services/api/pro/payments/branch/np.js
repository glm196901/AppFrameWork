import {EVENT} from "../../event";

export default {
    '/rechargeXXPayDpBank':{
        bank:true,
        param:{}
    },
    '/rechargeXXPayAlipayBank':{
        title: '支付宝转账银行卡',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            aliName: {
                type: 'read_input',
                title: '支付宝姓名',
                // value: EVENT.Account.financeUserData.name || '',
                placeholder:'请输入支付宝姓名',
                // valid:EVENT.Account.financeUserData.identityNumberValid,
                aliName:true
            },
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔限额100-50000元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 50000,
                length: 5,
            },
            note:{
                type:'rewrite',
                value:''
            },
            bank:{
                type:'fixed',
                value:'支付宝'
            },
            cardNumber:{
                type:'fixed',
                value:0
            }
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆需保持系统姓名与支付宝姓名一致，否则充值无法自动到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayHuYun_ALI': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '充值金额',
                placeholder: '单笔限额100-10000元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 10000,
                length: 5,
                store:['199','999','1999','3999','5999','9999']
            },
            note:{
                type:'fixed',
                value:EVENT.Account.financeUserData.name
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPay': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔限额100-10000元',
                value: '',
                style: 'number',
                min: 100,
                max: 10000,
                float: false,
                length: 5,
                store:[199,499,999,1999,2999,4999,9999]
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayJLWeChat': {
        title: '微信扫码',
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
                length: 5,
            },
            mobile:{
                type:'fixed',
                value:EVENT.Account.getBasicUserData().mobile
            },
            subChannel:{
                type:'fixed',
                value:'wechat'
            }
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayJLAlipay': {
        title: '支付宝转账',
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
                length: 5,
            },
            mobile:{
                type:'fixed',
                value:EVENT.Account.getBasicUserData().mobile
            },
            subChannel:{
                type:'fixed',
                value:'alipay'
            }
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayWZPay0': {
        title: '微众扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔最低100元，最高3000元',
                value: '',
                style: 'number',
                float: true,
                nonzero: true,
                min: 100,
                max: 3000,
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
    '/rechargeXXPayWZPay': {
        title: '微众扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔最低100元，最高1000元',
                value: '',
                style: 'number',
                float: true,
                nonzero: true,
                min: 200,
                max: 40000,
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
    '/rechargeXXPayALIRED': {
        title: '支付宝红包',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔限额100-10000元',
                value: '',
                style: 'number',
                min: 100,
                max: 10000,
                length: 5,
                float: false,
                store:['199', '999', '1999', '3999', '5999', '9999']
            },
            device: {
                type: 'fixed',
                value: 'wap'
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayWXQR': {
        title: '支付宝扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔限额100-1000元',
                value: '',
                style: 'number',
                min: 100,
                max: 1000,
                length: 5,
                float: true,
                nonzero:true,
                store:['199.1', '299.1','399.1','499.1', '599.1', '799.1', '899.1', '999.1']
            },
            channel: {
                type: 'fixed',
                value: 'ALIPAY_WAP'
            },
        },
        des: [
            '◆充值必须含有小数，否则无法充值，例如100.1。',
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆二维码仅可使用一次，每次充值需重新申请获取二维码，重复扫码付款造成的资金损失将自行承担。'
        ]
    },
    '/rechargeXXPayCPBank': {
        title: '银行转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '入金金额',
                placeholder: '单笔限额100-20000元',
                value: '',
                style: 'number',
                min: 100,
                max: 20000,
                float: false,
                length: 5,
                store:['399', '599', '999', '1999', '2999', '4999','9999','19999']
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPaySpay':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔限额100-10000元',
                value: '',
                style: 'number',
                min: 100,
                max: 10000,
                length: 5,
                float: false,
                store:['199', '499', '999', '1999', '2999', '4999', '9999']
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
    '/rechargeXXPayFlashPay': {
        title: '银联扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'select',
                title: '入金金额',
                placeholder: '单笔限额100-50000元',
                value: '',
                style: 'number',
                min: 100,
                max: 50000,
                float: false,
                length: 5,
                store:['100', '300','500', '1000', '2000', '3000', '5000', '10000', '20000', '30000','40000', '50000']
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
    '/rechargeXXPayHuYun_CLOUD': {
        title: '银行转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔限额100-5000元',
                value: '',
                style: 'number',
                min: 100,
                max: 5000,
                float: false,
                length: 5,
                store:['199', '399', '999', '1999', '3999', '4999']
            },
            subChannel: {
                type: 'fixed',
                value: 'ysf'
            },
            device: {
                type: 'fixed',
                value: 'wap'
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayCP': {
        title: '支付宝转银行卡',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔限额300-20000元',
                value: '',
                style: 'number',
                float: false,
                min: 300,
                max: 20000,
                length: 5,
                store:['399', '999', '1999', '5999', '9999', '19999']
            },
            bank: {
                type: 'fixed',
                value: 'alipay'
            },
            // channel: {
            //     type: 'fixed',
            //     value: 'ALIPAY_WAP'
            // },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayDora': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔限额100-5000元',
                value: '',
                style: 'number',
                min: 100,
                max: 5000,
                float: false,
                length: 5,
                store:['100', '200', '300', '500', '800', '999', '1999', '2999', '4999']
            },
            name:{
                type: 'input',
                title: '支付宝姓名',
                placeholder: '请输入付款支付宝姓名',
                value: '',
                style:'text'
            },
            card_no: {
                type: 'input',
                title: '支付宝账号',
                placeholder: '请输入支付宝账号',
                value: '',
                style:'text'
            },
        },
        des: [
            '◆支付宝信息和平台注册信息必须一致，否则无法到账。',
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayHFT': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔100元-5000元',
                value: '',
                style: 'number',
                min: 100,
                max: 5000,
                float: false,
                length: 5,
                store:['199', '499', '999', '1999', '2999', '4999']
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayFFPALIPAY':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔最低200元，最高5000元',
                value: '',
                style: 'number',
                min: 200,
                max: 5000,
                float: false,
                length: 5,
                // store:['199', '499', '999', '1999', '2999', '4999']
            },
            subChannel:{
                type: 'fixed',
                value: 'ALIPAY_WAP'
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayWechatPay':{
        title: '微信支付',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '最低100元，最高5000',
                value: '',
                style: 'number',
                float: true,
                nonzero: true,
                min: 100,
                max: 5000,
                length: 5,
                // store:['199', '499', '999', '1999', '2999', '4999']
            },
            callbackUrl: {
                type: 'fixed',
                value: 'origin'
            },
        },
        des: [
            '◆充值必须含有小数，否则无法充值，例如100.1。',
            '◆申请金额与实际转账金额必须一致，否则无法到账。'
        ]
    },
    '/rechargeXXPayQQ':{
        title: 'QQ钱包',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '充值金额',
                placeholder: '请输入金额',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 3000,
                length: 5,
                store:['100','300','500','800','999','1499','1999','2499','2999'],
            },
            channel: {
                type: 'fixed',
                value: 'ALIPAY_WAP'
            },
        },
        des: [
            '1.最低入金100元，最高3000元',
            '2.入金0手续费，实时到账',
            '3.24小时入金,单日总额无上限'
        ]
    },
    '/rechargeXXPayBaidu':{
        title: '百度钱包',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '入金金额',
                placeholder: '单笔限额100-3000元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 3000,
                length: 5,
                store:['100','300','500','800','999','1499','1999','2499','2999']
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
        ]
    },
    '/rechargeXXPayFFPQuick':{
        title: '银联快捷',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔最低100元，最高3000元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 3000,
                length: 5,
            },
            subChannel:{
                type: 'fixed',
                value: 'EXPRESS'
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'

        ]
    },
    '/rechargeXXPayQJF_ALI':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '充值金额',
                placeholder: '单笔限额100-10000元',
                value: '',
                style: 'number',
                min: 100,
                max: 10000,
                float: false,
                length: 5,
                store:['199', '999', '1999', '3999', '5999', '9999'],
            },
            subChannel: {
                type: 'fixed',
                value: '903'
            },
            device: {
                type: 'fixed',
                value: 'wap'
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayQJF_H5':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '充值金额',
                placeholder: '单笔限额100-10000元',
                value: '',
                style: 'number',
                min: 100,
                max: 10000,
                float: false,
                length: 5,
                store:['199', '999', '1999', '3999', '5999', '9999'],
            },
            subChannel: {
                type: 'fixed',
                value: '904'
            },
            device: {
                type: 'fixed',
                value: 'wap'
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayHuyun':{
        title: '银行扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input-select',
                title: '充值金额',
                placeholder: '单笔最低100元，最高5000元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 5000,
                length: 5,
                store:['199', '499', '999', '1999', '2999', '4999'],
            },
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },
    '/rechargeXXPayFFP':{
        title: '银联扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔最低100元，最高4500元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 4500,
                length: 5
            },

            subChannel:{
                type: 'fixed',
                value: 'UNIONPAY'
            },
            channelCode:{
                type: 'fixed',
                value:'FFPAY'
            },
            device:{
                type : 'fixed',
                value:'wap'
            }
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。',
        ]
    },

}