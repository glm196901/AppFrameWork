import React from 'react';
// import styles from './style.less';
import { Tabs } from 'antd-mobile';
const tabs: any = [
  { title: '充提款', type: 1 },
  { title: '交易', type: 2 },
  { title: '佣金', type: 3 }
  // { title: '积分', type: 4 }
];
class TabsComponent extends React.Component<any> {
  render() {
    return (
      <Tabs
        tabs={tabs}
        onChange={e => this.props.onChange(e)}
        renderTabBar={props => <Tabs.DefaultTabBar {...props} page={5} />}
      ></Tabs>
    );
  }
}

export default TabsComponent;
