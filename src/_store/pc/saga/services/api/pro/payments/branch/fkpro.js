export default {
    '/rechargeXXPayDpBank':{
        bank:true,
        param:{},
        rechargeType:'bank',
    },
    '/rechargeXXPayAlipayBank':{
        title: '支付宝转账银行卡',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayHuYun_ALI': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPay': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayJLWeChat': {
        title: '微信扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType:'wePay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayJLAlipay': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayWZPay0': {
        title: '微众扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType:'wePay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayWZPay': {
        title: '微众扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType:'wePay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayALIRED': {
        title: '支付宝红包',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayWXQR': {
        title: '支付宝扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayCPBank': {
        title: '银行转账',
        bank: true,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'bank',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPaySpay':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayFlashPay': {
        title: '银联扫码',
        bank: true,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType:'bank',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayHuYun_CLOUD': {
        title: '银行转账',
        bank: true,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'bank',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayCP': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayDora': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayHFT': {
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayFFPALIPAY':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayWechatPay':{
        title: '微信支付',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType:'wePay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayQQ':{
        title: 'QQ钱包',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType:'wePay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayBaidu':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayFFPQuick':{
        title: '银联快捷',
        bank: true,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'bank',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayQJF_ALI':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayQJF_H5':{
        title: '支付宝转账',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayHuyun':{
        title: '银行扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayFFP':{
        title: '银联扫码',
        bank: false,
        url: '/api/pay/rechargeXXPay.htm',
        rechargeType: 'aliPay',
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
        range:[100,200,300,500,800,999,1999,2999,5999],
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
}