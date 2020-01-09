import {Rest} from "../util";

export class Brief {
    name = '';
    id = '';
    code = null;
    des = '';
    price = null;
    prev = null;
    isUp = null;
    rate = null;
    gap = null;
    flux = null;
    _gap = 0;
    _format = [];
    constructor({name, id},format) {
        if(id.indexOf('USDT') !== -1){
            this.des = `${id.split('USDT').join('/')}USDT`;
        }
        this.id = id;
        this.name = name;
        this._format = format.split(',');
    }

    updateCode(code){
        this.code = code;
    }

    /**
     * 计算单词价格波动
     * @private
     */
    _wave(price) {
        if (this.price === null || price === this.price) return this.flux = null;
        if (price > this.price) return this.flux = true;
        this.flux = false;
    }

    insert() {
        this._wave(arguments[1]);
        let bridge = this;
        this._format.forEach((key,index)=>{
            bridge[key] = arguments[index];
        });
        this.isUp = this.price > this.prev;
    }

    calculateRate() {
        this.rate = `${this.isUp?'+':'-'}${this._gap.div(this.prev).mul(100).toFixed(2)}%`;
    }

    calculateGap() {
        this._gap = Math.abs(Number(this.price).sub(Number(this.prev)));
        this.gap = `${this.isUp?'+':'-'}${this._gap.toFixed(2)}`;
    }

    renew(contract) {
        this.isOpen = Rest.isOpening(contract);
    }

    getWave(raise, fall) {
        if (this.flux === null) return '';
        if (this.flux) return raise;
        return fall;
    }
}