//  ！！！ 此文件项目配置启动文件 修改需要重启
module.exports = {
  // pc | mobile 启动对应的webpack配置开发环境 移动端可选 antd-mobile pc端可选 ant-desgin
  mode: 'pc',
  // 网站的标题
  title: 'pc',
  // 网址的图标 约定路径在public文件下
  favicon: 'favicon.ico',
  // 首屏loading 约定路径在public文件下的loading文件中
  loading: '',
  // 路由选项 可选 HashRouter（哈希路由） | MemoryRouter（内存路由） | BrowserRouter（history路由）
  routerType: 'HashRouter',
  // dns-prefetch可帮助开发人员处理DNS解析延迟问题 写自己的部署的域名
  prefetchDNS: '//zb.dsttc168.com',
  // 可选布局 如移动端 和 pc端的布局不一致 值为：组件的名字
  layout: 'PC',
  //  css 链接
  css: [],
  //  js 链接
  js: [],
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
      target: 'https://a.rcebh.com',
      // target: 'http://zb.dsttc168.com',
      changeOrigin: true
    }
  ],
  // 是否开启 css px 转 rem 如mode为pc 可以关闭
  rem: false,
  // 是否开启热重载
  isHot: false,
  // 是否使用 service worker
  isSW: false,
  // 是否使用插件优化 在移动端出现的300ms延迟
  isFastclick: false,
  // 是否首页使用预渲染打包
  isPrerenderSPA: false,
  // 路由默认 /home 为首页 当无匹配的时候会重定向至 /home
  // 页面配置
  body: [
    {
      // 首页
      path: '/home',
      component: 'Home',
      when: 'always',
      saveScrollPosition: true
    }
  ]
};
