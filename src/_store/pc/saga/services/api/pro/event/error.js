let Alert = null;
export default {
    /**
     * @param {any} err
     * @param {Boolean} [focus] 是否强制弹出错误提示
     */
    throw(err,focus){
        let target = err;
        let msg = target;
        if(typeof err === 'object' && err !== null){
            if(err.error !== undefined){
                target = err.error
            }
            if(target !== null){
                msg = target.message  || (target && JSON.stringify(target));
            }
            console.warn(err);
        }
        if(target === null|| msg === '请求超时'){
            console.warn(msg);
        }else{
            if(Alert && ((err && err.animate ) || typeof err === 'string' || focus)){
                Alert(msg);

            }else{
                console.warn(msg)

            }
        }

    },
    setAlert(func){
        if(typeof func === 'function'){
            Alert = func;
        }
    },
    reload(){
        if(window && window.location && window.location.reload){
            window.location.reload();
        }
    },
    PROMISE(msg,index){
        return new Promise((resolve,reject)=>{
            reject(msg,index)

        })
    }
}