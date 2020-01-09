let tempUuid = null;
const manager = {
    _store: {},
    _setTarget(uuid) {
        tempUuid = uuid;
    },
    _addEventListener(target, event, scope) {
        this._store[target] = this._store[target] || [];
        if (!this._hasWatcher(target, scope, event)) {
            this._store[target].push({target: scope, callback: event})
        }
    },
    _addWatcher(target, name, event, scope) {
        let useless = target[name];
        if (useless !== undefined) {
            this._store[tempUuid] = this._store[tempUuid] || [];
            if (!this._hasWatcher(tempUuid, scope, event)) {
                this._store[tempUuid].push({target: scope, callback: event})
            }
        }
        tempUuid = null;
    },
    _hasWatcher(uuid, scope, event) {
        if (!this._store[uuid]) return false;
        for (let {target, callback} of this._store[uuid]) {
            if (target === scope && callback === event) {
                return true;
            }
        }
        return false;
    },
    trigger(uuid) {
        if (this._store[uuid]) {
            for (let {target, callback} of this._store[uuid]) {
                callback.call(target);
            }
        }
    },
    dispatch(tag, data) {
        if (this._store[tag]) {
            for (let i = this._store[tag].length - 1; i >= 0; i--) {
                const {target, callback} = this._store[tag][i];
                if (typeof target === 'string') {
                    callback(data);
                } else {
                    callback.call(target, data);
                }
            }
        }
    },
    clearListener(tag, scope) {
        if (this._store === undefined)
            return;

        if (!!this._store[tag] && this._store[tag].length > 0) {
            for (let i = 0; i < this._store[tag].length;) {
                let {target} = this._store[tag][i];
                if (target === scope) {
                    this._store[tag].splice(i, 1)
                } else {
                    i++
                }
            }
        }
    },
    clearWatcher(target) {
        for (let [, arr] of Object.entries(this._store)) {
            if (!!arr) {
                for (let i = 0; i < arr.length;) {
                    let selListener = arr[i];
                    if (selListener.target === target) {
                        arr.splice(i, 1);
                    } else {
                        i++
                    }
                }
            }
        }
    }
};

export default manager;