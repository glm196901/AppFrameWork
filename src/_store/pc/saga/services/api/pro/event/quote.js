/**
 *@author wilde create at 2019/3/29 2:56 PM
 * 本模型仅用于行情主页面使用
 */
import {Rest} from "../util";

export default {
    id: null,
    code: null,
    simulate: false,
    _quote: null,
    _controller: null,
    _callback: [],
    _map: {},
    _contract: null,
    initial: false,
    dynamic: {
        open: '-',
        close: '-',
        price: '-',
        rate: '-',
        percent: '-',
        max: '-',
        min: '-',
        high_limit: '-',
        low_limit: '-',
        settle_price: '-',
        settle_price_yes: '-',
        hold_volume: '-',
        totalVolume: '-',
        tend: 'raise',
        maxTend: 'raise',
        minTend: 'raise'
    },
    _prepareForQuote(controller, map, id, contract) {
        this._controller = controller;
        this._map = map;
        this._contract = contract;
        this.id = id;
    },
    _init() {
        if (!this.initial) {
            this.initial = true;
            this.code = this._map[this.id].code;
            this._wakeUp('init')
        }
    },
    _backdoor(data) {
        if (!data) return;
        this._quote = data;
        this._wakeUp('update');
    },
    _wakeUp(type) {
        if (!this.initial) return;
        this._callback.forEach(({callback, scope}) => {
            if (!scope) return this.pullout(scope);
            if (scope._mount === undefined) {
                callback.call(scope, type)
            } else if (scope._mount) {
                callback.call(scope, type)
            } else {
                this.pullout(scope);
            }
        })
    },
    createStrap() {
        if (this.id && !this.code) {
            this.code = this._map[this.id].code;
        }
    },
    whileUpdated(callback, scope) {
        this._callback.push({callback, scope})
    },
    pullout(target) {
        if (this._callback.length > 0) {
            for (let i = 0; i < this._callback.length;) {
                let {scope} = this._callback[i];
                if (target === scope) {
                    this._callback.splice(i, 1)
                } else {
                    i++
                }
            }
        }
    },
    getDynamic() {
        if (!this.initial) return {};
        if (!this._map[this.id].usable) return {};
        const {priceDigit, name, code} = this._map[this.id];
        if (!this._quote) {
            return {name, code, simulate: this.simulate};
        }
        if (this._quote.code !== this.code) {
            return Object.assign({code: this.code, name}, this.dynamic);
        }
        const e = this._quote;
        const prev = e.settle_price_yes || e.close;
        let rate = e.price.sub(prev);
        let percent = rate.div(prev);
        const isUp = rate >= 0;
        let tend = isUp ? 'raise' : 'fall';
        rate = `${isUp ? '+' : ''}${rate.toFixed(priceDigit)}`;
        percent = `${isUp ? '+' : ''}${percent.mul(100).toFixed(2)}%`;
        const total = e.wt_buy_volume.add(e.wt_sell_volume);
        return {
            des: this._map[this.id].des || this._map[this.id].code,
            id: this.id,
            code: this._map[this.id].code,
            simulate: this.simulate,
            name: name,
            isUp: isUp,
            tend: tend,
            price: this._quote.price.toFixed(priceDigit),
            open: e.open ? e.open.toFixed(priceDigit) : '-',
            close: e.close ? e.close.toFixed(priceDigit) : '-',
            rate: rate,
            percent: percent,
            max: e.max ? e.max.toFixed(priceDigit) : '-',
            min: e.min ? e.min.toFixed(priceDigit) : '-',
            high_limit: e.high_limit ? e.high_limit.toFixed(priceDigit) : '-',
            low_limit: e.low_limit ? e.low_limit.toFixed(priceDigit) : '-',
            settle_price: e.settle_price ? e.settle_price.toFixed(priceDigit) : '-',
            settle_price_yes: e.settle_price_yes ? e.settle_price_yes.toFixed(priceDigit) : '-',
            hold_volume: e.hold_volume,
            totalVolume: e.volume,
            maxTend: e.max > e.settle_price_yes ? 'raise' : 'fall',
            minTend: e.min > e.settle_price_yes ? 'raise' : 'fall',
            rest: !Rest.isOpening(this._map[this.id]),
            buyPrice: e.wt_sell_price.toFixed(priceDigit),
            buyVolume: e.wt_buy_volume,
            buyWidth: e.wt_buy_volume.div(total) || 1,
            sellPrice: e.wt_buy_price.toFixed(priceDigit),
            sellVolume: e.wt_sell_volume,
            sellWidth: e.wt_sell_volume.div(total) || 1
        }
    },
    switch(id, simulate) {
        this._contract._getItemDetail([id]);
        if (id === this.id) {
            if (simulate === this.simulate) return;
            return this.switchSimulate(simulate)
        }
        this._controller.switch(id);
        this.id = id;
        this.code = this._map[this.id].code;
        if (simulate !== undefined) {
            this.simulate = simulate
        }
        this._wakeUp('switch');
    },
    switchSimulate(simulate) {
        if (simulate !== this.simulate) {
            this.simulate = simulate;
            this._wakeUp('switchSimulate');
        }
    },
    getCode() {
        return this._map[this.id].code
    },
    getDes() {
        return this.simulate ? '模拟' : '实盘'
    },
    activity() {
        this._wakeUp('activity')
    }
}