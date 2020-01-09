import compile from '../../pro/state';

export const STORE = {
    STATE: Object.assign({}, compile),
    _store: {},
    _wake: {},
    _complex: [],
    _bridge(status, depend) {
        const substitute = this;
        if (status) {
            return {
                emitter(callback) {
                    callback()
                }
            }
        } else {
            return {
                emitter(callback) {
                    if (depend.length === 1) {
                        substitute._wake[depend[0]].push(callback)
                    } else {
                        substitute._complex.push({depend, callback})
                    }
                }
            }
        }
    },
    _wakeComplex() {
        let i = this._complex.length;
        while (i--) {
            const {depend, callback} = this._complex[i];
            if (depend.every((e) => this._store[e] === true)) {
                callback();
                this._complex.splice(i, 1)
            }
        }
    },
    listener() {
        const args = [...arguments];
        const result = args.every((e) => this._store[e] === true);
        return this._bridge(result, args)
    },
    empower(target, param, index) {
        this._store[index] = false;
        this._wake[index] = [];
        const substitute = this;
        let init = false;
        Object.defineProperty(target, param, {
            get(){
              return init;
            },
            set(value) {
                init = value;
                if (value === true) {
                    substitute._store[index] = true;
                    let i = substitute._wake[index].length;
                    while (i--) {
                        substitute._wake[index][i]();
                        substitute._wake[index].splice(i, 1)
                    }
                    substitute._wakeComplex();
                }
            }
        });
        return target
    }
};