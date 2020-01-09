import dependenceManager from './dependenceManager';
import Inspectable from './inspectable'

export function inspectable(target, name, descriptor) {
    let init = descriptor.initializer.call(target);
    if (typeof (init) === 'object') {
        return init;
    } else {
        let observable = new Inspectable(init);
        return {
            enumerable: true,
            configurable: true,
            get: function () {
                return observable.get()
            },
            set: function (v) {
                return observable.set(v)
            },
        }
    }
}

export function watcher(target, attr) {
    return (scope, name, descriptor) => {
        let oldValue = descriptor.value;
        descriptor.value = function () {
            dependenceManager._addWatcher(target, attr, descriptor.value, this);
            return oldValue.apply(this, arguments)
        };
    };
}



/**
 * 需要通过闭包的方式访问实例
 * 依赖Actor来移除监听
 * @param tag
 * @returns {function(*=, *, *)}
 */
export function listener(tag) {
    return (scope, name, descriptor) => {
        scope._storeListenerName(`${tag}:${name}`);
        dependenceManager._addEventListener(tag, descriptor.value, name)
    }
}

/**
 * 在不传入scope时请使用箭头函数书写方法
 * 传入watcher来根据一个具体的值来判断是否会进行一次性监听
 * 若要使用watcher请一定传入scope
 * @param {String} tag
 * @param {Function} event
 * @param {Component} [scope]
 * @param {*} [watcher]
 */
export function spy(tag, event, scope, watcher) {
    if (watcher === undefined) {
        dependenceManager._addEventListener(tag, event, scope)
    } else {
        if (watcher) {
            event.call(scope)
        } else {
            dependenceManager._addEventListener(tag, () => {
                event.call(scope);
                dependenceManager.clearListener(tag, scope)
            }, scope)
        }
    }
}

/**
 * 通过tag曝光被监听的事件
 * @param {String} tag
 * @param {*} [data]
 */
export function exposure(tag,data) {
    dependenceManager.dispatch(tag,data)
}

/**
 * 移除对应Component上所有的监听
 * @param scope
 */
export function pullout(scope) {
    dependenceManager.clearWatcher(scope)
}

/**
 * 通过tag和Component或uuid移除指定的监听
 * @param tag
 * @param scope
 */
export function pulloutTarget(tag,scope) {
    dependenceManager.clearListener(tag,scope)
}