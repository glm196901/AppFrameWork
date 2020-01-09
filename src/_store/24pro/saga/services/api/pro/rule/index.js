import alias from './alias';
import common from './public';

export const RULE = {
    initial: false,
    online: false,
    public: {},
    list: {},
    alias(name) {
        return alias[name] || name;
    },
    getRule(code) {
        return new Promise(async (resolve) => {
            if (this.initial) return resolve(this.list[code]);
            const branch = this.alias(process.env.BRANCH);
            let chargeUnit;
            if (this.online) {

            } else {
                const o = await import(/* webpackChunkName: "rule" */'./branch/' + branch);
                chargeUnit = o.default;
            }
            Object.keys(chargeUnit).forEach((c)=>{
                if(common[c] && chargeUnit[c]){
                    this.list[c] = Object.assign(common[c],{chargeUnit:chargeUnit[c]})
                }
            });
            this.initial = true;
            resolve(this.list[code])
        });
    }
};