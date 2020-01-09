import PinyinMatch from 'pinyin-match';
import {Req} from "../network/Req";
import {exposure, spy} from "../../core/store";
import {decodeFromWeb} from "../network/encrypt";
import {JsonListMerge as quoteAdd} from "../network/Jsonp";
import {JsonListMerge as chartAdd} from "../chartTV/chart";
import {JsonListMerge as chartIQAdd} from "../chartiq/chartIQ";
import Item from "./item";
import {Favor} from "./favor";
import {STORE} from "../../core/store/state";
import {EVENT} from "../event";
import {Alpha} from "./alpha";
import {getSearch,setCookie} from "../../lib/utils";
import {GetDeviceInfo} from "../../core/native/native";

export default class Contracts {
    initial = false;
    name = 'Contracts';
    /**
     * 所有商品的对象集合
     * @memberof Contract
     */
    _total = {};
    /**
     * 合约对照,内部使用
     * @type {{}}
     * @private
     */
    _totalMap = {};
    /**
     * 搜索用的数组
     * @type {Array}
     * @private
     */
    _searchMap = [];
    /**
     * 默认商品
     * @type {string}
     */
    index = '';

    /**
     * 服务器时间
     * @type {number}
     */
    serviceTime = 0;

    init(extend) {

        let o = getSearch();
        if (o.ru) {
            setCookie('ru', o.ru, 365);
            setCookie('F-U', o.ru, 365);
        }
        if (o.f) {
            setCookie('f', o.f, 365);
        }
        setTimeout(() => {
            if (window.isSuperman) {
                GetDeviceInfo().then((result) => {
                    if (result.uniqueId) {
                        setCookie('uuid', result.uniqueId)
                    }
                })
            }
        }, 1000);

        Req({
            url: '/api/trade/commodity/initial',
            timeout: 10
        }).then((res) => {
            try {
                let initialCodes = [];
                let {quoteDomain, group, names, time} = res;
                let book = decodeFromWeb(quoteDomain);
                book = book.split(';');
                quoteAdd(book);
                chartAdd(book[0]);
                window.quoteURL = book[0] // 公开地址
                chartIQAdd(book[0]);
                this.serviceTime = time;
                for (let o of names) {
                    if (o && o.indexOf(':') !== -1) {
                        const [id, name] = o.split(':');
                        this._total[id] = new Item(id, name,this._totalMap);
                        if(Alpha._alias[id] !== undefined){
                            this._searchMap.push(`${id}:${Alpha._alias[id]}`)
                        }else{
                            this._searchMap.push(o)
                        }
                    } else {
                        this._error('init', `${o}格式错误`)
                    }
                }

                if(Alpha._useDefaultGroup && group.length > 0){
                    group.forEach((e, i) => {
                        e.list = e.list.split(';');
                        e.list = e.list.filter((code, l) => {
                            if (this._total[code] !== undefined) {
                                if (i === 0 && l === 0) {
                                    if(this.index === ''){
                                        this.index = code
                                    }
                                }
                                initialCodes.push(code);
                            }
                            return this._total[code] !== undefined
                        });
                        if (e.list.length > 0) {
                            Alpha.setGroup(e.name,e.list)
                            Alpha._insertGroup(e);
                        }
                    });
                }

                /**
                 * 处理默认商品分组
                 */
                if (Alpha._group && Alpha._group.length > 0) {
                    Alpha._group.forEach((e, i) => {
                        e.list = e.list.filter((code, l) => {
                            if (this._total[code] !== undefined) {
                                if (i === 0 && l === 0) {
                                    if(this.index === ''){
                                        this.index = code
                                    }
                                }
                                initialCodes.push(code);
                            }
                            return this._total[code] !== undefined
                        });
                        if (e.list.length > 0) {
                            Alpha._insertGroup(e);
                        }
                    });
                }
                /**
                 * 如果无法获取默认商品
                 */
                if (this.index === '') {
                    console.warn('默认商品获取出错,我不想配置了');
                }
                initialCodes.push(this.index);
                initialCodes = initialCodes.unique();

                this._getItemDetail(initialCodes,{init:true});
                if (extend) extend();
                this.extended();
                this.initial = true;
                EVENT.Trade._insertContracts(this);
                exposure('contractsInitial');
                STORE.listener(STORE.STATE.ACCOUNT).emitter(() => {
                    this._loginCallback();
                });
                spy('loginCallback', this._loginCallback, this);

            } catch (err) {
                console.warn('初始化失败,请检查错误', err);

            }
        }).catch((err) => {
            console.warn(err, `初始化失败,次数`);
            console.count('contracts');
            setTimeout(() => {
                this.init(extend)
            }, 1000)
        })
    }

    extended() {

    }

    isHot(id) {
        return Alpha._hot.includes(id);
    }

    isNew(id) {
        return Alpha._new.includes(id);
    }

    getContractByCode(code) {
        return this.getItem(code);
    }
    
    getItem(id) {
        if (this._total[id] !== undefined) {
            return this._total[id];
        }
        if(id && this._totalMap[id] !== undefined){
            id = this._totalMap[id];
            if (this._total[id] !== undefined) {
                return this._total[id];
            }
        }
    }

    getItemByCode(code) {
        const id = this._totalMap[code];
        if (id && this._total[id]) {
            return this._total[id];
        } else {
            return null;
        }
    }

    getIdByCode(code) {
        return this._totalMap[code]
    }

    /**
     *
     * @param input
     * @param {String} [type] 类型判断  FT期货 ST股票
     * @param {Boolean} [non] 非判断
     * @returns {*[]}
     */
    search(input, type, non) {
        if (type === undefined) {
            return this._searchMap.filter((o) => {
                const [code, name] = o.split(':');
                return PinyinMatch.match(name, input) || code.indexOf(input.toUpperCase()) !== -1
            })
        } else if (non) {
            return this._searchMap.filter((o) => {
                const [code, name] = o.split(':');
                return (PinyinMatch.match(name, input) || code.indexOf(input.toUpperCase()) !== -1) && (this._total[code].type !== type.toUpperCase())
            })
        } else {
            return this._searchMap.filter((o) => {
                const [code, name] = o.split(':');
                return (PinyinMatch.match(name, input) || code.indexOf(input.toUpperCase()) !== -1) && (this._total[code].type === type.toUpperCase())
            })
        }
    }

    /**
     * 登录回调,用于处理自选数组和手续费缓存
     * @private
     */
    _loginCallback() {
        if (EVENT.Account.isLogin) {
            Favor.init(this._total);
            this._getItemDetail(Alpha.getList());
            this._getTradeList(Alpha.getList());
        } else {
            Favor.clearDb();
        }
    }

    /**
     * 获取商品合约
     * @param {Array} code
     * @param {Object} [options]
     * @param {Boolean} [options.retry]
     * @param {Boolean} [options.init]
     * @memberof Contract
     */
    _getItemDetail(code, options) {
        if (code.length === 0) return;
        code = code.unique();
        if (options && options.init) {
            const test = code.filter((c) => this._total[c] !== undefined && this._total[c].shouldUpdateInit());
            if (test.length === code.length) Alpha.getStrap();
        }
        if (EVENT.Account.isLogin) {
            this._getTradeList(code, options && options.retry)
        }
        const compared = code.filter((c) => this._total[c] !== undefined && this._total[c].shouldUpdate());
        if (compared.length === 0){
            Alpha.update();
            return;
        }
        this._setItemDetailUpdating(compared);

        Req({
            url: '/api/trade/commodity/tradeList',
            data: {
                code: compared.join(';')
            }
        }).then(({data}) => {
            for (let o of compared) {
                if (data[o]&&data[o].contractCode) {
                    this._totalMap[data[o].contractCode] = o;
                    this._total[o].setData(data[o]);
                }
            }
            Alpha.update();
            EVENT.Quote._init();
            EVENT.Quote._wakeUp('update');
        })
        .catch(() => {
            this._setItemDetailFailed(code);
            this._getItemDetail(code, {retry: true})
        })
    }

    _setItemDetailUpdating(arr) {
        for (let o of arr) {
            this._total[o]._contractUpdating = true;
        }
    }

    _setItemDetailFailed(arr) {
        for (let o of arr) {
            this._total[o]._contractUpdating = false;
        }
    }

    /**
     * 获取手续费
     * @param {Array} code
     * @param {Boolean} [retry]
     * @memberof Contract
     */
    _getTradeList(code, retry) {
        if (code.length === 0) return;
        if (retry) {
            this._setItemTradeFailed(code);
        }
        const compared = code.filter((c) => this._total[c] !== undefined && this._total[c].shouldUpdateTrade());
        if (compared.length === 0) return;
        this._setItemTradeUpdating(compared);
        Req({
            url: '/api/trade/commodity/chargeUnit',
            data: {
                code: compared.join(';')
            }
        }).then(({data}) => {
            for (let o of compared) {
                this._total[o].setTrade(data[o]);
            }
        }).catch(() => {
            //再说
            this._setItemTradeFailed(compared);
        })
    }

    _setItemTradeUpdating(arr) {
        for (let o of arr) {
            this._total[o]._tradeUpdating = true;
        }
    }

    _setItemTradeFailed(arr) {
        for (let o of arr) {
            this._total[o]._tradeUpdating = false;
        }
    }

    _error(where, what) {
        console.warn(`Contracts,${where}发生错误${what}`)
    }
}