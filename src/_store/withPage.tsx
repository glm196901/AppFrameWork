// export interface ScrollParams {
//   status: string;
//   msg: string;
// }

// 页面组件增加 - 生命周期装饰器
const withPage = (target: any): any => {
  // @ts-ignore
  let pages = (process.env.body || []).map(({ component }: { component: string }) => component);
  const isPage = pages.some((page: string) => Object.is(target.name, page));
  if (!isPage) {
    throw Error(
      '请确认 路由配置中component和pages的文件名和对应的组件的calss name是否一致，不一致将无法使用额外的生命周期'
    );
  }
  return class extends target {
    constructor(props: any) {
      super(props);
      /* -------------------------------- 初始化 立即执行 -------------------------------- */
      this._addEventListenerScroll(); // 滚动条的变化
      this._addEventListeneronResize(); // 窗口的变化
      this._addEventListenerReachBottom(); // 滚动到底部
      /* ---------------------------------- 缓存进入 ---------------------------------- */
      props.cacheLifecycles.didRecover(() => {
        if (this.onShow) this.onShow();
        this._addEventListenerScroll();
        this._addEventListeneronResize();
        this._addEventListenerReachBottom();
      });
      /* ---------------------------------- 缓存离开 ---------------------------------- */
      props.cacheLifecycles.didCache(() => {
        if (this.onHide) this.onHide();
        this._removeEventListenerScroll();
        this._removeEventListeneronResize();
        this._removeEventListenerReachBottom();
      });
    }
    /* --------------------------------- 窗口变化方法 --------------------------------- */
    _addEventListeneronResize = () => {
      if (this.onResize) {
        window.addEventListener('resize', this.onResize);
      }
    };
    _removeEventListeneronResize = () => {
      if (this.onResize) {
        window.removeEventListener('resize', this.onResize);
      }
    };
    /* ---------------------------------- 滚动条变化方法 --------------------------------- */
    _addEventListenerScroll = () => window.addEventListener('scroll', this._onScroll);
    _removeEventListenerScroll = () => window.removeEventListener('scroll', this._onScroll);
    _onScroll = () => {
      if (this.onPageScroll) {
        this.onPageScroll({
          status: 'ok',
          msg: '返回页面滚动条的位置等信息',
          ...this._scrollInfo()
        });
      }
    };
    _scrollInfo = () => {
      try {
        const rect = document.body.getBoundingClientRect();
        const y = document.documentElement.scrollTop;
        const x = document.documentElement.scrollLeft;
        return {
          scroll: { x, y },
          getBoundingClientRect: {
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left
          }
        };
      } catch (err) {
        return {
          err: JSON.stringify(err),
          scroll: { x: 0, y: 0 },
          getBoundingClientRect: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        };
      }
    };
    // onReachBottom 页面触底时执行
    _addEventListenerReachBottom = () => {
      if (this.onReachBottom) {
        window.addEventListener('scroll', this._onReachBottom);
      }
    };
    _removeEventListenerReachBottom = () => {
      if (this.onReachBottom) {
        window.removeEventListener('scroll', this._onReachBottom);
      }
    };
    _onReachBottom = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollTop + windowHeight === scrollHeight) {
        this.onReachBottom({
          status: 'ok',
          msg: '已经到底部',
          ...this._scrollInfo
        });
      }
    };
    public render = () => super.render();
  };
};

export default withPage;
