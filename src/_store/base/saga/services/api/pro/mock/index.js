// import fetchMock from 'fetch-mock';
//
// fetchMock.config.fallbackToNetwork = true;
//
// fetchMock.get('/api/trade/commodity/initial', function (a, b, c) {
//     return {
//         code: 200,
//         resultMsg: "",
//         contracts: ["SHA601366:农业银行","SHA601398:工商银行", "SHE000001:平安银行", "GC:美黄金","CL:美原油"],
//         quoteDomain: "7CDDCAA381A76997F297DE529954EE80EC55199A094C9A60FA2E1C70EC316643625B26C4C399A8E9313001EDA30EA85D17D8A6FE0AC87454AAD29A723248DB76545E1D3DC444EFCAC8C91C2F81410939E05626B7A99FC9FF8FAAE553FBD58DC10DB247508AC4DC06DEB62AEF874470B2",
//         group: [
//             {
//                 name: "美盘",
//                 list: "CL;GC"
//             },
//             {
//                 name: "上证",
//                 list: "SHA601398;SHE000001"
//             },
//             {
//                 name: "推荐",
//                 list: "SHA601398"
//             }
//         ],
//         time: new Date().getTime()
//     };
// });
//
// fetchMock.mock(RegExp('/api/trade/commodity/tradeList'), (data) => {
//
//     let params = data.replace('&', '');
//     params = params.split('=')[1];
//     let codeArray = params.split(';');
//
//     let tempArray = {};
//     for (let i = 0; i < codeArray.length; i++) {
//
//         const element = codeArray[i];
//
//         if (!element) {
//             continue
//         }
//
//         let obj = {
//             name: "美原油" + element,
//             code: element,
//             commodityId: "10016",
//             contractCode: element + "1909",
//             currency: "USD",
//             foreign: true,
//             range: false,
//             remark: "单点价格1000美元，汇率7",
//             spread: 0,
//             valid: true,
//             coins: false,
//             closeTime: [1564001700000],
//             depositList: [1050, 1540, 2100, 3080],
//             stopLossList: [-1050, -1540, -2100, -3080],
//             stopProfitList: [5250, 7700, 10500, 15400],
//             volumeList: [1, 2, 3, 5, 8, 10, 20],
//             exchange: "纽交所",
//             exgRate: 7,
//             moneyTypeList: [0, 1],
//             offset: 0,
//             priceChange: 0.01,
//             priceDigit: 2,
//             priceOriginal: 1000,
//             priceUnit: 7000,
//             amClearingTime: "11:59:59",
//             amCloseTime: "11:59:59",
//             amOpenTime: "06:00:00",
//             amTradeTime: "06:00:00",
//             amWarningTime: "11:59:59",
//             niteClearingTime: "04:55:00",
//             niteCloseTime: "05:00:00",
//             niteOpenTime: "00:00:00",
//             niteTradeTime: "00:00:00",
//             niteWarningTime: "04:50:00",
//             pmClearingTime: "23:59:59",
//             pmCloseTime: "23:59:59",
//             pmOpenTime: "12:00:00",
//             pmTradeTime: "12:00:00",
//             pmWarningTime: "23:59:59",
//             holiday: "2019-04-19 06:00:00,2019-04-20 05:00:00;2019-01-01 07:00:00,2019-01-02 06:00:00",
//         };
//         tempArray[obj.code] = obj;
//     }
//     return {
//         code: 200,
//         resultMsg: "",
//         contracts: tempArray
//     }
//
// })
//
// fetchMock.mock(RegExp('/api/trade/commodity/chargeUnit'), (data) => {
//     let params = data.replace('&', '')
//     params = params.split('=')[1];
//     let codeArray = params.split(';');
//
//     let temp = {}
//
//     for (let i = 0; i < codeArray.length; i++) {
//         const element = codeArray[i];
//
//         if (!element) {
//             continue
//         }
//
//         temp[element] = {
//             chargeCoinList: [],
//             chargeUnit: 158,
//             chargeUnitList: [158]
//         }
//     }
//
//     return {
//         code: 0,
//         resultMsg: "",
//         contracts: temp
//     }
// });