import { takeEvery } from 'redux-saga/effects';
import * as T from '../state/types'; // 类型
import * as F from './methods'; // 方法

function* rootSaga() {
  try {
    // 初始化
    yield takeEvery(T.GET_INIT_DATA, F.getInitData);
    // 获取行情列表数据
    yield takeEvery(T.GET_QUOTES_LIST_DATA, F.getQuotesListData);
    // 关闭获取行情列表数据
    yield takeEvery(T.END_QUOTES_LIST_DATA, F.endQuotesListData);
    // 关闭行情图chart
    yield takeEvery(T.END_CHART, F.endChart);
    // 关闭单个行情图详情数据
    yield takeEvery(T.END_QUOTES_DETAIL, F.endQuotesDetail);
    // 获取轮播图列表
    yield takeEvery(T.GET_BANNER_LIST_DATA, F.getBanner);
    // 获取公告列表
    yield takeEvery(T.GET_NOTICE_LIST_DATA, F.getNotice);
    // 获取新闻列表
    yield takeEvery(T.GET_NEWS_LIST_DATA, F.getNews);
    // 获取新闻详情
    yield takeEvery(T.GET_NEWS_DETAIL, F.getNewsDetail);
    // 关闭首屏的loading
    yield takeEvery(T.DELETE_LOADING, F.deleteLoading);
    // 获取商品走势详情
    yield takeEvery(T.GET_PRODUCT_DETAIL, F.productDetail);
    // 获取商品属性描述
    yield takeEvery(T.GET_PRODUCT_PROPS, F.productProps);
    // 切换商品走势详情
    yield takeEvery(T.SWITCH_PRODUCT_DETAIL, F.switchProductDetail);
    // 获取新闻快讯列表
    yield takeEvery(T.GET_NEWS_FAET_LIST, F.getFastNewsList);
    // 发起登录
    yield takeEvery(T.SUBMIT_LOGIN, F.submitLogin);
    // 获取交易模型数据和提交交易行为
    yield takeEvery(T.GET_OR_SUBMIT_TRANAACTION, F.submitTransaction);
    // 发送注册验证码
    yield takeEvery(T.GET_REGISTER_MESSAGE_CODE, F.GetRegisterMessageCode);
    // 注册校验短信验证码
    yield takeEvery(T.VERIFY_REGISTER_MESSAGE_CODE, F.verifyRegisterMessageCode);
    // 提交注册
    yield takeEvery(T.SUBMIT_REGISTER, F.submitRegister);
    // 修改绑定手机号
    yield takeEvery(T.CHANGE_BONDPHONE, F.changePhoneNumber);
    // 修改绑定手机号发送短信验证码
    yield takeEvery(T.CHANGE_BONDPHONE_SEND_MESSAGE, F.changePhoneNumberGetMessageCode);
    // 退出登录
    yield takeEvery(T.OUT_LOGIN, F.outLogin);
    // 获取资金明细列表
    yield takeEvery(T.GET_FUND_LIST, F.getFundList);
    // 获取持仓列表数据和总金额
    yield takeEvery(T.GET_POSITIONS_DATA, F.getPositionsData);
    // 获取持仓的结算列表数据
    yield takeEvery(T.GET_POSITIONS_RESULT_LIST, F.getPositonResultsList);
    // 获取资金明细详情
    yield takeEvery(T.GET_FUND_DETAIL, F.getFundDetail);
    // 修改登录密码
    yield takeEvery(T.CHANGE_LOGIN_PASSWORD, F.changeLoginPassword);
    // 修改提款密码
    yield takeEvery(T.CHANGE_WITHDRAW_PASSWORD, F.changeWithdrawPassword);
    // 切换模拟盘和实盘的数据
    yield takeEvery(T.SWITCH_POSTION_DATA, F.swtichPostionData);
    // 平仓单个
    yield takeEvery(T.ClOSE_POSTION, F.closePostion);
    // 平仓所有
    yield takeEvery(T.ClOSE_POSTION_ALL, F.closePostionAll);
    // 关闭单个商品数据获取
    yield takeEvery(T.END_PRODUCT_DETAIL, F.endProductDetail);
    // 关闭持仓请求数据
    yield takeEvery(T.END_POSTION_DATA, F.endPostionData);
    // 获取设置止盈止损的数据信息
    yield takeEvery(T.GET_UP_DOWN_DATA, F.getUpDownData);
    // 提交止赢止损信息
    yield takeEvery(T.SUBMIT_UP_DOWN, F.submitUpDown);
    // 添加模拟币
    yield takeEvery(T.ADD_MOCK_MONEY, F.addMockMoney);
    // 获取支付方式列表
    yield takeEvery(T.GET_PAYMENT_LIST, F.getPayMentList);
    // 获取银行卡列表
    yield takeEvery(T.GET_USER_BANKCARD_LIST, F.getAllBankCard);
    // 删除银行卡
    yield takeEvery(T.DELETE_BANKCARD, F.deleteBankCard);
    // 设置默认银行卡
    yield takeEvery(T.SET_DEFAULT_BANKCARD, F.setDefaultBankCard);
    // 添加银行卡
    yield takeEvery(T.ADD_BANKCARD, F.addBankCard);
    // 修改银行卡
    yield takeEvery(T.CHANGE_BANKCARD, F.changeBankCard);
    // 发起支付
    yield takeEvery(T.SUBMIT_PAY, F.submitPay);
    // 获取充值记录
    yield takeEvery(T.GET_PAY_HISTORY_LIST, F.getPayHistoryList);
    // 获取规则
    yield takeEvery(T.GET_RULES, F.getRules);
    // 忘记提款密码步骤
    // step1 发送(忘记提款密码)短信验证码
    yield takeEvery(T.GET_FORGET_MESSAGECODE, F.validCodeNum);
    // step2 验证(忘记提款密码)短信密码
    yield takeEvery(T.VALIDA_FORGET_PHONE_NUM, F.validPhoneNum);
    // step3 (若已实名，则进行实名验证)
    yield takeEvery(T.VALIDA_FORGET_USERID, F.validUserId);
    // step4 (若未实名，则直接修改密码并验证)
    yield takeEvery(T.VALIDA_NEWPASSWORD, F.validNewPass);
    // 实名认证提交
    yield takeEvery(T.REALNAME_AUTHENTICATION, F.realNameAuthentication);
    // 发起提款
    yield takeEvery(T.WITHDRAW_MONEY, F.withdrawMoney);
    // 提款历史
    yield takeEvery(T.GET_WITHDRAW_HISTORY_LIST, F.withdrawHistory);
    //发送客服消息
    yield takeEvery(T.SEND_MESSAG_TO_CUSTOMER_SERVICE, F.sendMessageToCustomerService);
    // 拉取客服消息
    yield takeEvery(T.GET_MESSAG_FROM_CUSTOMER_SERVICE, F.getMessageFromCustomerService);
    // 获取推广赚钱
    yield takeEvery(T.GET_USER_PROMOTION, F.getUserPromotion);
    // 获取我的用户
    yield takeEvery(T.GET_MYUSER, F.myUser);
    // 添加自选
    yield takeEvery(T.ADD_OPTIONAL, F.addOptional);
    // 路由发生了变化 可以做一些其他的事情
    yield takeEvery(T.CHANGE_ROUTE, F.changeRoute);
    // 初始化 和 预加载数据方法
    yield takeEvery(T.__PRE_LOAD_DATA__, F.preLoadData);
  } catch (error) {
    alert(JSON.stringify(error));
  }
}

export default rootSaga;
