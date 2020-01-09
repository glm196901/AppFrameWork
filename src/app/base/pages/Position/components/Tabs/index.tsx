import React from 'react';
import { Tabs } from 'antd-mobile';
import styles from './style.less';

const tabs: any = [
  { title: '持仓列表', type: 0 },
  { title: '历史记录', type: 1 }
];
class TabsComponent extends React.PureComponent<any> {
  render() {
    return (
      <div className={styles['bw-market-tabs-layout']}>
        <Tabs
          page={this.props.activeIndex}
          tabs={tabs}
          onChange={e => this.props.onChange(e)}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
        ></Tabs>
      </div>
    );
  }
}

export default React.memo(TabsComponent);
