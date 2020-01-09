import {exposure} from "../../core/store";
import LoadingAnimate from "./loading";

export async function Req({url, type, data, ignore, animate, timeout}) {
    return new Promise(async (resolve, reject) => {
        let isAbort = false;
        let abort = setTimeout(() => {
            if (!!animate) exposure('loadingEnd');
            isAbort = true;
            // test();
            if (!animate) {
                reject(null);
            } else {
                reject('请求超时');
            }
        }, timeout * 1000 || 6000);
        let body;
        let error;

        try {
            if (!!animate) {
                LoadingAnimate.insertLoading();
            }
            url = url || '';

            let str = '';
            if (!!data) {
                str = '?';
                for (let [n, v] of Object.entries(data)) {
                    str += `${n}=${v}&`
                }
            }
            if (str === '?') str = '';
            type = type || 'GET';
            const res = await fetch(`${url}${str}`, {
                method: type,
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            if (res.status !== 200) throw res;
            if (res._bodyText === undefined || res._bodyText.indexOf('!doctype html') === -1) {
                body = await res.text();
                body = JSON.parse(body);
            } else {
                console.warn(res);
                throw 'unknown error';
            }
        } catch (err) {
            body = null;
            error = err;
        }

        if (!!animate) {
            exposure('loadingEnd');
        }
        if (!isAbort) {
            clearTimeout(abort);
            if (ignore === true) {
                resolve(body);
            } else if (body !== null) {
                if (body.code === "200" || body.code === 200 || body.status === 200 || body.code === 0 || body.errorCode === 200 || body.errorCode === 0 || body.resultCode === 200 || body.resultCode === 0) {
                    resolve(body)
                } else {
                    reject({error: body, animate})
                }
            } else {
                reject({error: body, animate})
            }
        }
    })
}