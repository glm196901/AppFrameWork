import {Jsonp} from "../network/Jsonp";
import Data from "./data";

export default class Custom extends Data{
    constructor(customize){
        super();
        this.name = 'Custom';
        this._format = customize;
    }

    _inquiryAll() {
        if (this._strap !== '') {
            Jsonp({
                url: '/customize.jsp',
                type: 'POST',
                data: {
                    callback: '?',
                    code: this._strap,
                    customize: `code,${this._format}`
                },
                timeout: 4000
            }).then((res)=>{
                this._callback(res)
            }).catch(() => {
                setTimeout(() => this._inquiryAll(), 4000)
            })
        } else {
            this.createStrap();
            setTimeout(()=> this._inquiryAll(),1000)
        }
    }
}