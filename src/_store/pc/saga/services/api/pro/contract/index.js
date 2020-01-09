import _contracts from './contracts';
import _data from './data';
import _custom  from './custom';
import _quote from './quote';
import {STORE} from "../../core/store/state";
import {Alpha} from "./alpha";
import {develop} from "../../lib/trace";

let customize = false;
let Contracts, Data, Quote;
Contracts = STORE.empower(new _contracts(), 'initial', STORE.STATE.CONTRACTS);
Data = process.env.bid ? new _custom('isUp,price,prev,buyPrice,sellPrice') :  new _data();
// Data = new _custom('isUp,price,prev,buyPrice,sellPrice');
Quote = new _quote();
Alpha.init(Contracts, Data, Quote);

export function setDataCustomize(format) {
    customize = format;
}
window.Alpha = Alpha
export function init(prepare) {
    if (prepare && typeof prepare === 'function') {
        prepare();
    }
    if(customize !== false){
        Data = new _custom(customize);
        Alpha.init(Contracts, Data, Quote);
    }
    develop(Contracts);
    develop(Data);
    develop(Quote);

    Contracts.init(() => {
        Data.init(Contracts);
        Quote.init(Contracts);
    });
}

export {
    Contracts,
    Data,
    Quote,
}
