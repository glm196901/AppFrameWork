### 项目目录

```
.
├── .env                    - 环境变量配置
├── .env.development        - 开发环境变量配置
├── .env.production         - 生产环境变量配置
├── .eslintignore           - eslint忽略文件
├── .eslintrc.js            - eslint配置文件
├── .gitignore              - git忽略文件
├── .prettierignore         - prettier忽略文件
├── .prettierrc.js          - prettier配置文件
├── .vscode                 - 编辑器配置文件
├── README.md               - 文档
├── build                   - 生产环境代码
├── craco.config.js         - 自定义webpack配置文件
├── package.json            - 开发依赖配置文件
├── paths.json              - 别名路径配置
├── tsconfig.json           - typescript编译器配置文件
├── public                  - 公共文件，该目录下的文件打包直接拷贝
└── src                     - 项目源码文件
    ├── components          - 组件文件夹
    ├── app                 - 视图文件夹
    ├── store               - 状态管理文件夹
    ├── index.tsx           - 入口文件
    ├── react-app-env.d.ts  - 环境类型配置
    └── setupProxy.js       - 配置接口代理
└── package-lock.json       - 包版本文件
```

### 页面的生命周期

```tsx
import React from 'react';
import { withPage } from '@/_store';

interface Props {}
interface State {}

// 页面组件必须正确写class名字，如果和路由中的Component的名字不一致，将无法使用@withPage将抛出错误
// 建议将额外的生命周期方法 以on开头，其他的方法以handle开头。
@withPage
class Home extends React.Component<Props, State> {
  state = {}; // 数据状态
  componentWillMount() {} // 在渲染前调用
  componentDidMount() {} // 初次加完完毕 第一次将不会调用 调用onShow
  onShow = () => {}; // 显示调用 第一次不会加载
  onHide = () => {}; // 隐藏调用
  onReachBottom = () => {}; // 页面触底时执行
  onResize = () => {}; // 窗口发生变化调用
  onPageScroll = () => {}; // 页面滚动时执行
  // 渲染
  render() {
    return <div>home</div>;
  }
}

export default Home;
```

### 样式

- css 单位 px
- style 内联样式使用大写 `RPX` 单位自动会计算转为 rem
- 主题文件的变量会自动全局 不需要在引入,任何 less 文件都可以使用
- 所有的样式使用 less module，不得更改任何不属于自己的组件样式

### TradingView 使用

- props 发生变化会自动变更 如切换商品只要改变 code
- 图表的大小取决于父容器的大小

```tsx
interface Props {
  code: string; // 商品代码 CL
  type?: 'sline' | '1' | '5' | '15' | '1D'; // 图表类型 分时 1分 5分 15分 日线
  color1?: string; // 面积图的顶部颜色和color2组成渐变
  color2?: string; // 面积图的底部颜色和color1组成渐变
  linecolor?: string; // 面积图上面线的颜色
  linewidth?: number; // 线的大小
  background?: string; // 背景颜色
  vertGridColor?: string; // 纵向网格颜色
  horzGridColor?: string; // 横向网格颜色
  crossHair?: string; // 触摸十字架的颜色
}
```

```tsx
import React from 'react';
import TradingView from '@/components/TradingView';
class Demo extends React.Component {
  render() {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <TradingView
          code="CL"
          type={this.state.type as 'sline' | '1' | '5' | '15' | '1D'}
          linewidth={5}
          color1="#ffffff"
          color2="#000000"
          linecolor="#ffffff"
          background="#000000"
          vertGridColor="#000000"
          horzGridColor="#000000"
          crossHair="#ffffff"
        />
      </div>
    );
  }
}
export default Demo;
```

### ChartIQ 使用

- props 发生变化会自动变更 如切换商品只要改变 code
- 图表的大小取决于父容器的大小

```tsx
interface Props {
  code: string; // 商品code CL2001
  type: ChartType; // 图表的切换类型
  MA?: object; // ma线配置对象
  backgroundColor?: string; // 背景颜色
  chartControls?: boolean; // 是否隐藏放在控件
  lineTopStyle?: 'solid' | 'dashed' | 'dotted'; // 线的类型
  lineTopColor?: string; //山图顶部 线的颜色
  linewidth?: number; // 线的粗细
  backgroundColorTop?: string; // 山图面积渐变颜色top
  backgroundColorBottom?: string; // 山图面积渐变颜色bottom
  gridColor?: string; //网格颜色
  fontColor: string; // 左上角字体颜色
  isShowLeftTopView: boolean; // 是否显示左上角的数值
}
```

```tsx
import React, { Component } from 'react';
import ChartIQ from '@/components/ChartIQ';
class Demo extends Component {
  render() {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <ChartIQ
          code="CL2001"
          type="1-minute-mountain"
          backgroundColor="#000000"
          lineTopColor="#ffffff"
          fontColor="#ffffff"
          backgroundColorTop="green"
          backgroundColorBottom="#000000"
          gridColor="#000000"
          linewidth={2}
          lineTopStyle="solid"
          chartControls={true}
          isShowLeftTopView={true}
          MA={{
            5: 'rgba(150,95,196,0.7)',
            10: 'rgba(132,170,213,0.7)',
            20: 'rgba(85,178,99,0.7)',
            40: 'rgba(183,36,138,0.7)'
          }}
        />
      </div>
    );
  }
}
export default Demo;
```

### 装饰器

```tsx
// 组合使用按照下面顺序使用
@connect('xxx','xxx'); // 获取redux数据
@withPage // 增加页面生命周期
```

### 路径的使用

- `@ 为 src`

### 路由配置

> [react-router-dom](https://github.com/ReactTraining/react-router#readme)

> [react-router-cache-route](https://github.com/CJY0208/react-router-cache-route)

```tsx
{
   path: '/position/:mock/:back', // 路径
   component: 'Position', // 组件 在pages下
   when: 'always', // 缓存策略
   saveScrollPosition: true, // 是否要记住滚动条的位置
   auth: true // 是否需要权限校验
}
```

- `when` // 为以下几个值
- [forward] 发生前进行为时,缓存，对应 react-router 中的 PUSH 或 REPLACE 事件
- [back] 发生后退行为时,缓存，对应 react-router 中的 POP 事件
- [always] 离开时一律缓存路由，无论前进或者后退
- 类型为 Function 时，将接受组件的 props 作为第一参数，返回 true/false 决定是否缓存
- saveScrollPosition true | false 是否保存滚动条的状态

```tsx
// 计算精度
import NP from 'number-precision';
NP.strip(0.09999999999999998); // = 0.1
NP.plus(0.1, 0.2); // = 0.3, not 0.30000000000000004
NP.plus(2.3, 2.4); // = 4.7, not 4.699999999999999
NP.minus(1.0, 0.9); // = 0.1, not 0.09999999999999998
NP.times(3, 0.3); // = 0.9, not 0.8999999999999999
NP.times(0.362, 100); // = 36.2, not 36.199999999999996
NP.divide(1.21, 1.1); // = 1.1, not 1.0999999999999999
NP.round(0.105, 2); // = 0.11, not 0.1
```

### svg

- [svg 处理工具](https://github.com/svg/svgo) `npx svgo -f src/app/base/static/svg`
- `fill\s*?=\s*?([‘"])[\w\W]*?\1`
- @svgr/cli
- npx svgr src/app/base/static/svg --ext tsx --out-dir src/app/base/component/Icons --config-file svgr.config.js

- window.quoteURL = book[0] // 公开地址

### eslint

```ts
// 跳过eslint 可以这样做
/* eslint-disable */
console.error(err);
/* eslint-enable */
```

### typescript

```ts
//  跳过ts 检测的可以这样做
// @ts-ignore
import initReactFastclick from 'react-fastclick';
```

###

- 新增一个项目需要在 paths.json 中添加项目路径

###

`$$("*").forEach(a => a.style.outline="1px solid red")`
