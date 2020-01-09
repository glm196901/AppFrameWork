
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
            },
            name:{
                type:'input',
                title:'姓名',
                placeholder:'请输入姓名',
                value:'',
                style:'text',
                length:9
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
                placeholder: '单笔最低100元，最高20000元',
                value: '',
                style: 'number',
                float: false,
                min: 100,
                max: 20000,
                length: 5
            },
            name:{
                type:'input',
                title:'姓名',
                placeholder:'请输入姓名',
                value:'',
                style:'text',
                length:9
            }
        },
        des: [
            '◆申请金额与转账金额必须一致，否则无法到账。',
            '◆第三方收款账户不定期更新，充值前需获取最新收款信息。'
        ]
    }
}