import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { MemoryRouter, HashRouter, BrowserRouter } from 'react-router-dom';
import { dispatch, T, reduxState } from '@/_store';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
/* ------------------------------- 路由配置 start ------------------------------- */
export interface Routes {
  path: string;
  exact: boolean;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  preload: Function;
  when: any;
  auth?: boolean;
  saveScrollPosition?: boolean;
}
export type CustomRouterType = 'HashRouter' | 'MemoryRouter' | 'BrowserRouter';
const lazyPages = (pages: Array<Theme.Pages>): Array<Routes> => {
  const routes: Array<Routes> = [];
  pages.forEach(item => {
    const Component = () => import(`@app/pages/${item.component}`);
    const lazyComponent: React.LazyExoticComponent<React.ComponentType<any>> = React.lazy(
      Component
    );
    const route: Routes = {
      path: item.path,
      when: item.when,
      saveScrollPosition: !!item.saveScrollPosition,
      auth: !!item.auth,
      exact: true,
      component: lazyComponent,
      preload: Component
    };
    routes.push(route);
  });

  window.addEventListener('load', (): void => {
    routes.forEach((component: Routes): void => component.preload());
  });
  return routes;
};
// @ts-ignore
const body = require(`@/app/${APP}/_config/app.js`).body;
// @ts-ignore
const config = lazyPages(body || []);
const layoutPath = process.env.layout;

const Layout = require(`@/_components/Layout/${layoutPath}`).default;

/* ----------------------------------- development ------------------------------- */
if (process.env.NODE_ENV === 'development') {
  /* eslint-disable */
  console.groupCollapsed('%c项目路由列表', 'color:#00bd9a;');
  console.table(config);
  console.groupEnd();
  console.groupEnd();
  console.groupEnd();
  /* eslint-enable */
}
/* -------------------------------- 路由配置 end -------------------------------- */
const CustomRouter = ({ children }: { children: any }): React.ReactElement | never => {
  const _routes: Array<CustomRouterType> = ['HashRouter', 'MemoryRouter', 'BrowserRouter'];
  if (!_routes.includes(process.env.routerType as CustomRouterType)) {
    throw new Error('选择路由参数（process.env.routerType）错误！');
  }
  return (
    <>
      {(process.env.routerType as CustomRouterType) === 'HashRouter' && (
        <HashRouter>{children}</HashRouter>
      )}
      {(process.env.routerType as CustomRouterType) === 'MemoryRouter' && (
        <MemoryRouter initialEntries={config.map(item => item.path)} initialIndex={0}>
          {children}
        </MemoryRouter>
      )}
      {(process.env.routerType as CustomRouterType) === 'BrowserRouter' && (
        <BrowserRouter>{children}</BrowserRouter>
      )}
    </>
  );
};

interface RenderComponentAuthType {
  (
    Component: React.LazyExoticComponent<React.ComponentType<any>>,
    props: RouteComponentProps,
    auth: boolean
  ): React.ReactElement | null;
}

const RenderComponentAuth: RenderComponentAuthType = (Component, props, auth) => {
  dispatch(T.CHANGE_ROUTE, props);
  const { userInfo } = reduxState();
  // 未登录经过路由和需要鉴权的
  if (!userInfo.isLogin && auth) {
    props.history.replace({ pathname: '/login', state: { to: props.location.pathname } });
    return null;
  } else {
    return <Component {...props} />;
  }
};

const Pages = (): React.ReactElement => (
  <CustomRouter>
    <Layout>
      <React.Suspense fallback={null}>
        <CacheSwitch>
          {config.map(item => {
            const { component: Component, ...args } = item;
            return (
              <CacheRoute
                {...args}
                key={item.path}
                render={props => RenderComponentAuth(Component, props, !!item.auth)}
              />
            );
          })}
          <Redirect from="*" to="/home" />
        </CacheSwitch>
      </React.Suspense>
    </Layout>
  </CustomRouter>
);
export default Pages;
