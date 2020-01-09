
import {Req} from "../network/Req";
export default {
    async updateConversation(){
        return new Promise(async (resolve,reject)=>{
            try {
                const result = await Req({
                    url: 'api/home/kefu.htm',
                    type: 'GET',
                    data: {
                        action: 'more',
                        size: 50,
                        _: new Date()
                    },
                    animate: false
                });
                this.Conversation = result.data;
                resolve(result)
            } catch (error) {
                reject(error)
            }
        })
    },
    async updateSendInfo(info, animate = true){
        return new Promise(async (resolve,reject)=>{
            try {
                const result = await Req({
                    url: 'api/home/kefu.htm',
                    type: 'POST',
                    data: {
                        action: 'send',
                        content: info
                    },
                    animate: animate
                });
                resolve()
            } catch (error) {
                reject(error)
            }
        })
    },
    Conversation:[]
}