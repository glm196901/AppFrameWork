
export default {
    '/rechargeXXPay': {
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
        bank: true,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔最低100元，最高40000元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 40000,
                length: 5
            }
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
    '/rechargeXXPayFWBank': {
        title: '银行转账', //cbc
        bank: true,
        url: '/api/pay/rechargeXXPay.htm',
        param: {
            money: {
                type: 'input',
                title: '充值金额',
                placeholder: '单笔最低100元，最高40000元',
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
    '/rechargeXXPayCP': {
        title: '支付宝转银行卡', //cbc
        bank: true,
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
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    },
}