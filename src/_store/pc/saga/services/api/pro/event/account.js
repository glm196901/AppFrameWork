import { Req } from "../network/Req";
import { exposure } from "../../core/store";
import { TEST } from "../../lib/data/test";
import ERROR from './error';
import { EVENT } from "./index";
import { Storage } from "../../lib/utils";
import { STORE } from "../../core/store/state";
import { collectInfo } from "../../core/native/native";
import { PAYMENT } from "../payments";

const _Account = {
    name: 'Account',
    initial: false,
    isLogin: false,
    _loop: null,
    mobile: '',
    /**
     *用户基本信息
     */
    basicUserData: {
        username: '游客',
        id: null,
        money: 0,
        game: 0,
        eagle: 0,
        eagleRatio: 10,
        hello: null,
        unread: null,
        registerTime: null
    },
    getBasicUserData() {
        return this.basicUserData;
    },
    /**
     *用户金融信息
     */
    financeUserData: {
        bankCardCount: 0,
        name: null,
        mobile: null,
        identityNumber: null,
        identityNumberValid: null,
        withdrawPw: null,
        level: null
    },
    getFinanceUserData() {
        return this.financeUserData;
    },
    tradeQuick: null,
    message: '',
    /**
     *银行卡列表
     */
    allBankCardList: [],
    getAllBankCardList(antDesign = false) {
        return this.allBankCardList;
    },
    /**
     *充值提款记录
     */
    transferRecordList: [],
    /**
     * 交易明细记录
     */
    transactionRecordList: [],
    /**
     * 推广佣金记录列表
     */
    commissionRecordList: [],
    /**
     * 积分明细列表
     */
    eagleRecordList: [],
    /**
     * 资金明细详细信息
     */
    fundDetailData: null,
    /**充值记录 */
    rechargeRecord: [],
    /**
     * 返回充值记录
     */
    getRechargeRecord() {
        return this.rechargeRecord;
    },
    /**提款记录 */
    withdrawRecord: [],
    /**
     * 返回提款记录
     */
    getWithdrawRecord() {
        return this.withdrawRecord;
    },
    /**
     * 推广信息
     */
    union: {
        unionTotal: 0,
        commRatio: 0,
        userCount: 0,
        userConsume: 0,
        visitCount: 0,
        unionVolume: 0,
        linkAddress: ''
    },
    getUnion() {
        return this.union;
    },
    validPhone: null,
    userList: [],
    /**
     * 获取用户列表
     */
    getUserList() {
        return this.userList;
    },
    /**签到历史对象 */
    checkInHistory: {
        award: [], status: [], count: 0
    },
    /**签到成功后更新的积分*/
    checkEagle: '',
    /**返回历史对象 */
    getCheckInHistory() {
        return this.checkInHistory;
    },
    /**我的交易 需要的数据 */
    heroObj: {
        best: null,
        historyList: [],
        invest: null
    },

    /**
     * 新手任务
     */
    newMissionList: [],
    newMissionType: '',

    /**返回我的交易 需要的数据 */
    getHero() {
        return this.heroObj;
    },
    async init() {
        try {
            const isLogin = Storage.getItem('isLogin');
            if (isLogin !== 'true')
                throw '';
            let result = await Req({
                url: '/api/user/isLogin',
                type: 'POST'
            });
            if (result.isLogin) {
                this.mobile = Storage.getItem('mobile');
                this.isLogin = true;
                await this._keepUpdate(true);
            } else {
                Storage.removeItem('isLogin');
                Storage.removeItem('mobile')
            }
        } catch (e) {

        } finally {
            this.initial = true;
            exposure('cacheInitial')
        }
    },
    /**
     * @description 持续更新用户数据
     * @param {boolean} [update]
     * @param {function} [callback]
     * @returns {Promise<void>}
     * @private
     */
    async _keepUpdate(update = false, callback) {
        try {
            const { user } = await Req({
                url: '/api/user/detail',
                type: 'GET',
                timeout: 10
            });
            this.tradeQuick = user.tradeQuick;
            EVENT.Trade._insertTradeInfo(this.tradeQuick);
            this.insertBasicUserInfo(user);
            this.insertFinanceUserInfo(user);
        } catch (err) {

        } finally {
            if (window.isSuperman) {
                collectInfo(this.getFinanceUserData())
            }
            exposure('getUserInfo');
            EVENT.Trade._backdoorForUser(this.basicUserData);
            if (update) {
                if (callback) callback();
                this._loop = setTimeout(() => this._keepUpdate(true), 8000)
            }
        }
    },
    _clearCache() {
        this.basicUserData = {
            username: '游客',
            id: null,
            money: 0,
            game: 0,
            eagle: 0,
            eagleRatio: 10,
            hello: null,
            unread: null,
            registerTime: null
        };
        this.financeUserData = {
            bankCardCount: 0,
            name: null,
            mobile: null,
            identityNumber: null,
            identityNumberValid: null,
            withdrawPw: null,
            level: null
        };
        this.tradeQuick = null;
        this.message = '';
    },
    setLogout() {
        this.isLogin = false;
        PAYMENT.payFirst = 0;
        PAYMENT.list = [];
        this._clearCache();
        Storage.removeItem('isLogin');
        clearTimeout(this._loop);
        Req({
            url: '/api/sso/user_logout',
            type: 'POST'
        }).then(() => {

        }).catch(() => {

        });
        exposure('loginCallback')
    },

    getDetail() {
        return Req({
            url: '/api/user/detail',
            type: 'GET',
            timeout: 10
        }).then(({ user }) => {
            this.insertBasicUserInfo(user);
            this.insertFinanceUserInfo(user);
            EVENT.Trade._backdoorForUser(this.basicUserData);
            exposure('getBasicUserInfo');
            exposure('getFinanceUserInfo');
        }).catch((err) => {
            console.warn(err)
        })
    },
    /**
     * 获取用户基础信息
     * @descriptions
     */
    getBasicUserInfo() {
        this.getDetail();
    },
    /**
     * 获取用户资产信息
     * @description
     */
    getFinanceUserInfo() {
        this.getDetail();
    },
    insertBasicUserInfo(attr) {
        for (let [key] of Object.entries(this.basicUserData)) {
            this.basicUserData[key] = attr[key];
        }
    },
    insertFinanceUserInfo(attr) {
        for (let [key] of Object.entries(this.financeUserData)) {
            this.financeUserData[key] = attr[key]
        }
    },
    /**
     * 添加模拟余额接口
     */
    addSimulateBalance() {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Req({
                    url: '/api/trade/addScore.htm',
                    animate: true
                });
                EVENT.Account.getBasicUserInfo();
                this.message = result.resultMsg;
                resolve()
            } catch (error) {
                reject(error);
            }
        })
    },
    submit(mobile = '', password = '', test = true) {
        return new Promise((resolve, reject) => {
            if (test) {
                if (password.length === 0) {
                    return ERROR.PROMISE('请输入密码');
                }
                if (!TEST.PHONE.test(mobile)) return reject('手机号码格式错误');
                if (!TEST.PASSWORD.test(password)) return reject('密码格式错误');
            }
            this.mobile = mobile;
            Req({
                url: '/api/sso/user_login_check',
                type: 'POST',
                data: {
                    mobile: mobile,
                    password: password
                },
                animate: true
            }).then(({ user }) => {
                if (user !== undefined) {
                    this.basicUserData.id = user.userId;
                    this.tradeQuick = user.tradeQuick;
                    EVENT.Trade._insertTradeInfo(this.tradeQuick);
                }
                resolve();
            }).catch((err) => {
                reject(err);
            })
        })
    },
    async callback() {
        try {
            Storage.setItem('isLogin', 'true');
            Storage.setItem('mobile', this.mobile);
            this.isLogin = true;
            await this._keepUpdate(true);
        } catch (err) {

        } finally {
            exposure('loginCallback');
        }
    },
    addBankCard(bankType, province, city, cardNumber, cfmCardNumber, subbranch) {
        if (bankType.length === 0 || bankType === '请选择银行') return ERROR.PROMISE('请选择开户银行')//return AlertFunction({title:'警告', msg:'请选择开户银行'});
        if (province === '请选择开户省份') return ERROR.PROMISE('请选择开户省份')//AlertFunction({title:'警告', msg:'请选择开户省份'});
        if (city === '请选择开户城市') return ERROR.PROMISE('请选择开户城市')//AlertFunction({title:'警告', msg:'请选择开户城市'});
        if (subbranch.length === 0) return ERROR.PROMISE('请输入开户支行');
        if (!/^[\u4e00-\u9fa5_a-zA-Z]{0,}$/.test(subbranch) || subbranch.length === 0) return ERROR.PROMISE('开户支行信息输入格式错误，请重新输入')//AlertFunction({title: '警告', msg: '开户支行信息格式错误，请重新输入'});
        if (!/^[^\x00-\xff]{0,}$/.test(subbranch) || subbranch.length === 0) return ERROR.PROMISE('开户支行只支持中文')
        if (cardNumber.length === 0 || cardNumber.length < 16) return ERROR.PROMISE('银行卡格式不正确')// AlertFunction({title:'警告', msg:'银行卡格式不正确'});
        if (cfmCardNumber.length === 0 || cfmCardNumber.length < 16) return ERROR.PROMISE('银行卡格式不正确')// AlertFunction({title:'警告', msg:'银行卡格式不正确'});
        if (!/^[\u4e00-\u9fa5_a-zA-Z]{0,}$/.test(subbranch) || subbranch.length === 0) return ERROR.PROMISE('银行卡格式不正确')//AlertFunction({title: '警告', msg: '开户支行信息格式错误，请重新输入'});
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
                this.message = result.errorMsg;
                this.getDetail();
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
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    getRecord(type, beginId, page = 1) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = {
                    action: 'more',
                    type: type,
                };

                if (!!beginId) {
                    if (beginId === 'pc') {
                        data.action = 'pc';
                        data.page = page;
                    } else {
                        data.beginId = beginId
                    }
                }

                let result = await Req({
                    url: '/api/mine/funds.htm',
                    type: 'GET',
                    data: data
                });

                /**新旧接口兼容 */
                result.data.forEach((item) => {
                    const time = item.createTime || item.time
                    item.time = item.createTime = time
                })
                /** */

                if (type === 1) {
                    this.transferRecordList = result.data;
                } else if (type === 2) {
                    this.transactionRecordList = result.data;
                } else if (type === 3) {
                    this.commissionRecordList = result.data;
                } else if (type === 4) {
                    this.eagleRecordList = result.data;
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },

    getRecordDetail(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/fundDetail.htm',
                    type: 'GET',
                    data: {
                        id: id
                    }
                });

                const time = result.fundDetail.createTime
                    || (result.fundDetail.time && result.fundDetail.time.time)

                this.fundDetailData = {
                    money: result.fundDetail.money,
                    assetMoney: result.fundDetail.assetMoney,
                    type: result.fundDetail.type,
                    date: time,
                    desc: result.fundDetail.detail,
                    explain: result.fundDetail.explain
                }
                resolve()
            } catch (error) {
                reject(error)
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
                this.message = result.errorMsg;
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    nameVerification(name, idNumber) {
        if (!/^[\u4e00-\u9fa5]+$|^[\u4e00-\u9fa5]+·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*·?[\u4e00-\u9fa5]*[\u4e00-\u9fa5]+$/.test(name)) return ERROR.PROMISE('请输入真实姓名（只支持中文）');// AlertFunction({title:'警告',msg:'请输入真实姓名'});
        if (name.length === 0) return ERROR.PROMISE('请输入真实姓名');// AlertFunction({title:'警告',msg:'请输入真实姓名'});
        if (idNumber.length === 0) return ERROR.PROMISE('请输入身份证号')//AlertFunction({title:'警告',msg:'请输入身份证号'});
        if (idNumber.length !== 18) return ERROR.PROMISE('请输入正确身份证号')//AlertFunction({title:'警告',msg:'请输入正确身份证号'});

        return new Promise(async (resolve, reject) => {
            try {

                await Req({
                    url: '/api/mine/profileAuth.htm',
                    type: "POST",
                    data: {
                        action: 'authIdentity',
                        name: name,
                        identityNumber: idNumber
                    },
                    animate: true
                });
                this.message = '实名认证成功';
                await this.getDetail();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
    validWithdraw() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/pay/withdraw.htm',
                    animate: true
                });

                if (result.identityAuth === false) {
                    reject({ msg: '您当前还未实名认证，为保障您的账户安全，请先实名认证', goKey: 'realNameVerification' });
                }

                if (result.bankCards && result.bankCards.length === 0) {
                    reject({ msg: '您当前还未添加出金银行卡，请先添加银行卡', goKey: 'bankCardList' });
                }

                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },

    withdrawMoney(money, cardId, password) {

        if (money.length === 0) return ERROR.PROMISE('请输入提款金额');
        if (password.length === 0) return ERROR.PROMISE('请输入资金密码');
        if (!TEST.PASSWORD.test(password)) return ERROR.PROMISE('密码格式不正确(密码由6-16位字母+数字组成,不能纯数字)', 2);

        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/pay/withdraw.htm',
                    type: 'POST',
                    data: {
                        type: 0,
                        action: 'apply',
                        money: money,
                        bankCard: cardId,
                        password: password
                    },
                    animate: true
                });
                this.message = result.resultMsg || result.errorMsg;
                this.getDetail()
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },


    /**
     * 获取推广详情
     */
    updatePromotionInfo() {
        return new Promise(async (resolve, reject) => {
            try {

                let result = await Req({
                    url: '/api/mine/union.htm',
                    type: 'GET'
                });

                let info = result.union;
                this.union.unionTotal = result.unionTotal;
                this.union.commRatio = info.commRatio * 100;
                this.union.userCount = info.userCount;
                this.union.userConsume = info.userConsume;
                this.union.visitCount = info.visitCount;
                this.union.unionVolume = result.unionVolume;
                this.union.linkAddress = `${window.location.origin}/?ru=${info.userId}`;
                resolve(result);
            } catch (error) {
                console.log('TCL: }catch -> error', error);
                reject(error);
            }
        });
    },
    /**
     * 获取推广详情数据
     */
    updateUserList() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/mine/unionUser.htm',
                    type: 'GET',
                    animate: true
                });
                this.userList = result.users;
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },
    /**获取签到历史接口 */
    updateCheckInStatus() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/user/checkin/history.htm',
                });

                const { pointsArray, pointsStatus } = result.data;
                const award = pointsArray.split(',');
                const status = pointsStatus.split(',');
                let count = 0;
                for (let o of status) {
                    if (o === '1') {
                        count++;
                    }
                }

                this.checkInHistory.award = award;
                this.checkInHistory.status = status;
                this.checkInHistory.count = count;
                exposure('updateCheckInStatus');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },
    /**签到接口 */
    checkIn() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/user/checkin/pound.htm',
                    animate: true
                });
                this.checkEagle = result.asset.eagle;
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },

    /**fk里我的交易获取数据的接口
     * ps:别问我为啥取这个名字因为我不知要怎么命名，我只是跟着旧项目的名字而已 */
    updateHeroList() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: `/api/hero/${this.basicUserData.id}.htm`,
                    type: 'GET',
                    animate: true
                });
                this.heroObj.best = result.nbBetting;
                this.heroObj.historyList = result.historyList;
                this.heroObj.invest = result.invest;

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },

    /**提款记录接口 */
    updateWithdrawRecord() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/pay/withdrawHistory.htm',
                    type: 'GET'
                });
                this.withdrawRecord = result.inouts;
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    },


    /**新手任务获取活动 */
    newMissionLists() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/activity/task.htm',
                    type: 'GET',
                    animate: true,
                    data: {
                        category: 2
                    }
                });
                this.newMissionList = result.data;
                resolve();
            } catch (err) {
                reject(err)
            }
        })
    },

    /**充值记录接口 */
    updateRechargeRecord() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/pay/rechargeHistory.htm',
                    type: 'GET'
                });
                this.rechargeRecord = result.inouts;
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },

    /**新手任务 领取 接口 */
    newMission(id, type) {
        return new Promise(async (resolve, reject) => {
            try {
                await Req({
                    url: '/api/activity/take.htm',
                    type: 'POST',
                    data: {
                        userActivityId: id,
                    },
                    animate: true,
                });
                this.newMissionType = type;
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    },

    signEveryDay() {
        return new Promise(async (resolve, reject) => {
            try {
                await Req({
                    url: '/api/user/checkin/pound.htm',
                    animate: true,
                });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
};

export default STORE.empower(_Account, 'initial', STORE.STATE.ACCOUNT)
