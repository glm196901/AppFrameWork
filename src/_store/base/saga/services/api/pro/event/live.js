import {
    Req
} from "../network/Req";

export default {
    list: [],
    _getList() {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: '/api/back/liveList'
                });
                this.list = result.msg;
            } catch (error) {
                console.warn(error)
            } finally {
                resolve()
            }
        })
    },
    loop: null,
    ticker: 2,
    getUpdate(callback) {
        this._getList().then(() => {
            callback();
            this.loop = setTimeout(() => {
                this.getUpdate(callback)
            }, this.ticker * 1000)
        })
    },
    stopLoop() {
        clearTimeout(this.loop);
    },
    getDetail(account) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: `/api/back/liveInfo/${account}`,
                });
                resolve(result.msg);
            } catch (error) {
                reject(error)
            }
        })
    },
    getQuestions(sid) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Req({
                    url: `/api/back/scheduleInfo/${sid}`,
                });
                resolve(result.msg);
            } catch (error) {
                reject(error)
            }
        })
    }
}