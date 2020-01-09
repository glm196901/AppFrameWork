import {Req} from "./Req";
import {decodeFromWeb} from "./encrypt";
import {Chart} from "../chartTV/chart";
import {ChartIQ} from "../chartiq/chartIQ";

let jsonList =[];
let updateRefresh = false;
let tryList = 0;
export function JsonListMerge(arr) {
    jsonList = jsonList.concat(arr);
    jsonList = jsonList.unique();
}

export function RefreshQuoteList(arr,callback) {
    jsonList = arr;
    tryList = 0;
    updateRefresh = true;
    callback(jsonList[0])
}

export async function Jsonp({url, type, data, timeout}) {
    return new Promise(async (resolve, reject) => {
        let isAbort = false;
        let abort = setTimeout(() => {
            isAbort = true;
            if(!updateRefresh){
                tryList++;
                if (tryList > jsonList.length - 1){
                    tryList = 0;
                    getRenewal();
                }
            }else{
                updateRefresh = false
            }

            reject(null);
        }, timeout || 6000);
        let quote = null;
        try {
            url = url || '';

            let str = '';
            if (!!data) {
                str = '?';
                for (let [n, v] of Object.entries(data)) {
                    str += `${n}=${v}&`
                }
            }
            type = type || 'GET';
            const quoteAddress = jsonList[tryList];
            Chart._refreshQuoteList(quoteAddress);
            ChartIQ._refreshQuoteList(quoteAddress);
            const res = await fetch(`${quoteAddress}${url}${str}`, {
                method: type,
                cors: true
            });
            if (res.status !== 200) throw res;
            let body = await res.text();
            body = body.match(/data:'([\s\S]+)'/);
            if (body !== null && body.length > 0) {
                [, quote] = body;
                quote = quote.split(';');
                quote = quote.map((e) => e.split(','));
            } else {
                quote = [];
            }
        } catch (err) {
            console.warn(err);
            quote = null;
        }

        if (!isAbort) {
            clearTimeout(abort);
            if (quote) {
                resolve(quote)
            } else {
                if(!updateRefresh){
                    tryList++;
                    if (tryList > jsonList.length - 1){
                        tryList = 0;
                        getRenewal();
                    }
                }else{
                    updateRefresh = false;
                }
                reject(null)
            }
        }
    });
}

export function getRenewal() {
    Req({
        url:'/api/index.htm',
        data:{
            action:'getQuoteDomain'
        }
    }).then(({quoteDomain:res})=>{
        const arr = decodeFromWeb(res).split(';');
        if(arr.length > 0){
            RefreshQuoteList(arr,(cb)=>{
                Chart._refreshQuoteList(cb);
                ChartIQ._refreshQuoteList(cb);
            });

        }
    }).catch((err)=>{
        console.warn(err);
    });
}