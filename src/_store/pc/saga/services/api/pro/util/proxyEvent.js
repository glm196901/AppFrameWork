import _bank from '../event/bank'
import _account from '../event/account'


const proxyConfig = {
    Bank: _bank,
    Account: _account
};


const proxyEvent = (event, config) => {
    return new Proxy(event, {
        get: function (target, key, description) {
            if (!config[key]) return target[key];
            const eventName = config[key];
            const goal = proxyConfig[eventName];
            if (typeof goal[key] === "function") console.warn(`${config._scope}对象下的${key}方法已迁移至${config[key]}对象,为保证项目后期正常迭代，请使用${config._scope}对象获取该方法 `);
            if (typeof goal[key] !== "function") console.warn(`${config._scope}对象下的${key}属性已迁移至${config[key]}对象,为保证项目后期正常迭代，请使用${config._scope}对象获取该方法 `);
            return goal[key]
        },
        set: function (target, key, value) {

            if (!config[key]) {
                target[key] = value
            } else {
                const eventName = config[key]
                const goal = proxyConfig[eventName]
                goal[key] = value
            }

            return true

        }
    });

}

export default proxyEvent;