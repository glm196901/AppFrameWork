/**
 * 验证数据安全性
 * @param val
 * @returns {boolean}
 */
export function safeValue(val) {
    return val !== undefined && val !== null;
}