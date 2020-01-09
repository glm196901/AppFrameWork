import {EVENT} from "../event";

export const Alpha = {
    _useDefaultGroup:false,
    _contracts:null,
    _data:null,
    _quote:null,
    _group:[],
    _groupStrap:[],
    _favor:[],
    _position:[],
    /**
     * 热门商品
     */
    _hot:[],
    /**
     * 新商品
     */
    _new:[],
    /**
     * 项目别名
     */
    _alias:{},
    init(contract,data,quote){
        this._contracts = contract;
        this._data = data;
        this._quote = quote;
    },
    /**
     * 设置默认商品ID,瞎鸡巴设置我不管
     * @param id
     */
    setIndex(id){
        this._contracts.index = id;
    },
    /**
     * 设置是否使用后台配置分组
     * @param status
     */
    setUseDefaultGroup(status){
        this._useDefaultGroup = status;
    },
    /**
     * 设置商品分组,瞎几把写我不负责
     * @param {String} name
     * @param {Array} list
     */
    setGroup(name,list){
        this._group.push({
            name,
            list
        })
    },
    setAlias(map){
        if(typeof map === 'object'){
            for(let [key,val] of Object.entries(map)){
                if(!!key && !!val){
                    this._alias[key] = val;
                }
            }
        }
    },
    setHot(list){
        if (list instanceof Array) {
            this._hot = list;
        } else if (list.indexOf(',') !== -1) {
            this._hot = list.split(',');
        } else if (list.indexOf(';') !== -1) {
            this._hot = list.split(';');
        } else {
            return console.warn(`你设置的什么JB热门商品??? ${list}`)
        }
    },
    setNew(list){
        if (list instanceof Array) {
            this._new = list;
        } else if (list.indexOf(',') !== -1) {
            this._new = list.split(',');
        } else if (list.indexOf(';') !== -1) {
            this._new = list.split(';');
        } else {
            return console.warn(`你设置的什么JB新商品??? ${list}`)
        }
    },
    _insertGroup(list){
        this._groupStrap = this._groupStrap.concat(list.list).unique();
    },
    getGroup(){
        return this._group.map(({name,list})=>{
            return {
                name,
                list:list.map((o)=>{
                    return this._data._total[o]
                })
            }
        })
    },
    _initFavor(list){
        this._favor = [].concat(list);
        this._data._loopCreateFavor();
    },
    _insertFavor(id){
        this._data._create(id);
        this._favor.push(id);
        this._contracts._getItemDetail(this._favor);
    },
    _removeFavor(code){
        this._favor.remove(code);
    },
    _updatePosition(list){
        this._position = list;
        this._data.createStrap();
    },
    getFavor(){
        return this._favor.map((c)=>{
            return this._data._total[c]
        })
    },
    getList(){
        return this._groupStrap.concat(this._favor,[this._contracts.index]).unique().filter((e) => {
            return this._contracts.getItem(e) !== undefined
        })
    },
    getStrap(){
        let n = this._groupStrap.concat(this._favor,[this._contracts.index],this._position).unique().filter((e) => {
            return this._contracts.getItem(e) && this._contracts.getItem(e).code !== null
        });
        n = n.map((e) => {
            return this._contracts.getItem(e).code
        }).concat(this._position).unique();
        return n.join(',');
    },
    update(){
        this._data.createStrap();
        this._quote.createStrap();
        EVENT.Quote.createStrap();
    }
};