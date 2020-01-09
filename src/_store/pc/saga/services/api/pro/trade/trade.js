import {getIdentity, getPlatform} from "../../lib/utils";
import {Req} from "../network/Req";
import {RULE} from "../rule";
import Account from "../event/account";
import {config} from "../event/trade";

export let tidesForTrade = null;

function bridgeForTrade(wakeUp) {
    tidesForTrade = wakeUp
}

export let tidesForTradeUpdate = null;

function bridgeForTradeUpdate(update) {
    tidesForTradeUpdate = update
}

/**
 * @constructor
 * 交易模型
 */
export class Trade {
    origin = {};

    priceOriginal = 1;
    priceChange = 0;
    priceUnit = 0;

    /**
     * 买涨价格
     * @type {number}
     */
    buyPrice = 0;
    /**
     * 买跌价格
     * @type {number}
     */
    sellPrice = 0;

    rateList = [1, 0.1, 0.01];
    rateName = ['元', '角', '分'];
    rate = 1;
    moneyType = 0;
    moneyTypeList = [];

    charge = 0;
    chargeList = [];
    chargeSpec = false;
    /**
     * 我可能是原始的手续费
     * @type {number}
     */
    chargeOriginal = 0;

    /**
     * 折扣类型 1.现金折扣  2.比例折扣
     * @type {number}
     */
    discountType =  0;
    /**
     * 折扣金额
     * @type {number}
     */
    discountVal = 0;
    /**
     * 实际折扣金额
     * @type {number}
     */
    discountAmount = 0;

    select = 0;

    /**
     * 保证金
     * @type {number}
     */
    deposit = 0;
    depositList = [];

    stopLoss = 0;
    stopLossList = [];

    stopProfit = 0;
    stopProfitList = [];

    volumeIndex = 0;
    volume = 1;
    volumeList = [];

    simulate = false;
    isBuy = false;

    /**
     * 积分相关
     */
    useEagle = false;
    usableEagle = true;
    deductMoney = 0;
    deductEagle = 0;
    deductCharge = 0;


    /**
     * 股票外汇相关
     * @type {number}
     */
    priceRate = 0;//单点波动倍率 or 单点盈亏倍率
    priceRateList = [];//档位

    /**
     * 股票相关
     */
    shares = 0;//股数
    deferAble = false;//是否可以递延
    defer = false;//是否递延
    deferType = 1;//递延费类型
    deferFee = 0;//递延费
    deferBase = 0;//基础递延费
    utilRate = 100;//资金利用率

    orderType = 0; //0 市价 ，1 挂单
    orderPrice = 0;//挂单价格
    orderStep = 0;//挂单价格增加步数


    userInfo = {
        money: 0,
        game: 0,
        eagle: 0,
        eagleRatio: 10,
        eagleMax: 1,
        partDeduct: false,
        useExg: false
    };

    /**
     * 保留区
     */
    closeTime = '00:00:00';

    /**
     * 跟单ID
     * @type {null}
     */
    followId = null;

    _callback = null;

    /**
     * 是否开启数字货币模式
     * @type {boolean}
     * @private
     */
    _coinMode = false;
    /**
     * 数字货币手续费模式
     * @type {number}
     * @private
     */
    _coinFormula = 0;
    /**
     * 数字货币手续费计算因子X
     * @type {number}
     * @private
     */
    _coinFormulaX = 0;

    /**
     * 杠杆倍数
     * @type {number}
     * @private
     */
    _lever = 1;

    _price = 0;//当前价格

    _config = {
        simulate: false,
        isBuy: false
    };

    constructor(origin, userInfo, options) {
        Object.assign(this._config, options);
        this.origin = origin;
        this.id = origin.id;
        this.type = origin.type;
        this.code = origin.code;
        if (origin.crypto !== undefined) {
            this.des = origin.des;
            this.crypto = origin.crypto;
        }
        this.name = origin.name;

        this.simulate = this._config.simulate;
        this.isBuy = this._config.isBuy;

        if (origin.moneyTypeList.length > 0) {
            for (let i = 0; i < origin.moneyTypeList.length; i++) {
                this.moneyTypeList.push(i)
            }
        } else {
            this.moneyTypeList.push(0)
        }
        const l = this.moneyTypeList.length;
        if (l > 1) {
            this.rateName = this.rateName.slice(0, l)
        } else {
            this.rateName = ['元']
        }
        this.priceChange = origin.priceChange;
        this.priceUnit = origin.priceUnit;
        this.priceOriginal = origin.priceOriginal;

        /**
         * 配置手续费折扣
         * @type {number|*}
         */
        this.discountType = origin.discountType;
        this.discountVal = origin.discountVal;

        /**
         * 有人跟我说保证金列表有可能是空的
         */
        if (origin.depositList && origin.depositList.length !== 0) {
            this.depositList = origin.depositList;
            this.deposit = this.depositList[0];
        } else {
            this.depositList = origin.stopLossList;
            this.deposit = Math.abs(this.depositList[0]);
        }


        this.stopLossList = origin.stopLossList;
        this.stopLoss = this.stopLossList[0];

        this.stopProfitList = origin.stopProfitList;
        this.stopProfit = this.stopProfitList[0];

        this.volumeList = origin.volumeList;
        this.volume = this.volumeList[0];

        this.closeTime = origin.closeTime;


        /**
         * 进行股票交易的处理
         */
        if (origin.defer) {
            this.deferAble = true;
            this.deferBase = origin.deferFee;
            this.deferType = origin.deferType;
        }

        /**
         * 期货可能有,股票一定有...
         */
        if (origin.priceRateList !== undefined && origin.priceRateList.length > 0) {
            this.priceRateList = origin.priceRateList;
            this.priceRate = this.priceRateList[0];
        }

        for (let o of Object.keys(userInfo)) {
            this.userInfo[o] = userInfo[o]
        }
        this._modeReset(origin);

        bridgeForTrade(this._wakeUp.bind(this));
        bridgeForTradeUpdate(this._update.bind(this));

    }

    /**
     * 交易模式设置
     * @param origin
     * @private
     */
    _modeReset(origin) {
        this._coinMode = origin.coins;
        if (this._coinMode) {
            /**
             * 数字货币模式
             */
            this._coinFormula = Math.abs(origin.chargeCoinList[0]);
            this._coinFormulaX = origin.chargeCoinList[1].div(1000);
            const x = this.priceOriginal.mul(this.volume).mul(this.isBuy ? this.buyPrice : this.sellPrice).mul(origin.exgRate);
            if (this._coinFormula === 1) {
                this.charge = x.sub(Math.abs(this.stopLoss)).mul(this._coinFormulaX)
            } else if (this._coinFormula === 2) {
                this.charge = x.mul(this._coinFormulaX)
            }
            this._lever = x.div(Math.abs(this.stopLoss)).toFixed(2);
        } else {
            /**
             * 人民币模式
             */
            this.chargeList = origin.chargeUnitList;

            if (this.chargeList.length > 1) {
                this.chargeSpec = true;
                this.charge = this.chargeList[0];
            } else {
                this.charge = origin.chargeUnit;
                this.chargeOriginal = origin.chargeOriginal;
            }
        }
    }

    _wakeUp(data) {
        for (let o of Object.keys(data)) {
            this.userInfo[o] = data[o]
        }
        this._callback && this._callback();
    }

    _update(data) {
        if (data && data.code === this.code) {
            if (this.deferAble) {
                this._stockProcessShares(data);
            }
            this.buyPrice = data.wt_sell_price;
            this.sellPrice = data.wt_buy_price;
            this._price = data.price;
            this._callback && this._callback();

        }
    }

    /**
     * 实时计算购入股数
     * @param price
     * @private
     */
    _stockProcessShares({price}) {
        this.shares = this.volume.mul(10000).div(price);
        this.shares = Math.floor(this.shares.sub(this.shares % 100));
        this.utilRate = this.shares.mul(price).div(this.volume.mul(10000)).mul(100).toFixed(2);
    }

    /**
     * 实时计算递延费
     * @private
     */
    _stockProcessDefer() {
        if (this.defer) {
            if (this.deferType === 1) {
                this.deferFee = this.volume.mul(this.deferBase).mul(this.rate)
            } else if (this.deferType === 2) {
                this.deferFee = this.volume.mul(this.deferBase).mul(this.priceRate.div(100)).mul(this.rate)
            }
        }
    }

    /**
     * 汇率计算
     * @param val
     * @returns {*}
     * @private
     */
    _exgCalculate(val) {
        if (!config.digitalConvert) return val;
        if (!config.useExg && !this._coinMode) return val;
        if (val instanceof Array) {
            return val.map((e) => {
                let i = e.div(config.useCustomize ? config.exchange : this.origin.exgRate);
                return i.floatLength() > 2 ? Number(Number(i).toFixed(2)) : i;
            })
        } else {
            let i = val.div(config.useCustomize ? config.exchange : this.origin.exgRate);
            return i.floatLength() > 2 ? Number(Number(i).toFixed(2)) : i;
        }
    }

    whileUpdated(callback) {
        if (callback) this._callback = callback;
    }

    show() {
        const money = this.simulate ? this.userInfo.game : this.userInfo.money;
        const moneyName = this.simulate ? ['元'] : this.rateName;
        const moneyTypeList = this.simulate ? [0] : this.moneyTypeList;

        this.calculate();

        return {
            name: this.name,
            code: this.code,
            des: this.des,
            total: this.charge.add(this.deposit),
            bail: this._exgCalculate(this.deposit),
            simulate: this.simulate,
            select: this.select,
            stopLoss: this._exgCalculate(this.stopLoss),
            stopLossList: this._exgCalculate(this.stopLossList),
            stopProfit: this._exgCalculate(this.stopProfit),
            stopProfitList: this._exgCalculate(this.stopProfitList),
            volumeIndex: this.volumeIndex,
            volumeList: this.volumeList,
            volume: this.volume,
            moneyType: this.moneyType,
            rateName: this.rateName,
            closeTime: this.closeTime,
            /**
             * 是否使用积分抵扣
             */
            useEagle: this.useEagle,
            /**
             * 是否可用积分抵扣
             */
            usableEagle: this.usableEagle,
            /**
             * 当前积分
             */
            eagle: this.userInfo.eagle,
            /**
             * 最多抵扣多少金额
             */
            maxDeductMoney: this._exgCalculate(this.userInfo.eagle.div(this.userInfo.eagleRatio)),
            /**
             * 当前抵扣的金额
             */
            deductMoney: this._exgCalculate(this.deductMoney),
            /**
             * 当前消耗的积分
             */
            deductEagle: this.deductEagle,
            /**
             * 积分抵扣后剩余的手续费
             */
            deductCharge: Number(this._exgCalculate(this.deductCharge)).toFixed(2),
            /**
             * 原始的手续费
             */
            charge: Number(this._exgCalculate(this.charge)).toFixed(2),
            /**
             * 折扣金额
             */
            discount: Number(this._exgCalculate(this.discountAmount)).toFixed(2),
            /**
             * 每手数量
             */
            original: this.priceOriginal,
            /**
             * 杠杆比例
             */
            lever: this._lever,
            moneyTypeList,
            moneyName,
            money,
            orderType: this.orderType,
            orderPrice: this.orderPrice,
            orderStep: this.orderStep,
            /**
             * 是否可递延
             */
            deferAble: this.deferAble,
            /**
             * 是否开启递延
             */
            defer: this.defer,
            /**
             * 递延费
             */
            deferFee: this.deferFee,
            /**
             * 可购入股数
             */
            shares: this.shares,
            /**
             * 资金利用率
             */
            utilRate: this.utilRate

        }
    }

    swapDefer(status) {
        if (this.deferAble) {
            if (typeof status === 'boolean') {
                this.defer = status;
            }
            this.calculate();
        }
        return this.show();
    }

    swapSimulate(simulate = false) {
        this.simulate = simulate;
        this.moneyType = 0;
        this.rate = 1;
        this.useEagle = false;

        this.calculate();

        return this.show();

    }

    swapMoneyType(index) {
        if (this.simulate) return this.show();
        if (this.userInfo.useExg || this._coinMode) return this.show();

        const max = this.moneyTypeList.length - 1;
        if (index > max) index = max;
        this.moneyType = index;
        this.rate = this.rateList[index];

        this.calculate();

        return this.show()
    }

    swapVolume(index) {
        const max = this.volumeList.length - 1;
        if (index > max) index = max;
        index = Math.max(index, 0);

        this.volumeIndex = index;
        this.volume = this.volumeList[index];

        this.calculate();

        return this.show();
    }

    swapStopLoss(index) {
        const max = this.stopLossList.length - 1;
        if (index > max) index = max;
        index = Math.max(index, 0);

        this.select = index;

        this.calculate();

        return this.show()
    }

    swapEagle(state = false) {
        this.useEagle = state;
        return this.show();
    }

    calculate() {
        /**
         * 行吧你们赢了,空的就空的吧
         */
        if (this.origin.depositList.length !== 0) {
            /**
             * 计算保证金
             * @type {any[]}
             */
            this.depositList = this.origin.depositList.map((e) => e.mul(this.volume).mul(this.rate));
        } else {
            this.depositList = this.origin.stopLossList.map((e) => Math.abs(e.mul(this.volume).mul(this.rate)));
        }
        this.deposit = this.depositList[this.select];


        /**
         * 计算止盈
         * @type {any[]}
         */
        this.stopProfitList = this.origin.stopProfitList.map((e) => e.mul(this.volume).mul(this.rate));
        this.stopProfit = this.stopProfitList[this.select];
        /**
         * 计算止损
         * @type {any[]}
         */
        this.stopLossList = this.origin.stopLossList.map((e) => e.mul(this.volume).mul(this.rate));
        this.stopLoss = this.stopLossList[this.select];

        /**
         * 合并处理股票和单点盈亏有波动的情况
         */
        if (this.priceRateList.length > 0) {
            this.priceRate = this.priceRateList[this.select];
        }
        /**
         * 计算递延费
         */
        if (this.deferAble) {
            this._stockProcessDefer()
        }

        if (this._coinMode) {
            const x = this.priceOriginal.mul(this.volume).mul(this.isBuy ? this.buyPrice : this.sellPrice).mul(this.origin.exgRate);
            if (this._coinFormula === 1) {
                this.charge = x.sub(Math.abs(this.stopLoss)).mul(this._coinFormulaX)
            } else if (this._coinFormula === 2) {
                this.charge = x.mul(this._coinFormulaX)
            }
            this._lever = x.div(Math.abs(this.stopLoss)).toFixed(2);
        } else {
            if (this.chargeSpec) {
                this.chargeList = this.origin.chargeUnitList.map((e) => e.mul(this.volume).mul(this.rate));
                this.charge = this.chargeList[this.select]
            } else {
                this.chargeOriginal = this.origin.chargeOriginal.mul(this.volume).mul(this.rate);
                this.charge = this.origin.chargeUnit.mul(this.volume).mul(this.rate);
            }
        }

        /**
         * 折扣手续费计算
         */
        if(this.discountType === 1){
            this.discountAmount = this.discountVal;
        }else if(this.discountType === 2){
            this.discountAmount = this.charge.mul(Math.abs(this.discountVal.sub(1)));
        }

        if(this.discountType !== 0){
            this.charge -= this.discountAmount;
        }


        /**
         * 积分抵扣的计算
         */
        const available = this.userInfo.eagle.div(this.userInfo.eagleRatio);
        const max = this.charge.mul(this.userInfo.eagleMax);
        this.usableEagle = (available >= max || this.userInfo.partDeduct) && !this.simulate;
        this.usableEagle = available >= max || this.userInfo.partDeduct;

        if (this.usableEagle && this.useEagle) {
            if (max >= available) {
                this.deductEagle = this.userInfo.eagle;
                this.deductMoney = available;
                this.deductCharge = this.charge.sub(available);
            } else {
                this.deductEagle = max.mul(this.userInfo.eagleRatio);
                this.deductMoney = max;
                this.deductCharge = this.charge.sub(max);
            }
        } else {
            this.useEagle = false;
            this.deductEagle = 0;
            this.deductMoney = 0;
            this.deductCharge = this.charge;
        }
    }

    /**
     * 设置跟单id
     * @param id
     */
    setFollow(id){
        if(id){
            this.followId = id;
        }
    }

    /**切换下单类型 */
    swapOrderType(orderType) {
        this.orderType = orderType;
        return this
    }

    /**获取交易规则 */
    async getTradeRule(code) {
        this.rule = await RULE.getRule(code.replace(/\d/g, ''))
    }

    /**增加挂单金额 */
    plusOrderPrice() {
        return new Promise((resolve, reject) => {
            this.orderStep += 1;
            this.orderPrice = (Number(this._price).add(this.priceChange.mul(this.orderStep)))
            resolve(this.show())
        })
    }

    /**减少挂单金额 */
    reduceOrderPrice() {
        return new Promise((resolve, reject) => {
            if (Math.abs(this.orderPrice) > 0) {
                this.orderStep -= 1;
                this.orderPrice = (Number(this._price).add(this.priceChange.mul(this.orderStep)))
                resolve(this.show())
            } else {
                reject('价格必须大于0!')
            }
        })
    }

    /**
     * 反买
     * @param id
     */
    reverseBuy(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let money = Account.basicUserData.money < Number(this.order.charge + Math.abs(this.order.stopLoss)),
                    game = Account.basicUserData.game < Number(this.order.charge + Math.abs(this.order.stopLoss));
                if (this.simulate ? game : money) return reject('账户余额不足，无法买入');
                if (this.order === null) return reject('订单不存在或已平仓');
                await Req({
                    url: '/api/trade/close.htm',
                    type: 'POST',
                    data: {
                        bettingId: id,
                        tradeType: this.simulate ? 2 : 1,
                        source: '反向'
                    },
                    animate: true
                });
                await this.order(this.isBuy, true);
                resolve()
            } catch (error) {
                reject(error);
            }
        })


    }
    
    orderFast(isBuy){
        return this.order(isBuy,false,true)
    }

    order(isBuy = false, reverse = false,fast = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let source = reverse ? '反向' : (fast ? '闪电交易' : '下单');
                const config = {
                    identity: getIdentity(16),
                    tradeType: this.simulate ? 2 : 1,//模拟交易2 实盘交易1
                    source: source,  // 买入来源（下单、反向、快捷)
                    commodity: this.id,
                    contract: this.code,
                    isBuy: isBuy,
                    price: this.orderType === 0 ? 0 : this.orderPrice,
                    stopProfit: this.stopProfit,
                    stopLoss: this.stopLoss,
                    serviceCharge: this.deductCharge,
                    eagleDeduction: this.deductEagle,
                    volume: this.volume,
                    moneyType: this.moneyType,
                    platform: getPlatform(),
                };

                if(this.followId !== null){
                    config.followId = this.followId;
                }

                if (this.deferAble) {
                    config.defer = this.defer;
                    config.deferFee = this.deferFee;
                    config.isBuy = true;
                }
                if(this.type === 'ST'){
                    config.priceVolume = this.volume;
                    config.volume = this.shares;
                }else{
                    config.volume = this.volume;
                }
                if (this.priceRateList.length > 0) {
                    config.priceRate = this.priceRate;
                }
                const result = await Req({
                    url: '/api/trade/open.htm',
                    type: 'POST',
                    data: config,
                    animate: true,
                    timeout: 30
                });
                Account.getBasicUserInfo();
                Account.getFinanceUserInfo();
                this.message = result.errorMsg;
                resolve()
            } catch (error) {
                reject(error);
            }
        });
    }
}