import {Storage} from "../../lib/utils";


export default class Cache {
    _key = null;
    _hasCache = false;
    constructor(key){
        this._key = key;
        let cache = Storage.getItem(key);
        try{
            if(cache){
                Object.assign(this,JSON.parse(cache));
                this._hasCache = true;
            }
        }catch (err){
            console.warn('啊... 有毒')
        }
    }
    write(data){
        Storage.setItem(this._key,JSON.stringify(data))
    }
}