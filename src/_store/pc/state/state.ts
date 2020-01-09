const state: Store.State = {
  quotesList: {}, // 行情列表
  banner: [], // 轮播图
  notice: [], // 公告
  news: [], // 新闻
  newsFastList: [], // 新闻快讯列表
  newsDetail: {}, // 新闻详情
  productDetail: {}, //商品走势详情
  productProps: {}, // 商品属性
  // 用户信息
  userInfo: {
    isLogin: true,
    imageCode: '', // 图形验证码
    funds: {}, // 资金明细列表
    fundDetail: {}, // 资金明细
    userBankCardList: {}, // 用户银行卡列表
    customerServiveMeesage: [], //客服消息
    userPromotion: {}, //用户推广
    myUser: {}, // 我的用户
    withdrawHistory: {} // 提款记录
  },
  // 支付充值对象 保存充值所有东西
  payment: {
    payList: [], //  支付列表
    history: [] //  历史记录
  },
  transactionMoadl: {}, // 交易数据模型
  positions: {}, // 持仓数据
  rules: {}, // 商品规则
  productIsupDown: true, // 单独某个商品的涨跌
  favorList: [], //自选列表
  routing: {} // 路由api
};
export default state;
