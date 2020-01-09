import { Req } from "../network/Req";
import { EVENT } from ".";
import ERROR from './error';


export default {

    allBankCardList:[], //已绑定银行卡列表
    getAllBankCardList(antDesign = false) {
        return this.allBankCardList;
    },
    message:'',
    setDefaultBankCard(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/bankCardUpdate.htm',
                    type: 'POST',
                    data: {
                        action: 'setDefault',
                        id: id
                    },
                    animate: true
                });
                this.message = result.message;
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    deleteBankCard(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/bankCardUpdate.htm',
                    type: 'POST',
                    data: {
                        action: 'del',
                        id: id
                    },
                    animate: true
                });
                this.message = result.message;
                await EVENT.Account.getDetail();
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    addBankCard(bankType, province, city, cardNumber, cfmCardNumber, subbranch) {
        if (bankType.length === 0 || bankType === '请选择银行') return ERROR.PROMISE('请选择开户银行')//return AlertFunction({title:'警告', msg:'请选择开户银行'});
        if (province === '请选择开户省份') return ERROR.PROMISE('请选择开户省份')//AlertFunction({title:'警告', msg:'请选择开户省份'});
        if (city === '请选择开户城市') return ERROR.PROMISE('请选择开户城市')//AlertFunction({title:'警告', msg:'请选择开户城市'});
        if (cardNumber.length === 0 || cardNumber.length < 16) return ERROR.PROMISE('银行卡格式不正确')// AlertFunction({title:'警告', msg:'银行卡格式不正确'});
        if (cfmCardNumber.length === 0 || cfmCardNumber.length < 16) return ERROR.PROMISE('银行卡格式不正确')// AlertFunction({title:'警告', msg:'银行卡格式不正确'});
        if (subbranch.length === 0) return ERROR.PROMISE('请输入开户支行');
        if (!/^[\u4e00-\u9fa5_a-zA-Z]{0,}$/.test(subbranch) ) return ERROR.PROMISE('开户支行信息输入格式错误，请重新输入')//AlertFunction({title: '警告', msg: '开户支行信息格式错误，请重新输入'});
        if (!/^[^\x00-\xff]{0,}$/.test(subbranch)) return ERROR.PROMISE('开户支行只支持中文')
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/bankCardAdd.htm',
                    type: 'POST',
                    data: {
                        action: 'add',
                        bank: bankType,
                        province: province,
                        city: city,
                        subbranch: subbranch,
                        cardNumber: cardNumber.replace(/\s+/g, ""),
                        cardNumberCfm: cfmCardNumber.replace(/\s+/g, ""),
                    },
                    animate: true
                });
                this.message = result.message;
                await EVENT.Account.getDetail();
                resolve();
            } catch (error) {
                reject(error)
            }
        })
    },
    getAllBankCard() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/bankCard.htm',
                    type: 'GET'
                });
                this.allBankCardList = result.bankCards;
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    changeBankInfo(province, city, subbranch, id) {
        if (!/^[^\x00-\xff]{0,}$/.test(subbranch) || subbranch.length === 0) return ERROR.PROMISE('开户支行只支持中文')
        return new Promise(async (resolve, reject) => {
            try {

                if (subbranch.length === 0) return ERROR.PROMISE('请输入开户支行信息');//AlertFunction({title: '警告', msg: '请输入开户支行信息'});
                if (!/^[\u4e00-\u9fa5_a-zA-Z]{0,}$/.test(subbranch)) return ERROR.PROMISE('开户支行信息输入格式错误，请重新输入');//AlertFunction({title: '警告', msg: '开户支行信息输入格式错误，请重新输入'});        

                let result = await Req({
                    url: '/api/mine/bankCardUpdate.htm',
                    type: 'POST',
                    data: {
                        action: 'update',
                        province: province,
                        city: city,
                        subbranch: subbranch,
                        id: id
                    },
                    animate: true
                });
                this.message = result.message;
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
}