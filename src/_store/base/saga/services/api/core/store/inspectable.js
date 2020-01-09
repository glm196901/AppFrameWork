import manager from './dependenceManager';

let obIDCounter = 0;
class Inspectable {
    /**
     * 全局唯一 id
     * @type {String}
     */
    uuid = '';
    /**
     * 真实值
     * @type {null}
     */
    value = null;
    constructor(v) {
        this.uuid = `anti-${++obIDCounter}`;
        this.value = v;
    }

    get() {
        manager._setTarget(this.uuid);
        return this.value;
    }

    set(v) {
        let move = false;
        if(this.value !== null){
            move = true;
        }
        this.value = v;
        if(move){
            manager.trigger(this.uuid);
        }
    }

    /**
     * 手动触发依赖
     */
    trigger() {
        manager.trigger(this.uuid);
    }
}

export default Inspectable;