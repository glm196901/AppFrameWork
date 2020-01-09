/**
 *@author wilde create at 2019/5/27 5:53 PM
 */
/**
 *
 * @param event
 * @param mapping
 * @param map
 * @returns {object}
 */
// export function agentForMigrate(event, mapping, map) {
//     return new Proxy(event, {
//         get(target, key) {
//             if (mapping[key] === undefined) return target[key];
//             const file = mapping[key];
//             const instance = map[file];
//             console.warn(`${mapping._scope}对象下的${key}${typeof instance === 'function' ? '方法' : '属性'}已迁移至${file}对象,为保证项目后期正常迭代,请使用${file}对象获取该方法`);
//             return instance[key];
//         },
//         set(target, key, value) {
//             if (mapping[key] === undefined) {
//                 target[key] = value;
//             } else {
//                 const instance = map[mapping[key]];
//                 if (typeof instance !== 'function') instance[key] = value;
//             }
//             return true;
//         }
//     })
// }
//
// export function agentForDeprecated(target,recycling,instead) {
//     return new Proxy(target,{
//         get(target,key){
//             const find = recycling.findIndex((e)=>e === key);
//             if(find !== -1){
//                 console.warn('%s 属性已弃用,请及时更换替代属性 %s',key,instead[find]);
//                 return target[instead[find]];
//             }else{
//                 return target[key];
//             }
//         }
//     })
// }