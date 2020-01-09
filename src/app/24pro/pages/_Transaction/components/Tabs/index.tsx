import React from 'react';
import { Tabs } from 'antd-mobile';
import styles from './style.less';

const tabs = [
  { title: '分时', type: '1-minute-mountain' },
  { title: '1分', type: '1-minute-candle' },
  { title: '3分', type: '3-minute-candle' },
  { title: '5分', type: '5-minute-candle' },
  { title: '15分', type: '15-minute-candle' },
  { title: '日线', type: '1-day-candle' }
];

class TabsComponent extends React.Component<any> {
  state = {
    page: 0
  };
  render() {
    return (
      <div className={styles['bw-market-tabs-layout']}>
        <Tabs
          tabs={tabs}
          initialPage={0}
          swipeable={false}
          page={this.state.page}
          onChange={(e, i) => {
            this.props.onChange(e.type);
            this.setState({ page: i });
          }}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={6} />}
          prerenderingSiblingsNumber={6}
        ></Tabs>
      </div>
    );
  }
}

export default TabsComponent;
