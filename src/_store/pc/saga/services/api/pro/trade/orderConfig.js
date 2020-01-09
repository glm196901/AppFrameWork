import {Req} from "../network/Req";
import {config} from "../event/trade";
import ERROR from "../event/error";

export let tidesForOrderConfig = null;

function bridgeForOrderConfig(wakeUp) {
    tidesForOrderConfig = wakeUp
}

/**
 * @constructor
 * 订单操作
 */
export class OrderConfig {

    _callback = null;

    constructor(order, useExg, simulate) {
        this._useExg = useExg;
        this._coins = order.coins;
        this._exgRate = order.exgRate;
        this.id = order.id;
        this.name = order.commodity;
        this.contract = order.contract;
        this.priceDigit = order.priceDigit;
        this.des = order.des;
        this.isBuy = order.isBuy;
        this.class = order.isBuy ? 'raise' : 'fall';
        this.moneyType = order.moneyType;
        this.simulate = simulate;
        this.income = order.income;
        this.open = order.opPrice;
        this.current = order.current;
        this.volume = order.opVolume;
        this.charge = order.charge;
        this.priceChange = order.priceChange;
        this.unit = order.unit;
        this.type = order.type;

        /**
         * 当前止损金额(显示)
         * @type {*|number}
         */
        this.stopLoss = order.stopLoss;
        /**
         * 当前止损金额(请求)
         * @type {*|number|App.stopLoss|PositionConfig.stopLoss}
         */
        this.stopLossBase = order.stopLossBase;
        /**
         * 最小止损金额(显示)
         * @type {number}
         */
        this.stopLossMin = order.type === 'ST' ? -1 : this._exgCalculate(-order.unit.mul(order.opVolume));
        /**
         * 最小止损金额(计算)
         * @type {number}
         */
        this.stopLossBaseMin = order.type === 'ST' ? -1 : -order.unit.mul(order.opVolume);
        /**
         * 最大止损金额(显示)
         */
        this.stopLossMax = this._exgCalculate(order.stopLossBegin);
        /**
         * 止损调整最大Step(计算)
         * @type {Number}
         */
        this.stopLossStep = order.type === 'ST' ? Math.abs(order.stopLossBegin) : Math.abs(order.stopLossBegin).div(order.unit.mul(order.opVolume));
        /**
         * 止损的当前Step
         * @type {Number}
         */
        this.stopLossIndex = this.stopLossBase.div(this.stopLossBaseMin);

        /**
         * 当前止盈金额(显示)
         * @type {*|number}
         */
        this.stopProfit = order.stopProfit;
        /**
         * 当前止盈金额(计算)
         */
        this.stopProfitBase = order.stopProfitBase;
        /**
         * 最小止盈金额(显示)
         * @type {number}
         */
        this.stopProfitMin = order.type === 'ST' ? 1 : this._exgCalculate(order.unit.mul(order.opVolume));
        /**
         * 最小止盈金额(计算)
         * @type {*}
         */
        this.stopProfitBaseMin = order.type === 'ST' ? 1 : order.unit.mul(order.opVolume);
        /**
         * 最大止盈金额(仅显示)
         */
        this.stopProfitMax = this._exgCalculate(order.stopProfitBegin);
        /**
         * 止盈调整最大Step
         * @type {Number}
         */
        this.stopProfitStep = order.type === 'ST' ? order.stopProfitBegin : order.stopProfitBegin.div(order.unit.mul(order.opVolume));
        /**
         * 止盈的当前Step
         * @type {Number}
         */
        this.stopProfitIndex = this.stopProfitBase.div(this.stopProfitBaseMin);

        let gapForLoss = this.stopLossIndex.mul(this.priceChange);
        let maxForLoss = this.stopLossStep.mul(this.priceChange);
        let gapForProfit = this.stopProfitIndex.mul(this.priceChange);
        let maxForProfit = this.stopProfitStep.mul(this.priceChange);
        this.stopLossPrice = this.open.add(this.isBuy ? -gapForLoss : gapForLoss).toFixed(this.priceDigit);
        this.stopLossMinPrice = this.open.add(this.isBuy ? -this.priceChange : this.priceChange).toFixed(this.priceDigit);
        this.stopLossMaxPrice = this.open.add(this.isBuy ? -maxForLoss : maxForLoss).toFixed(this.priceDigit);
        this.stopProfitPrice = this.open.add(this.isBuy ? gapForProfit : -gapForProfit).toFixed(this.priceDigit);
        this.stopProfitMinPrice = this.open.add(this.isBuy ? this.priceChange : -this.priceChange).toFixed(this.priceDigit);
        this.stopProfitMaxPrice = this.open.add(this.isBuy ? maxForProfit : -maxForProfit).toFixed(this.priceDigit);
        bridgeForOrderConfig(this._wakeUp.bind(this))
    }

    _wakeUp(store) {
        if (!!store[this.contract]) {
            this.current = Number(store[this.contract].price);
            if (this.isBuy) {
                this.income = this.current.sub(this.open).div(this.priceChange).mul(this.volume).mul(this.unit);
            } else {
                this.income = this.open.sub(this.current).div(this.priceChange).mul(this.volume).mul(this.unit);
            }
            this.income = this._exgCalculate(this.income);
            this._callback && this._callback();
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
        if (!config.useExg && !this._coins) return val;
        let i = val.div(config.useCustomize ? config.exchange : this._exgRate);
        return i.floatLength() > 2 ? Number(Number(i).toFixed(2)) : i;
    }

    /**
     * @deprecated
     * @param val
     * @returns {*}
     * @private
     */
    _reverseExgCalculate(val) {
        if (!config.digitalConvert) return val;
        if (!config.useExg && !this._coins) return val;
        return val.mul(config.useCustomize ? config.exchange : this._exgRate);
    }

    whileUpdated(callback) {
        if (callback) this._callback = callback;
    }

    setStopLoss(index = 1) {
        if (index > this.stopLossStep) index = this.stopLossStep;
        if (index < 1) index = 1;
        const gap = index.mul(this.priceChange);
        this.stopLoss = index.mul(this.stopLossMin);
        this.stopLossBase = index.mul(this.stopLossBaseMin);
        this.stopLossPrice = Number(this.open.add(this.isBuy ? -gap : gap)).toFixed(this.priceDigit);
        this.stopLossIndex = index;
    }

    setStopProfit(index) {
        if (index > this.stopProfitStep) index = this.stopProfitStep;
        if (index < 1) index = 1;
        const gap = index.mul(this.priceChange);
        this.stopProfit = index.mul(this.stopProfitMin);
        this.stopProfitBase = index.mul(this.stopProfitBaseMin);
        this.stopProfitPrice = Number(this.open.add(this.isBuy ? gap : -gap)).toFixed(this.priceDigit);
        this.stopProfitIndex = index;
    }

    submit() {
        if (this.income > this.stopProfit) return ERROR.PROMISE('止盈金额不能低于当前已盈利金额');
        return Req({
            url: '/api/trade/spsl.htm',
            type: 'POST',
            data: {
                bettingId: this.id,
                tradeType: this.simulate ? 2 : 1,
                stopProfit: this.stopProfitBase,
                stopLoss: this.stopLossBase,
                source: '设置止盈止损'
            },
            animate: true
        });
    }
}