import React from 'react';
import styles from './style.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {}

interface Methods {
  isShowNav: (pathname: string) => boolean;
}
// @ts-ignore
const path: string = require(`@/app/${APP}/_config/app.js`).tabBar.path;
const TabBar: React.LazyExoticComponent<React.ComponentType<any>> = require(`@app/${path}`).default;

class Layout extends React.Component<Props> implements Methods {
  public isShowNav(pathname: string): boolean {
    // @ts-ignore
    const children: Array<Theme.BottomNavigationMember> = process.env.tabBar.config;
    const isTabBar: Array<any> = Object.values(children).filter((item): boolean =>
      Object.is(item.path, pathname)
    );
    const navs: Array<string> = Object.values(children).map((item): string => item.path);
    return navs.includes(pathname) && !(Boolean(isTabBar.length) && isTabBar[0].hidden);
  }
  public render() {
    const isShow: boolean = this.isShowNav(this.props.location.pathname);
    return (
      <div className={styles['bw-layout']}>
        <div className={styles['bw-body']}>{this.props.children}</div>
        <div
          className={`${styles['bw-bottom-nav-container']} ${
            isShow ? styles['bw-nav-show'] : styles['bw-nav-hidden']
          }`}
          style={
            process.env.isTabBarBottomAnimate
              ? {
                  transition: 'all 0.1s linear'
                }
              : {}
          }
        >
          {process.env.isTabBarBottom && (
            <TabBar
              config={
                // @ts-ignore
                process.env.tabBar.config
              }
            />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Layout);
