import React from 'react';
import { Tabs } from 'antd-mobile';
import styles from './style.less';

export interface TabsType {
  title: string;
  type: number;
}

const tabs: Array<TabsType> = [
  { title: '资讯', type: 0 },
  { title: '快讯', type: 1 },
  { title: '公告', type: 2 }
];

class TabsComponent extends React.Component<any> {
  componentDidMount() {}
  render() {
    return (
      <div className={styles['bw-market-tabs-layout']}>
        <Tabs
          page={this.props.page}
          tabs={tabs}
          onChange={e => this.props.onChange(e)}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
        ></Tabs>
      </div>
    );
  }
}

export default TabsComponent;
