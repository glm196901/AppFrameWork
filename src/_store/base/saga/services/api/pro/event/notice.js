import {Req} from "../network/Req";
export default {
    notice:null,
    /**
     * @description 将于2019-04-03废弃
     * @deprecated
     * @returns {Promise<any>}
     */
    async updateNotice(){
        return new Promise(async (resolve,reject)=>{
            try {
                const result = await Req({
                    url: '/api/discover/index.htm',
                    type: 'GET',
                    animate: true
                });
                this.notice = result.notices;
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },
}