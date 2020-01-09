// 判断是否是字符串
export const isString = (str: string): boolean => typeof str === 'string';

export function queryStringfy(object: string): string | never {
  let arr = [];
  for (let [key, value] of Object.entries(object)) {
    arr.push(`${key}=${value}`);
  }
  return '?' + arr.join('&');
}
