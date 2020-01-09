import {Req} from "../network/Req";
import Data from "../contract/data";
import { EVENT } from ".";
export default {
    /**持仓数据 */
    positionData:[],
    /**返回持仓数据 */
    getPositionData(){
        return this.positionData;
    },
    /**结算列表 */
    settlementList:[],
    /**获取结算列表 */
    getSettlement(){
        return this.settlementList;
    },
    income : 0,
    _keepUpdate : null,
    _timer:false,
    /**获取结算列表接口 */
    updateSettlementList(simulate){
        return new Promise (async (resolve,reject)=>{
            try {
                let {data} = await Req({
                    url: '/api/trade/scheme.htm',
                    data: {
                        schemeSort: 2,
                        tradeType: simulate ? 2 : 1,
                        //beginTime: '',
                        _: new Date().getTime()
                    },
                    animate: true
                });
                this.settlementList = data;
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    },
    /**更新持仓数据接口 */
    updatePosition({simulate,animate}){
        return new Promise(async(resolve,reject)=>{
            try {
                let {data} = await Req({
                    url: '/api/trade/scheme.htm',
                    data: {
                        schemeSort: 1,
                        tradeType: simulate ? 2 : 1,
                        beginTime: '',
                        _: new Date().getTime(),
                    },
                    animate: animate
                });

                if (data) {
                    // this.positionData = data
                    this.dealPosition(data);
                }
                resolve();
            } catch (error) {
                reject(error);
            } 
        });
    },
    dealPosition(data) {
        let quote, scheme;
        let income = 0;
        let position = data.map((e) => {
            quote = Data.total[e.contract];
            scheme = EVENT.Account.tradeList[e.contract];
            if (quote) {
                e.unit = scheme.priceUnit.mul(scheme.priceChange).mul(e.moneyType === 0 ? 1 : 0.1);
                e.current = Number(quote.price) || 0;
                if (!!quote.price && !!e.opPrice) {
                    if (e.isBuy) {
                        e.income = e.current.sub(e.opPrice).mul(e.volume).mul(scheme.priceUnit).mul(e.moneyType === 0 ? 1 : 0.1);
                    } else {
                        e.income = e.opPrice.sub(e.current).mul(e.volume).mul(scheme.priceUnit).mul(e.moneyType === 0 ? 1 : 0.1);
                    }
                    income = income.add(e.income);
                    return e;
                } else {
                    e.income = 0;
                    return e;
                }
            } else {
                return null;
            }
        });
        position.remove(null);
        if (position.findIndex((e) => e === null) === -1) {
            // this.setState({list: position, income: income},()=>console.log(this.state.list));
            this.income = income;
            this.positionData = position;
        }
    },
    closeTimer(){
        clearTimeout(this._timer);
        this._timer = null;
    }
}