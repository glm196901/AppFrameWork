/// <reference types="react-scripts" />

declare module '*.less';

declare namespace Store {
  export interface State {
    readonly [key: string]: any;
  }
  export interface Action {
    type: string;
    payload?: any;
  }

  export interface Reducer {
    (state: State, action: Action): State;
  }
}

declare namespace Theme {
  // 底部配置类型
  export interface BottomNavigationMember {
    name: string;
    path: string;
    defaultIcon: string;
    activeIcon: string;
    textColor: string;
    textActiveColor: string;
    TabBarHidden?: boolean;
  }
  // 底部配置类型
  export interface BottomNavigation {
    components: BottomNavigationMember;
    select: string;
  }
  // 项目路由配置类型
  export interface Pages {
    path: string;
    component: string;
    when?: string;
    auth?: boolean;
    saveScrollPosition?: boolean;
    type?: string;
    from?: string;
  }
}
// 配置文件的类型描述
declare interface _config {
  // 网站的标题
  title: string;
  // 选择首屏loading
  loading: string;
  // 路由选项 可选 HashRouter（哈希路由） | MemoryRouter（内存路由）
  routerType: 'HashRouter' | 'MemoryRouter';
  // 页面配置
  body: Array<{
    path: string; // 路由地址
    component: string; // pages 下的对应的组件
    when: string; // 缓存的方式
    saveScrollPosition: boolean; // 是否记住滚动条的位置
    auth: boolean; // 是否需要鉴权
  }>;
  // 底部配置
  tabBar: {
    path: string; // 组件路径地址
    config: Array<{
      name: string; // 文字
      path: string; // 对应的路由
      icon: string; // iconfont class
      size: string; // font-size
    }>;
  };
}
