import {Storage} from "../../lib/utils";
import Cache from "./cache";
import {Alpha} from "./alpha";

export default class Item extends Cache{
    lastUpdateTimeForContract = 0;
    _contractUpdating = false;
    lastUpdateTimeForTrade = 0;
    _tradeUpdating = false;
    period = 60000;
    forTrade = false;
    usable = false;
    tradeAble = false;

    _map = null;
    constructor(id, name,map) {
        super(id);
        this._map = map;
        if(this.code === undefined) this.code = null;
        this.id = id;
        if(Alpha._alias[this.id] !== undefined){
            this.name = Alpha._alias[this.id]
        }else{
            this.name = name;
        }
        if(this.id.indexOf('USDT') !== -1){
            this.crypto = this.id.replace('USDT','');
            this.des = `${this.crypto}/USDT`;
        }
        if(this._hasCache){
            map[this.code] = this.id;
            if(!this.usable) this.usable = true;
        }
    }


    shouldUpdateInit(){
        return !this._hasCache
    }

    shouldUpdate() {
        return new Date().getTime().sub(this.lastUpdateTimeForContract) >= this.period && !this._contractUpdating
    }

    shouldUpdateTrade(){
        return (!this.forTrade || new Date().getTime().sub(this.lastUpdateTimeForTrade) >= this.period) && !this._tradeUpdating
    }

    setData(data) {
        delete data.name;
        delete data.code;
        data.code = data.contractCode;
        delete data.contractCode;
        Object.assign(this, data);
        this.priceUnit = this.priceChange.mul(this.priceUnit);
        this.write(data);
        /**
         * 建立映射
         */
        this._map[this.code] = this.id;
        this._contractUpdating = false;
        this.lastUpdateTimeForContract = new Date().getTime();
        if(!this.usable) this.usable = true;
        if(this.usable && this.lastUpdateTimeForTrade !== 0) this.tradeAble = true;

    }

    setTrade(data){
        Object.assign(this,data);
        this._tradeUpdating = false;
        this.lastUpdateTimeForTrade = new Date().getTime();
        if(this.usable && this.lastUpdateTimeForTrade !== 0) this.tradeAble = true;
    }
}