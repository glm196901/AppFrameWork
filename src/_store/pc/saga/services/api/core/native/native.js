let store = {};
let RQ = 0;

function postMessage(data) {
    RQ++;
    data.req = `RQ${RQ}`;
    window.postMessage(JSON.stringify(data),'*')
}

export function nativeCallback({data}) {
    data = JSON.parse(data);
    store[data.req](data);
    delete store[data.req];
}

export function TouchIDSupport() {
    postMessage({
        cmd:'TouchIDSupport'
    });
    return new Promise((resolve,reject)=>{
        store[`RQ${RQ}`] = function (data) {
            if(data.code === 200){
                resolve(data.data);
            }else{
                reject(data.data)
            }
        }
    })
}

export function TouchIDAuthenticate(data) {
    postMessage({
        cmd:'TouchIDAuthenticate',
        data:data
    });
    return new Promise((resolve,reject)=>{
        store[`RQ${RQ}`] = function (data) {
            if(data.code === 200){
                resolve(data.data);
            }else{
                reject(data.code)
            }
        }
    })
}

export function GetDeviceInfo() {
    postMessage({
        cmd:'GetDeviceInfo'
    });
    return new Promise((resolve,reject)=>{
        store[`RQ${RQ}`] = function (data) {
            resolve(data.data)
        }
    })
}

export function LinkTo(url) {
    postMessage({
        cmd:'Link',
        data:{
            url:url
        }
    });
    return new Promise((resolve,reject)=>{
        store[`RQ${RQ}`] = function (data) {
            if(data.code === 200){
                resolve();
            }else{
                reject()
            }
        }
    })
}

export function GetCluster() {
    postMessage({
        cmd:'GetCluster'
    });
    return new Promise((resolve,reject)=>{
        store[`RQ${RQ}`] = function (data) {
            if(data.code === 200){
                resolve(data.data)
            }else{
                reject()
            }
        }
    })
}

export function collectInfo({mobile,name}) {
    const o = {mobile};
    if(name) o.name = name;
    postMessage({
        cmd:'collectInfo',
        data:o
    });
    return new Promise((resolve,reject)=>{
        store[`RQ${RQ}`] = function (data) {
            if(data.code === 200){
                resolve()
            }else{
                reject()
            }
        }
    })
}