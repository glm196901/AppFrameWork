import React from 'react';
import { Tabs } from 'antd-mobile';
import styles from './style.less';

const tabs: any = [
  { title: '自选', type: '0' },
  { title: '期货', type: '1' },
  { title: '股指', type: '2' },
  { title: '数字货币', type: '3' }
];
class TabsComponent extends React.PureComponent<any> {
  render() {
    return (
      <div className={styles['bw-market-tabs-layout']}>
        <Tabs
          tabs={tabs}
          page={this.props.page}
          onChange={e => this.props.onChange(e)}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
        ></Tabs>
      </div>
    );
  }
}

export default React.memo(TabsComponent);
