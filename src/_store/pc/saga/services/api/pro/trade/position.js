import {OrderConfig} from "./orderConfig";
import {getIdentity, getLocalStore, getPlatform, insertLocalStore, setLocalStore} from "../../lib/utils";
import {exposure} from "../../core/store";
import {Req} from "../network/Req";
import Account from "../event/account";
import module, {config} from "../event/trade";
import ERROR from "../event/error";
import {Favor} from "../contract/favor";
import {Alpha} from "../contract/alpha";

/**
 * @constructor
 * 持仓对象
 */
export class Position {
    _control = {};
    _data = {};
    _store = {};
    _storeList = [];
    _sim_store = {};
    _sim_storeList = [];
    simulate = true;
    _keepUpdate = false;
    _rate = [1, 0.1, 0.01];
    _isBuy = '买涨:买跌';
    _callback = null;
    _identity = null;
    _userInfo = {
        useExg: false
    };

    _temp = null;

    constructor(control, data, userInfo, options) {
        const def = {
            simulate: false,
            isBuy: '买涨:买跌'
        };
        options = Object.assign(def, options);
        if (options.isBuy.indexOf(':') !== -1) this._isBuy = options.isBuy;
        if (options.callback !== undefined) this._callback = options.callback;
        this._control = control;
        this._data = data;
        this.simulate = options.simulate;
        this._keepUpdate = true;
        this._identity = getIdentity(12);
        for (let o of Object.keys(userInfo)) {
            this._userInfo[o] = userInfo[o]
        }
        insertLocalStore('position', this._identity);
        this._update().catch(() => {
        });
    }

    async _update() {
        try {
            const p = getLocalStore('position', 'Array');
            if (p.length > 1 && p[0] === this._identity) {
                return this.destroy();
            }
            let {data} = await Req({
                url: '/api/trade/scheme.htm',
                data: {
                    schemeSort: 1,
                    tradeType: this.simulate ? 2 : 1,
                    beginTime: '',
                    _: new Date().getTime(),
                }
            });
            if (data) {
                this._process(data, this.simulate);
                this._live();
            }
        } catch (err) {
            ERROR.throw(err);
        } finally {
            if (this._keepUpdate !== null) {
                this._keepUpdate = setTimeout(() => this._update(), 1000);
            }
        }
    }

    _live() {
        exposure('positionUpdate');
        if (this._callback)
            this._callback();
    }

    _process(data, simulate) {
        let control;
        const [desBuy, desSell] = this._isBuy.split(':');
        const request = [];
        const list = [];
        let position = data.map((e) => {
            list.push(e.contract);
            control = this._control.getItem(e.commodityCode);
            if (control && control.tradeAble) {
                if(Alpha._alias[e.contract] !== undefined){
                    e.commodity = Alpha._alias[e.contract]
                }
                const {coins, des, crypto} = control;
                e.type = control.type;
                e.defer = e.tradeMode && e.tradeMode.indexOf('D') !== -1;
                e.crypto = config.digitalConvert ? des : crypto;
                e.coins = coins;
                e.stopProfitBase = e.stopProfit;
                e.stopProfit = this._exgCalculate(e.stopProfit, control.exgRate, coins);
                e.stopLossBase = e.stopLoss;
                e.stopLoss = this._exgCalculate(e.stopLoss, control.exgRate, coins);
                e.exgRate = control.exgRate;
                const base = control.chargeUnitList[0];
                const rate = this._rate[e.moneyType];
                e.unit = control.priceUnit.mul(rate);
                if(control.type === 'FT'){
                    if (e.priceRate) {
                        e.unit = e.unit.mul(e.priceRate.div(100))
                    }
                }
                if(this._data[control.id] && this._data[control.id].price){

                    /**
                     * 买卖价结算
                     */
                    if(process.env.bid){
                        if(e.isBuy){
                            e.current = Number(this._data[control.id].buyPrice);
                        }else {
                            e.current = Number(this._data[control.id].sellPrice);
                        }
                    }else {
                        /**
                         * 最新价结算
                         */
                        e.current = Number(this._data[control.id].price);
                    }
                }else{
                    e.current = 0;
                }
                e.charge = base.mul(e.volume).mul(rate);
                e.priceChange = control.priceChange;
                if (control.price !== '0.00' && !!e.opPrice && e.current !== 0) {
                    if (e.isBuy) {
                        e.des = desBuy;
                        e.income = e.current.sub(e.opPrice).div(control.priceChange).mul(e.volume).mul(e.unit);
                    } else {
                        e.des = desSell;
                        e.income = e.opPrice.sub(e.current).div(control.priceChange).mul(e.volume).mul(e.unit);
                    }
                    e.income = this._exgCalculate(e.income, control.exgRate, coins);
                    return e;
                } else {
                    e.income = 0;
                    return e;
                }
            } else {
                if(control){
                    request.push(control.id)
                }
                return null;
            }
        });
        Alpha._updatePosition(list.unique());
        if(request.length > 0){
            this._control._getItemDetail(request);
        }
        position.remove(null);
        this._insert(position, simulate);
    }

    _insert(data, simulate) {
        const target = simulate ? this._sim_store : this._store;
        const list = simulate ? this._sim_storeList : this._storeList;
        const compare = [];
        data.forEach((o) => {
            target[o.id] = o;
            compare.push(o.id)
        });
        const close = list.differ(compare);
        this._closeNotice(close, target, simulate);
        list.insert(compare);
    }

    /**
     * 汇率计算
     * @param val
     * @param exgRate
     * @param coins
     * @returns {*}
     * @private
     */
    _exgCalculate(val, exgRate, coins) {
        if (!config.digitalConvert) return val;
        if (!config.useExg && !coins) return val;
        if (val instanceof Array) {
            return val.map((e) => {
                let i = e.div(config.useCustomize ? config.exchange : exgRate);
                return i.floatLength() > 2 ? Number(Number(i).toFixed(2)) : i;
            })
        } else {
            let i = val.div(config.useCustomize ? config.exchange : exgRate);
            return i.floatLength() > 2 ? Number(Number(i).toFixed(2)) : i;
        }
    }

    /**
     * 进行平仓数据处理
     */
    _closeNotice(close, target, simulate) {
        const list = simulate ? this._sim_storeList : this._storeList;
        close.forEach((e) => {
            delete target[e];
            list.remove(e);
        });
        if (close.length > 0) {
            //todo 使用close进行广播
            exposure('positionClose', close)
        }
    }

    /**
     * 订单搜索
     * @param id
     * @returns {*}
     * @private
     */
    _searching(id) {
        if (this._store[id]) return [this._store[id], false];
        if (this._sim_store[id]) return [this._sim_store[id], true];
        return [null, null];
    }

    destroy() {
        clearTimeout(this._keepUpdate);
        this._keepUpdate = null;
        this._callback = null;
        const o = getLocalStore('position', 'Array');
        o.remove(this._identity);
        setLocalStore('position', o, 'Array');
    }

    /**
     * 切换实盘及模拟盘持仓更新
     * @param simulate
     */
    swapSimulate(simulate = false) {
        this.simulate = simulate;
    }

    /**
     * 初级的持仓获取
     * @deprecated
     * @param simulate
     * @returns {*}
     */
    getStore(simulate = false) {
        const targetList = simulate ? this._sim_storeList : this._storeList;
        const target = simulate ? this._sim_store : this._store;
        return targetList.map((e) => {
            return target[e]
        })
    }

    /**
     * 获取持仓商品
     * @param simulate
     * @returns {{total: number, data: any[]}}
     */
    getStatistics(simulate = false) {
        const targetList = simulate ? this._sim_storeList : this._storeList;
        const target = simulate ? this._sim_store : this._store;
        let total = 0;
        const data = targetList.map((e) => {
            total = total.add(target[e].income);
            return target[e]
        });
        return {total, data};
    }

    /**
     * 根据合约号获取持仓商品
     * @param contract
     * @param simulate
     * @returns {*}
     */
    getStatisticsByContract(contract, simulate = false) {
        if (!contract) return this.getStatistics(simulate);
        const target = simulate ? this._sim_store : this._store;
        const data = [];
        let total = 0;
        for (let [, val] of Object.entries(target)) {
            if (val.contract === contract) {
                total = total.add(val.income);
                data.push(val)
            }
        }
        return {total, data};
    }

    /**
     * 平仓
     * @param id
     * @returns {Promise<any>}
     */
    close(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const [, simulate] = this._searching(id);
                if (simulate === null) return reject('订单号不存在');
                await Req({
                    url: '/api/trade/close.htm',
                    type: 'POST',
                    data: {
                        bettingId: id,
                        tradeType: simulate ? 2 : 1,
                        source: '下单'
                    },
                    animate: true
                });
                resolve();
                Account.getBasicUserInfo();
                Account.getFinanceUserInfo();
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * 全部平仓
     * @param simulate
     * @returns {Promise<any>}
     */
    closeAll(simulate = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let list = simulate ? this._sim_storeList : this._storeList;
                list = list.join(',');
                const result = Req({
                    url: '/api/trade/close.htm',
                    type: 'POST',
                    data: {
                        bettingList: list,
                        tradeType: simulate ? 2 : 1,
                        source: '下单'
                    },
                    animate: true
                });
                resolve(result);
                Account.getBasicUserInfo();
                Account.getFinanceUserInfo();
            } catch (error) {
                reject(error)
            }
        });

    }

    /**
     * 指定商品全部平仓
     * @param contract
     * @param simulate
     * @returns {Promise<any>}
     */
    closeByContract(contract, simulate = false) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!contract) return reject('请传入合约号');
                const target = simulate ? this._sim_store : this._store;
                let list = simulate ? this._sim_storeList : this._storeList;
                list = list.filter((e) => {
                    return target[e].contract === contract
                });
                list = list.join(',');
                const result = Req({
                    url: '/api/trade/close.htm',
                    type: 'POST',
                    data: {
                        bettingList: list,
                        tradeType: simulate ? 2 : 1,
                        source: '下单'
                    },
                    animate: true
                });
                resolve(result.successNumber, result.failNumber);
                Account.getBasicUserInfo();
                Account.getFinanceUserInfo();
            } catch (error) {
                reject(error)
            }
        })
    }

    /**
     * 高级反买
     * @param {*} id
     */
    seniorReverseBuy(id) {
        const [order, simulate] = this._searching(id);
        return module.RFQ(order.contract, {simulate: simulate, isBuy: !order.isBuy})
    }

    /**
     * 反买
     * @param id
     */
    reverseBuy(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const [order, simulate] = this._searching(id);
                let money = Account.basicUserData.money < Number(order.charge + Math.abs(order.stopLoss)),
                    game = Account.basicUserData.game < Number(order.charge + Math.abs(order.stopLoss));
                if (simulate ? game : money) return reject('账户余额不足，无法买入');
                if (order === null) return reject('订单不存在或已平仓');
                const control = this._control[order.contract];
                const base = control.chargeUnitList[0];
                await Req({
                    url: '/api/trade/close.htm',
                    type: 'POST',
                    data: {
                        bettingId: id,
                        tradeType: simulate ? 2 : 1,
                        source: '反向'
                    },
                    animate: true
                });
                await Req({
                    url: '/api/trade/open.htm',
                    type: 'POST',
                    data: {
                        identity: getIdentity(16),
                        tradeType: simulate ? 2 : 1,//模拟交易2 实盘交易1
                        source: '反向',  // 买入来源（下单、反向、快捷)
                        commodity: control.code,
                        contract: order.contract,
                        isBuy: !order.isBuy,
                        price: 0,
                        stopProfit: order.stopProfitBegin,
                        stopLoss: order.stopLossBegin,
                        serviceCharge: base.mul(order.volume).mul(this._rate[order.moneyType]),
                        eagleDeduction: 0,
                        volume: order.volume,
                        moneyType: order.moneyType,
                        platform: getPlatform()
                    },
                    animate: true,
                    timeout: 30
                });
                Account.getBasicUserInfo();
                Account.getFinanceUserInfo();
                resolve()
            } catch (error) {
                reject(error);
            }
        })


    }

    /**
     * 追单
     * @param id
     */
    addBuy(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const [order, simulate] = this._searching(id);
                if (order === null) return reject('订单不存在或已平仓');
                const control = this._control[order.contract];
                const base = control.chargeUnitList[0];
                await Req({
                    url: '/api/trade/open.htm',
                    type: 'POST',
                    data: {
                        identity: getIdentity(16),
                        tradeType: simulate ? 2 : 1,//模拟交易2 实盘交易1
                        source: '追单',  // 买入来源（下单、反向、快捷)
                        commodity: control.code,
                        contract: order.contract,
                        isBuy: order.isBuy,
                        price: 0,
                        stopProfit: order.stopProfitBegin,
                        stopLoss: order.stopLossBegin,
                        serviceCharge: base.mul(order.volume).mul(this._rate[order.moneyType]),
                        eagleDeduction: 0,
                        volume: order.volume,
                        moneyType: order.moneyType,
                        platform: getPlatform()
                    },
                    animate: true,
                    timeout: 30
                });
                Account.getBasicUserInfo();
                Account.getFinanceUserInfo();
                resolve()
            } catch (error) {
                reject(error);
            }
        });
    }

    preOrderConfig(id){
        const [order, simulate] = this._searching(id);
        if (order === null) return null;
        this._temp = new OrderConfig(order, this._userInfo.useExg, simulate);
    }

    processOrderConfig(){
        return this._temp;
    }

    /**
     * 获取订单操作对象
     * @param id
     * @returns {*}
     */
    getOrderConfig(id) {
        const [order, simulate] = this._searching(id);
        if (order === null) return null;
        return new OrderConfig(order, this._userInfo.useExg, simulate);
    }
}