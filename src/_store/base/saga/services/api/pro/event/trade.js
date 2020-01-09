import {
    formatDate, getCloseTime, Storage
} from "../../lib/utils";
import {exposure} from "../../core/store";
import {tidesForOrderConfig} from "../trade/orderConfig";
import {Position} from "../trade/position";
import {Trade, tidesForTradeUpdate, tidesForTrade} from "../trade/trade";
import {EVENT} from "./index";

export const config = {
    /**
     * 是否全局转换为原始货币
     */
    useExg: false,
    /**
     * 是否使用自定义全局汇率
     */
    useCustomize: false,
    /**
     * 货币转换的全局汇率
     */
    exchange: 0,
    /**
     * 数字货币商品是否进行货币转换
     */
    digitalConvert: true
};

export default {
    name: 'Trade',
    initial: false,
    _contracts: null,
    userInfo: {
        money: 0,
        game: 0,
        eagle: 0,
        eagleRatio: 10,
        eagleMax: 1,
        partDeduct: false,
        useExg: false
    },
    /**
     * 清单
     */
    list: [],
    /**
     * 商品
     */
    commodity: {},
    /**
     * 仓库
     */
    depot: [],
    /**
     * 是否有快速交易
     */
    tradeQuick: null,

    keeper: null,
    librarian: null,
    _insertContracts(data) {
        if (!this.initial) {
            this._contracts = data;
            this._init();
        }
    },
    _insertTradeInfo(tradeQuick = false) {
        if (!this.initial) {
            this.tradeQuick = tradeQuick;
            this._init();
        }
    },
    _init() {
        if (this.tradeQuick !== null && this._contracts !== null) {
            for (let [key] of Object.entries(this._contracts._total)) {
                if (key === '') continue;
                this.list.push(key);
                this.commodity[key] = {};
                // const {commCode, commName, chargeUnitList, priceDigit, priceChange, priceUnit, priceOriginal,depositList, stopLossList, stopProfitList, volumeList, spread, closeTime, exgRate, coins, chargeCoinList, chargeUnit, chargeOriginal,deferFee,deferType,priceRateList} = this._tradeList[key];
                // const {moneyType, des, crypto} = val;
                // this.commodity[key] = {
                //     name: commName,
                //     code: commCode,
                //     contract: key,
                //     chargeOriginal,
                //     chargeUnit,
                //     chargeUnitList,
                //     priceDigit,
                //     priceChange,
                //     priceUnit: priceChange.mul(priceUnit),
                //     priceOriginal,
                //     depositList,
                //     stopLossList,
                //     stopProfitList,
                //     volumeList,
                //     spread,
                //     moneyType,
                //     closeTime: formatDate('h:i:s', {date: getCloseTime(closeTime)}),
                //     isUp: false,
                //     isOpen: false,
                //     price: '0.00',
                //     rate: '0.00%',
                //     exgRate,
                //     coins,
                //     chargeCoinList,
                //     des,
                //     crypto,
                //     deferFee,
                //     deferType,
                //     priceRateList
                // };
            }
            this.initial = true;
            Storage.removeItem('position');
            exposure('tradeInitial')
        }
    },

    /**
     * 接收行情的后门
     * @param data
     */
    _backdoorForData(data) {
        for (let key of this.list) {
            if (data[key]) {
                this.commodity[key] = data[key];
            }
        }
        tidesForOrderConfig && tidesForOrderConfig(this.commodity);
    },

    /**
     * 接收单个商品行情的后门
     * @param data
     * @private
     */
    _backdoorForQuote(data) {
        tidesForTradeUpdate && tidesForTradeUpdate(data);
    },

    /**
     * 接收用户数据更新的后门
     * @param data
     * @private
     */
    _backdoorForUser(data) {
        for (let o of Object.keys(this.userInfo)) {
            if (data[o]) this.userInfo[o] = data[o]
        }
        tidesForTrade && tidesForTrade(this.userInfo);
    },

    /**
     * 设置积分抵扣手续费的最大比例
     * @param {Number} ratio
     */
    setMaxEaglePercent(ratio) {
        if (typeof ratio !== "number") return;
        if (ratio > 1 || ratio < 0) return;
        this.userInfo.eagleMax = ratio;
    },

    /**
     * 设置是否允许部分抵扣手续费
     * @param {Boolean} available
     */
    setPartEagleDeduct(available) {
        if (typeof available !== "boolean") return;
        this.userInfo.partDeduct = available;
    },

    /**
     * 设置手续费,保证金,止盈止损是否以原始货币显示
     * @param {Boolean} status
     * @param {Number} [exchange] 自定义汇率
     */
    setExgUsable(status, exchange) {
        config.useExg = status;
        if (exchange !== undefined) {
            config.useCustomize = true;
            config.exchange = exchange
        }
        this.userInfo.useExg = status;
    },

    /**
     * 设置数字货币商品不进行货币转换
     */
    setDigitalNotConvert() {
        config.digitalConvert = false;
    },


    _rfqWaiting: null,
    _rfqLooping(resolve, reject, id, options) {
        if (id !== null && this._contracts.getItem(id) && this._contracts.getItem(id).tradeAble) {
            this._rfqWaiting = null;
            resolve(new Trade(this._contracts.getItem(id), this.userInfo, options))
        } else if (this._rfqWaiting !== null) {
            this._contracts._getTradeList([id]);
            this._rfqWaiting = setTimeout(() => {
                this._rfqLooping(resolve, reject, id, options)
            }, 500)
        } else {
            reject();
        }
    },
    /**
     * @param id
     * @param options [isBuy,simulate]
     * @returns {Trade|Object}
     * @constructor
     */
    RFQ(id, options) {
        clearTimeout(this._rfqWaiting);
        return new Promise((resolve, reject) => {
            this._rfqWaiting = true;
            this._rfqLooping(resolve, reject, id, options)
            // console.log( this._rfqLooping(resolve, reject, id, options))
            // console.log(id, options)
            // debugger
        });
    },


    _inventoryWaiting: null,
    _inventoryLooping(resolve, reject, options) {
        if (EVENT.Account.isLogin && this.initial) {
            this._inventoryWaiting = null;
            if (!!options) {
                this.librarian = new Position(this._contracts, this.commodity, this.userInfo, options);
            }
            resolve(this.librarian)
        } else if (this._inventoryWaiting !== null) {
            this._inventoryWaiting = setTimeout(() => {
                this._inventoryLooping(resolve, reject, options);
            }, 500)
        } else {
            reject()
        }
    },
    /**
     * @param options
     * @returns {Position|Object}
     * @constructor
     */
    INVENTORY(options) {
        clearTimeout(this._inventoryWaiting);
        return new Promise((resolve, reject) => {
            this._inventoryWaiting = true;
            this._inventoryLooping(resolve, reject, options)
        });
    }
}