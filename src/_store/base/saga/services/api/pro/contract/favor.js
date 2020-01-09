import {Storage} from "../../lib/utils";
import {EVENT} from "../event";
import {Alpha} from "./alpha";

export const Favor = {
    _key:'favor_db',
    _total: [],
    _default: [],
    _id: null,
    _map: {},
    init(map) {
        try{
            this._map = map;
            this._id = EVENT.Account.getBasicUserData().id;
            const db = JSON.parse(Storage.getItem(this._key));
            if (db && db[this._id] !== undefined) {
                this._loadDb(db[this._id]);
            } else {
                this._initDb();
            }
        }catch (err){
            this._initDb();
        }finally {
            Alpha._initFavor(this._total);
        }
    },
    /**
     * 设置默认自选
     * 支持数组,以逗号、分号分隔的字符串
     * @param list
     */
    setDefault(list) {
        if (list instanceof Array) {
            this._default = list;
        } else if (list.indexOf(',') !== -1) {
            this._default = list.split(',');
        } else if (list.indexOf(';') !== -1) {
            this._default = list.split(';');
        } else {
            return console.warn(`你设置的什么JB默认自选??? ${list}`)
        }
    },
    _initDb() {
        let db = {};
        this._total = this._default.filter((code) => this._map[code] !== undefined);
        db[this._id] = this._total;
        Storage.setItem(this._key,JSON.stringify(db))
    },
    clearDb(){
        this._saveDb();
        this._total = [];
        this._id = null;
    },
    _loadDb(db) {
        this._total = db.filter((code) => this._map[code] !== undefined);
        this._saveDb();
    },
    _saveDb(){
        if(this._id){
            const db = JSON.parse(Storage.getItem(this._key));
            db[this._id] = this._total;
            Storage.setItem(this._key,JSON.stringify(db))
        }
    },
    addFavor(code){
        if(this._total.includes(code)) return;
        this._total.push(code);
        this._saveDb();
        Alpha._insertFavor(code)
    },
    removeFavor(code){
        if(!this._total.includes(code)) return;
        this._total.remove(code);
        this._saveDb();
        Alpha._removeFavor(code)
    }
};
