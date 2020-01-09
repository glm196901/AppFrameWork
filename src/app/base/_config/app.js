//  ！！！ 此文件项目配置启动文件 修改需要重启 （body 和 tabBar 不需要重启）
module.exports = {
  // pc | mobile 启动对应的webpack配置开发环境 移动端可选 antd-mobile pc端可选 ant-desgin
  mode: 'mobile',
  // 网站的标题
  title: 'base',
  // 网址的图标 约定路径在public文件下
  favicon: 'favicon.ico',
  // 首屏loading 约定路径在public文件下的loading文件中
  loading: 'loading-1.html',
  // 路由选项 可选 HashRouter（哈希路由） | MemoryRouter（内存路由） | BrowserRouter（history路由）
  routerType: 'MemoryRouter',
  // dns-prefetch可帮助开发人员处理DNS解析延迟问题 写自己的部署的域名
  prefetchDNS: '//zb.dsttc168.com',
  // 可选布局 如移动端 和 pc端的布局不一致 值为：组件的名字
  layout: 'Mobile',
  // css 链接
  css: ['//at.alicdn.com/t/font_1582077_1m5485wc6em.css'],
  // js 链接
  js: [],
  // 是否开启 css px 转 rem 如mode为pc 可以关闭
  rem: true,
  // webpack 路径别名 配置完 要在tsconfig 中同步
  alias: {
    // 例子 项目根目录开始算位置 《./》 为根目录
    // '@哈哈': './src'
  },
  // 支付配置品牌选择
  BRANCH: 'zb',
  // 配置代理
  proxy: [
    {
      context: ['/src', '/api'],
      // target: 'https://a.rcebh.com',
      target: 'http://zb.dsttc168.com',
      changeOrigin: true
    }
  ],
  // 是否开启热重载
  isHot: false,
  // 是否使用 service worker
  isSW: true,
  // 是否使用插件优化 在移动端出现的300ms延迟
  isFastclick: true,
  // 是否需要底部导航
  isTabBarBottom: true,
  // 是否开启底部导航动画
  isTabBarBottomAnimate: true,
  // 是否首页使用预渲染打包
  isPrerenderSPA: true,
  // 路由默认 /home 为首页 当无匹配的时候会重定向至 /home
  // 页面配置
  body: [
    {
      // 首页
      path: '/home',
      component: 'Home',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 市场
      path: '/market',
      component: 'Market',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 模拟交易、实盘
      path: '/transaction/:code/:mock',
      component: 'Transaction',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 资讯
      path: '/news',
      component: 'News',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 资讯详情
      path: '/newsDetail/:id',
      component: 'NewsDetail',
      when: 'forward',
      saveScrollPosition: false
    },
    {
      // 我的
      path: '/mine',
      component: 'Mine',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 注册
      path: '/register',
      component: 'Register',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 登录
      path: '/login',
      component: 'Login',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 资金明细-我的页面
      path: '/fundDetail',
      component: 'FundDetail',
      when: 'always',
      saveScrollPosition: true,
      auth: true
    },
    {
      // 资金明细-资金列表
      path: '/fundsList',
      component: 'FundsList',
      when: 'always',
      saveScrollPosition: true,
      auth: true
    },
    {
      // 首页-活动
      path: '/activity',
      component: 'Activity',
      when: 'always',
      saveScrollPosition: false
    },
    // {
    //   // 交易记录
    //   path: '/transactionRecord',
    //   component: 'TransactionRecord'
    // },
    {
      // 忘记密码
      path: '/forgetLoginPwd',
      component: 'ForgetLoginPwd',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 账户安全
      path: '/accountSafety',
      component: 'AccountSafety',
      when: 'forward',
      saveScrollPosition: true,
      auth: true
    },
    {
      // 实名认证-账户安全
      path: '/realNameAuthentication',
      component: 'RealNameAuthentication',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 手机绑定-账户安全
      path: '/phoneBond',
      component: 'PhoneBond',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 修改登录密码-账户安全
      path: '/modifyLoginPwd',
      component: 'ModifyLoginPwd',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 提款密码-账户安全
      path: '/modifywithdrawPwd',
      component: 'ModifyWithdrawPwd',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 用户银行卡-账户安全
      path: '/userBankCard',
      component: 'UserBankCard',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 我的用户-我的页面
      path: '/myUser',
      component: 'MyUser',
      when: 'forward',
      saveScrollPosition: true,
      auth: true
    },
    {
      // 推广赚钱
      path: '/promote',
      component: 'Promote',
      when: 'always',
      saveScrollPosition: true,
      auth: true
    },
    {
      // 持仓
      path: '/position/:mock/:back',
      component: 'Position',
      when: 'always',
      saveScrollPosition: true,
      auth: true
    },
    {
      // 充值
      path: '/recharge',
      component: 'Recharge',
      when: 'always',
      auth: true,
      saveScrollPosition: true
    },
    {
      // 充值 - 详情页面
      path: '/rechargeDetail',
      component: 'RechargeDetail',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 充值 - 历史记录
      path: '/rechargeHistory',
      component: 'RechargeHistory',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 提现
      path: '/withdraw',
      component: 'Withdraw',
      when: 'forward',
      saveScrollPosition: true,
      auth: true
    },
    {
      // 提现
      path: '/withdrawHistory',
      component: 'WithdrawHistory',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 忘记提款密码
      path: '/forgetWithdrawPwd',
      component: 'ForgetWithdrawPwd',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 添加银行卡
      path: '/addBankCard',
      component: 'AddBankCard',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 修改银行卡
      path: '/modifyBankCard',
      component: 'ModifyBankCard',
      when: 'forward',
      saveScrollPosition: true
    },
    {
      // 规则页面
      path: '/rules/:code',
      component: 'Rules',
      when: 'forward',
      saveScrollPosition: false
    },
    {
      // 客服
      path: '/customerServive',
      component: 'CustomerServive',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 新手指南
      path: '/guideBook',
      component: 'GuideBook',
      // when: 'forward',
      saveScrollPosition: true
    },
    {
      // 关于我们
      path: '/aboutUs',
      component: 'AboutUs',
      when: 'always',
      saveScrollPosition: true
    },
    {
      // 第三方支付页面
      path: '/payIframe',
      component: 'PayIframe',
      when: 'forward',
      saveScrollPosition: true
    }
  ],
  tabBar: {
    path: 'components/Footer',
    config: [
      {
        name: '首页',
        path: '/home',
        icon: 'iconfont icon-shouye'
      },
      {
        name: '行情',
        path: '/market',
        icon: 'iconfont icon-hangqing1'
      },
      {
        name: '持仓',
        path: '/position/false/false',
        icon: 'iconfont icon-wodechicang'
        // hidden: true // 是否显示底部
      },
      {
        name: '资讯',
        path: '/news',
        icon: 'iconfont icon-zixun1'
      },
      {
        name: '我的',
        page: 'Mine',
        icon: 'iconfont icon-wode',
        path: '/mine'
      }
    ]
  }
};
