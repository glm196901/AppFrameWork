import { put, select } from 'redux-saga/effects';
import SERVICES from '../services/index';
import { T, dispatch } from '@/_store';

// prettier-ignore
const ALL = 'LTCUSDT;EOSUSDT;NEOUSDT;ETHUSDT;XRPUSDT;DASHUSDT;ONTUSDT;BSVUSDT;BTCUSDT;ADAUSDT;BCHUSDT;XLMUSDT;ETCUSDT;NQ;YM;IC;DAX;MDAX;IF;NK;IH;HSI;MHI;RB;PP;CU;RU;NI;SR;SI;NG;CL;GC;HG';
// prettier-ignoreNQ;
const 股指 = 'NQ;YM;IC;DAX;MDAX;IF;NK;IH;HSI;MHI';
// prettier-ignore
const 期货 = 'SI;NG;CL;GC;HG;RB;PP;CU;RU;NI;SR';
// prettier-ignore
const 数字货币 = 'LTCUSDT;EOSUSDT;NEOUSDT;ETHUSDT;XRPUSDT;DASHUSDT;ONTUSDT;BSVUSDT;BTCUSDT;ADAUSDT;BCHUSDT;XLMUSDT;ETCUSDT';
// prettier-ignore
const 热门商品 = 'LTCUSDT;EOSUSDT;NEOUSDT;ETHUSDT;NQ;YM;HSI;MHI;SI;NG;CL;GC;';

// 初始化数据
export function* getInitData() {
  try {
    const { init, Alpha, EVENT } = yield SERVICES();
    yield new Promise(resolve => {
      init(() => {
        EVENT.Trade.setDigitalNotConvert();
        EVENT.Trade.setPartEagleDeduct(true);
        Alpha.setUseDefaultGroup(false);
        Alpha.setIndex('CL');
        Alpha.setGroup('期货', 期货.split(';'));
        Alpha.setGroup('股指', 股指.split(';'));
        Alpha.setGroup('数字货币', 数字货币.split(';'));
        Alpha.setGroup('热门商品', 热门商品.split(';'));
        Alpha.setGroup('ALL', ALL.split(';'));
        resolve();
      });
    });
    yield EVENT.Account.init();
    if (EVENT.Account.isLogin) {
      yield EVENT.Account.callback();
      const userInfo = yield EVENT.Account;
      yield put({
        type: T.SET_USER_INFO,
        payload: { ...userInfo, isLogin: EVENT.Account.isLogin }
      });
    } else {
      yield put({
        type: T.SET_USER_INFO,
        payload: { isLogin: EVENT.Account.isLogin }
      });
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

/**
 * 获取行情数据列表
 * 处理行情数据
 * 自动将休市排到最后
 * 映射自选
 * 数字货币不休市
 */
export function* getQuotesListData() {
  let flag = true;
  try {
    const { spy, Alpha, Contracts, Data } = yield SERVICES();
    while (true) {
      yield new Promise(resolve => {
        spy('contractsInitial', () => Data.start('getQuotesListData'), {}, Contracts.initial);
        spy('getQuotesListData', () => resolve());
      });
      try {
        const mapList = {}; // 转为对象键值对
        const list = Alpha.getGroup() || [];
        list.forEach(item => (mapList[item.name] = item.list));
        const { favorList = [] } = yield select();
        // 自选
        mapList['自选'] = mapList['ALL'].filter(item => favorList.includes(item.code));
        // 如果isopen为false 在继续是否数字货币
        for (let [key, value] of Object.entries(mapList)) {
          let list = value.map(item => ({
            ...item,
            isOpen: item.isOpen || item.id.includes('USDT')
          }));
          // 排序 休市的放在每个分组的最后
          list.sort(a => (a.isOpen || a.id.includes('USDT') ? -1 : 1));
          mapList[key] = list;
        }
        yield put({ type: T.SET_QUOTES_LIST_DATA, payload: mapList });
      } catch (error) {
        yield put({ type: T.SET_QUOTES_LIST_DATA, payload: {} });
      }
      if (flag) {
        flag = false;
        dispatch(T.DELETE_LOADING);
      }
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 关闭行情数据获取
export function* endQuotesListData() {
  try {
    const { Data } = yield SERVICES();
    Data.end('getQuotesListData');
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 获取 banner
export function* getBanner() {
  try {
    const { EVENT } = yield SERVICES();
    yield EVENT.Info.updateCarousel();
    yield put({ type: T.SET_BANNER_LIST_DATA, payload: EVENT.Info.homeBanner });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 获取公告
export function* getNotice() {
  try {
    const { EVENT } = yield SERVICES();
    yield EVENT.Info.updateCarousel();
    yield put({ type: T.SET_NOTICE_LIST_DATA, payload: EVENT.Info.getShortNotice() });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
/**
 * 获取新闻
 * @param type - 0 黄金 1 原油
 * date
 */
export function* getNews(action) {
  const { type, date } = action.payload;
  try {
    const { EVENT } = yield SERVICES();
    yield EVENT.Info.updateNews(type, date);
    const { news = [] } = yield select();
    yield put({ type: T.SET_NEWS_LIST_DATA, payload: [...news, ...EVENT.Info.newsList] });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
/**
 * 获取新闻详情
 * @param id - 新闻的id
 */
export function* getNewsDetail(action) {
  const { id } = action.payload;
  try {
    const { EVENT } = yield SERVICES();
    yield EVENT.Info.getNewsDetail(id);
    yield put({ type: T.SET_NEWS_DETAIL, payload: EVENT.Info.getNewsDetailObject() });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 删除首屏的loading
export function* deleteLoading() {
  try {
    const loading = yield document.querySelector('#page-loading');
    if (loading) {
      document.body.removeChild(loading);
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 关闭单个行情图详情数据
export function* endQuotesDetail() {
  try {
    const { Quote } = yield SERVICES();
    Quote.end();
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 关闭行情图chart
export function* endChart() {
  try {
    const { Chart } = yield SERVICES();
    Chart.exit();
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
/**
 * 获取商品详情
 * @param id - 商品id
 */
export function* productDetail(action) {
  try {
    const { id } = action.payload;
    const { Quote, spy } = yield SERVICES();
    yield Quote.start('productDetail', id);
    while (true) {
      const data = yield new Promise(resolve => {
        spy('productDetail', data => resolve(data));
      });
      yield put({ type: T.SET_PRODUCT_DETAIL, payload: data });
      const prevValue = data.settle_price_yes || data.close;
      let bool = data.price.sub(prevValue) >= 0;
      const { productIsupDown } = yield select();
      if (productIsupDown !== bool) {
        yield dispatch(T.SET_PRODUCT_IS_UP_DOWN, bool);
      }
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 关闭获取商品数据接口
export function* endProductDetail() {
  try {
    const { Quote } = yield SERVICES();
    yield Quote.end('productDetail');
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
/**
 * 获取商品属性描述
 * @param id - 商品id
 */
export function* productProps(action) {
  try {
    const { id } = action.payload;
    const { Contracts } = yield SERVICES();
    yield put({ type: T.SET_PRODUCT_PROPS, payload: Contracts._total[id] });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

/**
 * 切换商品走势
 * @param id - 商品id
 */
export function* switchProductDetail(action) {
  try {
    const { id } = action.payload;
    const { Quote } = yield SERVICES();
    yield Quote.switch(id);
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

/**
 * 获取快讯列表
 * @param id - 商品id
 */
export function* getFastNewsList(action) {
  try {
    const { id } = action.payload;
    const { EVENT } = yield SERVICES();
    yield EVENT.Info.updateLive(id);
    const data = yield EVENT.Info.lives;
    yield put({ type: T.SET_NEWS_FAET_LIST, payload: data });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

/**
 * 提交登录
 * @param {string} mobile 账号
 * @param {string} password 密码
 * @param {boolean} test 是否验证
 * @param {string} path 登录后要前往的地址
 */
export function* submitLogin(action) {
  try {
    const { EVENT } = yield SERVICES();
    const { mobile = '', password = '', test = false, to = '' } = yield action.payload;
    yield EVENT.Account.submit(mobile, password, test);
    const { routing } = yield select();
    // 如果成功运行此处
    yield put({ type: T.SET_USER_INFO, payload: { isLogin: true } });
    const history = yield routing.history;
    // 如果传参数过来 那么跳转指定的页面
    if (to) {
      yield history.replace(to);
    } else {
      yield history.goBack();
    }
    yield EVENT.Account.callback();
    const userInfo = yield EVENT.Account;
    yield put({ type: T.SET_USER_INFO, payload: { ...userInfo, isLogin: EVENT.Account.isLogin } });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
/**
 * 交易
 * order 关键判断 order为true 发起交易 false为计算
 * @param {number} volumeIndex - 手数
 * @param {number} stopLessIndex - 设置止损
 * @param {string} code - 合约号
 * @param {boolean} mock - 模拟
 * @param {boolean} isBuy - 买涨买跌
 * @param {boolean} order - 是否发起订单
 */
export function* submitTransaction(action) {
  const { callback } = action.payload;
  try {
    const { code, mock, isBuy, order = false } = action.payload;
    const { moneyType = 0, volumeIndex = 0, stopLessIndex = 0 } = action.payload;
    const { EVENT, spy, STORE } = yield SERVICES();
    yield callback({ loading: 'open' }); // 计算中
    yield new Promise(resolve => {
      spy('tradeInitial', () => resolve(), this, EVENT.Trade.initial);
    });
    // 参数 合约号 和 是否模拟
    const modal = yield EVENT.Trade.RFQ(code, { simulate: mock });
    // 设置圆角
    yield modal.swapMoneyType(moneyType);
    // 设置手数
    yield modal.swapVolume(volumeIndex);
    // 设置止损
    yield modal.swapStopLoss(stopLessIndex);
    // 计算
    yield new Promise((resolve, reject) => {
      try {
        STORE.listener(STORE.STATE.TRADE).emitter(() => {
          modal.whileUpdated(() => {
            const SHOW = modal.show();
            const charge = Number(SHOW.charge) === 0; // 计算为0的 不给通过
            dispatch(T.SET_TRANAACTION_MODAL, { SHOW });
            if (!charge) resolve();
          });
        });
      } catch (err) {
        /* eslint-disable no-console */
        console.error('计算出错了');
        reject(err);
      }
    });
    yield callback({ loading: 'closed' }); // 计算中完毕
    // 发起交易
    if (order) {
      try {
        yield modal.order(isBuy);
        yield callback({ status: 'ok' });
        yield EVENT.Account.getBasicUserInfo();
      } catch (err) {
        if (err.error.code === 401) {
          const { routing } = yield select();
          const history = yield routing.history;
          yield callback({ status: 401, msg: '登录已失效' });
          yield history.push({ pathname: '/login', state: { to: `/transaction/${code}/${mock}` } });
        } else {
          const msg = err.error.message || '服务器繁忙';
          yield callback({ status: 'error', msg });
        }
        yield EVENT.Account.getBasicUserInfo();
      }
    }
  } catch (err) {
    yield callback({ loading: 'closed' });
    try {
      const msg = err.error.message || '服务器繁忙';
      yield callback({ status: 'error', msg });
    } catch (error) {
      yield callback({ status: 'error', msg: '服务器繁忙' });
    }
  }
}
// 发送用注册短信验证码
export function* GetRegisterMessageCode(action) {
  try {
    const { mobile = '0', imageCode = '0000', test = true, callback } = yield action.payload;
    const { EVENT } = yield SERVICES();
    yield EVENT.Register.confirmCode(mobile, imageCode, test);
    callback({ status: 'ok' });
    yield window.Toast.success('验证码已发送', 1);
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 校验短信验证码
export function* verifyRegisterMessageCode(action) {
  try {
    const { messageCode = '0000', mobile, test = true, callback } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Register.verify(messageCode, mobile, test);
    callback({ status: 'ok' });
    yield window.Toast.success('通过验证', 1);
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 提交注册
export function* submitRegister(action) {
  try {
    const { nickName = '', password = '', to = '' } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Register.submit(nickName, password);
    yield window.Toast.success('注册成功', 1);
    yield EVENT.Register.callback();
    yield put({ type: T.SET_USER_INFO, payload: { isLogin: EVENT.Account.isLogin } });
    yield EVENT.Account.callback();
    const userInfo = yield EVENT.Account;
    yield put({ type: T.SET_USER_INFO, payload: { ...userInfo, isLogin: EVENT.Account.isLogin } });
    const { routing } = yield select();
    const history = yield routing.history;
    // 如果传参数过来 那么跳转指定的页面
    if (to) {
      yield history.replace(to);
    } else {
      yield history.goBack();
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 修改手机号发送短信验证码 先解绑然后再绑定新手机号
// step === 1 解除绑定发送短信验证码
// step === 0 || 不传 绑定新手机时候发送验证码
export function* changePhoneNumberGetMessageCode(action) {
  try {
    const { step = 0, phoneNumber, imageCode, callback } = yield action.payload;
    const { EVENT } = yield SERVICES();
    yield EVENT.Password.confirmCode(step, phoneNumber, imageCode);
    callback({ status: 'ok' });
    yield window.Toast.success('验证码已发送', 1);
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 修改手机号
// 修改手机号发送短信验证码 先解绑然后再绑定新手机号
// type === 1 验证解除绑定手机号短信验证码是否填写正确
// type === 2 验证新手机号发送短信验证码是否正确
export function* changePhoneNumber(action) {
  try {
    const { mobile, smsCode, type, callback } = yield action.payload;
    const { EVENT } = yield SERVICES();
    yield EVENT.Password.verifySMSCode(mobile, smsCode, type);
    if (type === 1) {
      callback({ status: 'ok' });
      yield window.Toast.success('解绑成功', 1);
    } else {
      yield EVENT.Account.callback();
      // 如果传参数过来 那么跳转指定的页面
      callback({ status: 'ok' });
      const { routing } = yield select();
      const history = yield routing.history;
      yield history.goBack();
      yield window.Toast.success('手机号绑定成功', 1);
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 退出登录
export function* outLogin() {
  try {
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.setLogout();
    const userInfo = yield EVENT.Account;
    yield put({ type: T.SET_USER_INFO, payload: { ...userInfo, isLogin: EVENT.Account.isLogin } });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 获取资金明细列表
/**
 * 充值提款 1
 * 交易明细 2
 * 推广佣金 3
 * XDC明细 4
 * @param {string | number}  type - 获取的类型
 * @param {string | number}  id - 分页 获取最后一条的id返回新的一页 拼接
 */
export function* getFundList(action) {
  try {
    const { type, id } = yield action.payload;
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.getRecord(type, id);
    const { userInfo } = yield select();
    if (type === 1) {
      const transferRecordList = yield EVENT.Account.transferRecordList;
      yield put({
        type: T.SET_USER_INFO,
        payload: {
          funds: {
            ...userInfo.funds,
            transferRecordList: id
              ? [...userInfo.funds.transferRecordList, ...transferRecordList]
              : transferRecordList
          }
        }
      });
    }
    if (type === 2) {
      const transactionRecordList = yield EVENT.Account.transactionRecordList;
      yield put({
        type: T.SET_USER_INFO,
        payload: {
          funds: {
            ...userInfo.funds,
            transactionRecordList: id
              ? [...userInfo.funds.transactionRecordList, ...transactionRecordList]
              : transactionRecordList
          }
        }
      });
    }
    if (type === 3) {
      const commissionRecordList = yield EVENT.Account.commissionRecordList;
      yield put({
        type: T.SET_USER_INFO,
        payload: {
          funds: {
            ...userInfo.funds,
            commissionRecordList: id
              ? [...userInfo.funds.commissionRecordList, ...commissionRecordList]
              : commissionRecordList
          }
        }
      });
    }
    if (type === 4) {
      const eagleRecordList = yield EVENT.Account.eagleRecordList;
      yield put({
        type: T.SET_USER_INFO,
        payload: {
          funds: {
            ...userInfo.funds,
            eagleRecordList: id
              ? [...userInfo.funds.eagleRecordList, ...eagleRecordList]
              : eagleRecordList
          }
        }
      });
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 获取资金明细详情
/**
 *  @param {string | number}  id - 分页 获取最后一条的id返回新的一页 拼接
 */
export function* getFundDetail(action) {
  try {
    const { id } = yield action.payload;
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.getRecordDetail(id);
    yield put({
      type: T.SET_USER_INFO,
      payload: {
        fundDetail: EVENT.Account.fundDetailData
      }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 获取持仓数据
export function* getPositionsData(action) {
  try {
    const { EVENT, spy } = yield SERVICES();
    // 如果存在 关闭之前的
    if (window.INVENTORY) yield window.INVENTORY.destroy();
    const { mock = true } = yield action.payload || {};
    yield new Promise(resolve => spy('tradeInitial', () => resolve(), this, EVENT.Trade.initial));
    window.INVENTORY = yield EVENT.Trade.INVENTORY({ simulate: mock });
    while (true) {
      yield new Promise(resolve => spy('positionUpdate', () => resolve()));
      let { data, total } = yield window.INVENTORY.getStatistics(window.INVENTORY.simulate);
      yield put({
        type: T.SET_POSITIONS_DATA,
        payload: {
          positionList: data.concat(),
          total: total
        }
      });
      yield dispatch(T.SET_PRODUCT_IS_UP_DOWN, total >= 0);
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 关闭持仓数据
export function* endPostionData() {
  try {
    yield window.INVENTORY.destroy();
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 切换持仓数据
export function* swtichPostionData(action) {
  try {
    const { mock = true } = yield action.payload || {};
    yield window.INVENTORY.swapSimulate(mock);
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 平仓
export function* closePostion(action) {
  try {
    const { id = null, mock } = yield action.payload || {};
    console.log('打印: function*closePostion -> mock', mock);
    yield window.INVENTORY.close(id);
    yield window.Alert('提示', '卖出委托已提交');
    yield put({ type: T.GET_POSITIONS_RESULT_LIST, payload: { mock } });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 一键平仓 所有
export function* closePostionAll(action) {
  try {
    const { mock } = yield action.payload || {};
    const response = yield window.INVENTORY.closeAll(mock);
    const msg = yield `${response.message},成功${response.successNumber}单,失败${response.failNumber}单`;
    yield window.Alert('提示', msg);
    yield put({ type: T.GET_POSITIONS_RESULT_LIST, payload: { mock } });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 获取结算列表
export function* getPositonResultsList(action) {
  try {
    const { mock } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Position.updateSettlementList(!!mock);
    const settlementList = yield EVENT.Position.getSettlement();
    yield put({
      type: T.SET_POSITIONS_DATA,
      payload: {
        resultList: settlementList
      }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 修改登录密码
/**
 * @param { string } oldPassWord - 获取的类型
 * @param { string } newPassWord - 获取的类型
 * @param { string } newPassWordComfirmation- 获取的类型
 */
export function* changeLoginPassword(action) {
  try {
    const {
      oldPassWord = '',
      newPassWord = '',
      newPassWordComfirmation = ''
    } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Password.changePassword(oldPassWord, newPassWord, newPassWordComfirmation);
    yield window.Toast.success(EVENT.Password.message, 1);
    const { routing } = yield select();
    const history = yield routing.history;
    yield history.goBack();
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 发起提款
export function* withdrawMoney(action) {
  try {
    const { money = '', cardId = '', password = '' } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.withdrawMoney(money, cardId, password);
    const { routing } = yield select();
    const history = yield routing.history;
    yield window.Toast.success('提款成功', 1);
    yield history.goBack();
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 提款历史
export function* withdrawHistory() {
  try {
    const { EVENT } = yield SERVICES();
    const result = yield EVENT.Account.updateWithdrawRecord();
    yield put({
      type: T.SET_USER_INFO,
      payload: { withdrawHistory: result }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 提款密码修改
export function* changeWithdrawPassword(action) {
  try {
    const {
      oldPassWord = '',
      newPassWord = '',
      newPassWordComfirmation = ''
    } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Password.changeWithdrawPassword(oldPassWord, newPassWord, newPassWordComfirmation);
    yield window.Toast.success(EVENT.Password.message, 1);
    const { routing } = yield select();
    const history = yield routing.history;
    yield history.goBack();
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 获取设置止盈止损的信息
export function* getUpDownData(action) {
  try {
    const { EVENT } = yield SERVICES();
    const { id } = yield action.payload;
    yield window.INVENTORY.preOrderConfig(id);
    window.keeper = yield EVENT.Trade.INVENTORY();
    window.keeper = yield window.keeper.processOrderConfig();
    yield put({ type: T.SET_POSITIONS_DATA, payload: { upDownInfo: window.keeper } });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 提交止赢止损
export function* submitUpDown(action) {
  try {
    const { profit, loss, callback, order = false } = yield action.payload;
    // 止盈
    if (profit) {
      yield window.keeper.setStopProfit(profit);
    }
    // 止损计算
    if (loss) {
      yield window.keeper.setStopLoss(loss);
    }
    // 提交
    if (order) {
      yield window.keeper.submit();
      yield callback({ status: 'ok' });
      yield window.Toast.success('设置止盈止损成功', 1);
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 实名认证
export function* realNameAuthentication(action) {
  try {
    const { realName = '', IdCardNumber = '' } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.nameVerification(realName, IdCardNumber);
    yield window.Toast.success('认证成功');
    const { routing } = yield select();
    const history = yield routing.history;
    yield history.goBack();
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 添加模拟币
export function* addMockMoney() {
  try {
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.addSimulateBalance();
    window.Toast.success(EVENT.Account.message, 1);
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 获取支付列表
export function* getPayMentList() {
  try {
    const { PAYMENT } = yield SERVICES();
    const list = yield PAYMENT.getList();
    yield put({
      type: T.SET_PAYMENT_LIST,
      payload: { payList: list }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 获取用户银行卡列表
export function* getAllBankCard() {
  try {
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.getAllBankCard();
    const allBankList = EVENT.Account.allBankCardList;
    yield put({
      type: T.SET_USER_INFO,
      payload: { userBankCardList: allBankList }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 删除银行卡
export function* deleteBankCard(action) {
  try {
    const { id = '' } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.deleteBankCard(id);
    yield EVENT.Account.getAllBankCard();
    const allBankList = EVENT.Account.allBankCardList;
    yield put({
      type: T.SET_USER_INFO,
      payload: { userBankCardList: allBankList }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 设置默认银行卡列表
export function* setDefaultBankCard(action) {
  try {
    const { id = '' } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.setDefaultBankCard(id);
    yield EVENT.Account.getAllBankCard();
    const allBankList = EVENT.Account.allBankCardList;
    yield put({
      type: T.SET_USER_INFO,
      payload: { userBankCardList: allBankList }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// // 添加银行卡
export function* addBankCard(action) {
  try {
    const {
      bankType = '',
      province = '',
      city = '',
      cardNumber = '',
      cfmCardNumber = '',
      subbranch = ''
    } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.addBankCard(bankType, province, city, cardNumber, cfmCardNumber, subbranch);
    yield EVENT.Account.getAllBankCard();
    const allBankList = EVENT.Account.allBankCardList;
    yield window.Toast.success('添加成功', 1);
    const { routing } = yield select();
    const history = yield routing.history;
    yield history.goBack();
    yield put({
      type: T.SET_USER_INFO,
      payload: { userBankCardList: allBankList }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 修改银行卡
export function* changeBankCard(action) {
  try {
    const { province, city, subbranch, id } = yield action.payload || {};
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.changeBankInfo(province, city, subbranch, id);
    yield EVENT.Account.getAllBankCard();
    const allBankList = EVENT.Account.allBankCardList;
    yield window.Toast.success('银行卡修改成功', 1);
    const { routing } = yield select();
    const history = yield routing.history;
    yield history.goBack();
    yield put({
      type: T.SET_USER_INFO,
      payload: { userBankCardList: allBankList }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 发起支付
export function* submitPay(action) {
  try {
    const params = yield action.payload;
    yield window.Toast.loading('', 7);
    const { queryStringfy } = yield import('./utils');
    const { redirectURL = '', ...result } = yield new Promise((resolve, reject) => {
      fetch('/api/pay/rechargeXXPay.htm' + queryStringfy(params), { method: 'POST' })
        .then(json => json.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
    yield window.Toast.hide();
    // 成功获取数据跳转链接
    if (redirectURL) {
      console.log('打印: function*submitPay -> redirectURL', redirectURL);
      const { routing } = yield select();
      const history = yield routing.history;
      history.push({ pathname: '/payIframe', state: redirectURL });
    } else {
      window.Toast.info(result.message, 1);
    }
  } catch (error) {
    yield window.Toast.hide();
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 获取充值历史记录
export function* getPayHistoryList() {
  try {
    const { EVENT } = yield SERVICES();
    yield EVENT.Account.updateRechargeRecord();
    yield put({
      type: T.SET_PAYMENT_LIST,
      payload: { history: EVENT.Account.getRechargeRecord() }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 获取商品规则
export function* getRules(action) {
  try {
    const { code } = action.payload || {};
    let rule = '';
    const { RULE, Contracts, DIGITALRULE } = yield SERVICES();
    if (!!Contracts._total[code] && Contracts._total[code].coins === true) {
      rule = yield DIGITALRULE.getRule(code);
    } else {
      rule = yield RULE.getRule(code);
    }
    yield put({ type: T.SET_RULES_DATA, payload: rule });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 忘记资金/登录密码（验证图形验证码-发送短信）
export function* validCodeNum(action) {
  try {
    const { EVENT } = yield SERVICES();
    const { phone, imgCode, type, callback } = action.payload || {};
    yield EVENT.Password.validCodeNum(phone, imgCode, type);
    callback({ status: 'ok' });
    yield window.Toast.success('验证码已发送', 1);
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
/*
 * type === 1
 * 忘记资金密码 （验证短信验证码）
 * type === 2
 * 忘记资金密码 （验证短信验证码）
 */

export function* validPhoneNum(action) {
  try {
    const { EVENT } = yield SERVICES();
    const { mobile, code, type, callback } = action.payload || {};
    const result = yield EVENT.Password.validPhoneNum(mobile, code, type);
    if (result.redirectUrl === `/findback.htm?step=1&type=${type}`) {
      callback({ status: 'ok' });
      yield window.Toast.success('请先进行实名验证', 1);
    } else {
      callback({ status: '' });
      if (type === 1) {
        yield window.Toast.success('请设置新登录密码', 1);
      } else window.Toast.success('请设置新提款密码', 1);
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
/*
 * type === 1
 * 忘记登录密码 （如已实名，则进行身份验证）
 * type === 2
 * 忘记资金密码 （如已实名，则进行身份验证）
 */
export function* validUserId(action) {
  try {
    const { EVENT } = yield SERVICES();
    const { name, id, type, callback } = action.payload || {};
    yield EVENT.Password.validUserId(name, id, type);
    callback({ status: 'ok' });
    yield window.Toast.success('实名验证成功', 1);
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

/*
 * type === 1
 * 忘记资金密码 （设置新提款密码）
 * type === 2
 * 忘记资金密码 （设置新提款密码）
 */
export function* validNewPass(action) {
  try {
    const { EVENT } = yield SERVICES();
    const { newPass, confirmPass, type } = action.payload || {};
    yield EVENT.Password.validNewPass(newPass, confirmPass, type);
    yield EVENT.Account.callback();
    yield window.Toast.success('密码修改成功', 1);
    const { routing } = yield select();
    const history = yield routing.history;
    yield history.goBack();
    yield EVENT.Account.callback();
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 客服发送消息
export function* sendMessageToCustomerService(action) {
  try {
    const { EVENT } = yield SERVICES();
    const { information, callback } = action.payload || {};
    yield EVENT.Cs.updateSendInfo(information);
    callback({ status: 'ok' });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 获取消息从客服
export function* getMessageFromCustomerService() {
  try {
    const { EVENT } = yield SERVICES();
    const { data = [] } = yield EVENT.Cs.updateConversation();
    yield put({ type: T.SET_USER_INFO, payload: { customerServiveMeesage: data } });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

// 推广赚钱
export function* getUserPromotion() {
  try {
    const { EVENT } = yield SERVICES();
    const result = yield EVENT.Account.updatePromotionInfo();
    yield put({
      type: T.SET_USER_INFO,
      payload: { userPromotion: result }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 我的用户
export function* myUser() {
  try {
    const { EVENT } = yield SERVICES();
    const result = yield EVENT.Account.updateUserList();
    yield put({
      type: T.SET_USER_INFO,
      payload: { myUser: result }
    });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 添加自选 需要登录 请在之前判断
export function* addOptional(action) {
  try {
    const { code } = yield action.payload || {};
    if (code) {
      // 存在 判断是否存在数据中 如果存在 删除 不存在添加
      if (localStorage['_favorList']) {
        const data = yield JSON.parse(localStorage['_favorList']) || [];
        const isCode = yield data.some(item => item === code);
        // 代表存在 删除
        if (isCode) {
          localStorage['_favorList'] = yield JSON.stringify(data.filter(item => item !== code));
        } else {
          // 不存在 添加
          localStorage['_favorList'] = yield JSON.stringify([...data, code]);
        }
      } else {
        localStorage['_favorList'] = yield JSON.stringify([code]);
      }
    }
    // 同步redux
    if (localStorage['_favorList']) {
      yield put({ type: T.SET_OPTIONAL, payload: JSON.parse(localStorage['_favorList']) || [] });
    }
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}
// 处理路由发生了变化
export function* changeRoute(action) {
  try {
    const routeApi = action.payload;
    // 输出经过的路由
    console.log(`路由 -> ${routeApi.location.pathname}`);
    yield put({ type: T.SET_ROUTER_INFO, payload: routeApi });
  } catch (error) {
    const { EVENT } = yield SERVICES();
    yield EVENT.Error.throw(error);
  }
}

/* -------------------------------- 初始化 预加载数据 ------------------------------- */
export function* preLoadData() {
  /*  --------------------------------  */
  yield put({ type: T.GET_INIT_DATA }); // 初始化接口
  yield put({ type: T.GET_QUOTES_LIST_DATA }); // 获取商品
  /*  --------------------------------  */
  yield put({ type: T.ADD_OPTIONAL }); // 获取自选
  yield put({ type: T.GET_NEWS_LIST_DATA, payload: { type: 0 } }); // 加载新闻
  yield put({ type: T.GET_NEWS_FAET_LIST, payload: { id: 0 } }); // 加载快讯
  yield put({ type: T.GET_PAYMENT_LIST }); // 充值列表
  yield put({ type: T.GET_MESSAG_FROM_CUSTOMER_SERVICE }); // 客服消息数据
}
