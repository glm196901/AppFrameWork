import {Jsonp} from "../network/Jsonp";
import {exposure} from "../../core/store";
import {EVENT} from "../event";
import {Brief} from "./brief";
import {Alpha} from "./alpha";

export default class Data {
    initial = false;
    name = 'Data';
    _contracts = null;
    _total = {};
    _map = {};

    _strap = '';
    _plan = null;
    _callbackList = [];
    _interval = 2000;
    _brief = Brief;
    _format = 'isUp,price,prev';

    constructor(n) {
        if (n) {
            this.interval = n;
        }
    }

    init(e) {
        this._contracts = e;
        this._map = e._total;
        this._loopCreate();

        this.initial = true;
    }

    _loopCreate() {
        if (Alpha._group.length > 0) {
            for (let {list} of Alpha._group) {
                for (let o of list) {
                    if (this._total[o] === undefined) {
                        this._total[o] = new this._brief(this._contracts.getItem(o),this._format)
                    }
                }
            }
        }
        if (Alpha._favor.length > 0) {
            for (let o of Alpha._favor) {
                if (this._total[o] === undefined) {
                    this._total[o] = new this._brief(this._contracts.getItem(o),this._format)
                }
            }
        }
    }

    _loopCreateFavor(){
        if (Alpha._favor.length > 0) {
            for (let o of Alpha._favor) {
                if (this._total[o] === undefined) {
                    this._total[o] = new this._brief(this._contracts.getItem(o),this._format)
                }
            }
        }
    }

    _create(id){
        if(this._total[id] === undefined){
            this._total[id] = new this._brief(this._contracts.getItem(id),this._format);
        }
    }

    createStrap() {
        this._strap = Alpha.getStrap();
        if(this._strap !== ''){
            for(let o of this._strap.split(',')){
                const id = this._contracts.getIdByCode(o);
                if(id && this._total[id] === undefined){
                    this._total[id] = new this._brief(this._contracts.getItem(id),this._format);
                }
            }
        }
    }

    start(callback) {
        if (!this.initial) return;
        if (!callback)
            return console.error('缺少回调字符串');

        if (this._callbackList.length > 0) {
            if (this._callbackList.includes(callback))
                return;
            this._callbackList.push(callback);
        } else {
            this._callbackList.push(callback);
            this._inquiryAll()
        }
    }

    end(callback) {
        if (!callback)
            return;

        this._callbackList.remove(callback);
        if (this._callbackList.length === 0) {
            clearTimeout(this._plan);
            this._plan = null;
        }
    }

    _callback(res) {
        for (let [code, ...rest] of res) {
            try{
                const id = this._contracts.getIdByCode(code);
                if(id){
                    if(this._total[id] === undefined){
                        this._total[id] = new this._brief(this._contracts.getItem(id),this._format);
                    }
                    this._total[id].updateCode(code);
                    this._total[id].insert(...rest);
                    /**
                     * 计算涨跌金额
                     * @type {string}
                     */
                    this._total[id].calculateGap();
                    /**
                     * 计算涨跌百分比
                     * @type {string}
                     */
                    this._total[id].calculateRate();
                    this._total[id].renew(this._contracts.getItem(id));
                }
            }catch (err){
                console.warn(err);
            }

        }
        EVENT.Trade._backdoorForData(this._total);
        EVENT.Game.Quiz._backdoorForData(this._total);
        if (this._callbackList.length > 0) {
            for (let v of this._callbackList) {
                exposure(v)
            }
            this._plan = setTimeout(() => this._inquiryAll(), this._interval);
        }
    }


    _inquiryAll() {
        if (this._strap !== '') {
            Jsonp({
                url: '/quote.jsp',
                type: 'POST',
                data: {
                    callback: '?',
                    code: this._strap,
                    _: new Date().getTime(),
                    simple: true
                },
                timeout: 4000
            }).then((res)=>{
                this._callback(res)
            }).catch(() => {
                setTimeout(() => this._inquiryAll(), 4000)
            })
        } else {
            this.createStrap();
            setTimeout(()=> this._inquiryAll(),1000)
        }
    }
}