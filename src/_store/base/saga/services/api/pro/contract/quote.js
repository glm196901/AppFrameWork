import {Jsonp} from "../network/Jsonp";
import {exposure} from "../../core/store";
import {EVENT} from "../event";

export default class Quote {

    initial = false;

    constructor(e) {
        this.name = 'Quote';
        this._contracts = e;
        this._total = {};
        this._id = null;
        this._code = null;
        this._plan = null;
        this._callback = null;
        this._interval = 1000;
    }

    init(e) {
        this._contracts = e;
        this._map = e._total;
        this.initial = true;
        EVENT.Quote._prepareForQuote(this, e._total, e.index,e);
    }

    start(callback, id) {
        if (!!this._callback)
            return;

        if (!this._code) {
            if (!id) return;
            this._id = id;
            this._code = this._contracts.getItem(id).code;
        }

        if (!callback)
            return console.error('缺少回调字符串');
        this._callback = callback;
        this._inquiry();

    }

    end() {
        this._id = null;
        this._code = null;
        this._callback = null;
        clearTimeout(this._plan);
        this._plan = null;

    }

    switch(code) {
        this._id = code;
        this._code = this._contracts.getItem(code).code;
    }

    createStrap(){
        if(this._id){
            this._code = this._contracts.getItem(this._id).code;
        }
    }

    callback(id,data) {
        const [q] = data;
        // console.log(data)
        // debugger
        if (q && q.length > 0) {
            const [code] = q;
            const {spread} = this._contracts.getItem(id);      
            // console.log(spread)
            const obj = {
                item: id,
                code: code,
                time: q[q.length - 1],
                timestamp: q[q.length - 1], 
                price: parseFloat(q[9]),
                volume: parseInt(q[12]),
                lastVolume: parseInt(q[12]),
                wt_sell_price: spread === 0 ? parseFloat(q[1]) : ( spread > 0 ? parseFloat(q[9]).add(spread) : parseFloat(q[9]) ),
                wt_sell_volume: parseInt(q[2]),
                wt_buy_price: spread === 0 ? parseFloat(q[3]) : ( spread > 0 ? parseFloat(q[9]).sub(spread) : parseFloat(q[9]) ),
                wt_buy_volume: parseInt(q[4]),  
                close: parseFloat(q[5]),        
                open: parseFloat(q[6]),
                max: parseFloat(q[7]),
                min: parseFloat(q[8]),
                settle_price: parseFloat(q[11]),
                settle_price_yes: parseFloat(q[16]),
                amount: parseFloat(q[13]),
                hold_volume: parseInt(q[14]),
                hold_yes: parseInt(q[15]),
                high_limit: parseFloat(q[17]),
                low_limit: parseFloat(q[18])
            };
            this._total[id] = obj;
            EVENT.Quote._backdoor(obj);
            EVENT.Trade._backdoorForQuote(obj);
            if (this._callback !== null) {
                exposure(this._callback, obj);
            }
        }
        this._plan = setTimeout(() => {
            if (this._callback !== null) this._inquiry()
        }, this._interval);
    }

    _inquiry(){
        if(this._code !== null){
            Jsonp({
                url: '/quote.jsp',
                type: 'POST',
                data: {
                    callback: '?',
                    code: this._code,
                    _: new Date().getTime(),
                }
            }).then((res)=>{
                this.callback(this._id,res);
            }).catch((err)=>{
                console.warn(err);
                setTimeout(() => {
                    this._inquiry()
                }, 4000)
            })
        }else{
            setTimeout(()=>this._inquiry(),1000)
        }

    }
}