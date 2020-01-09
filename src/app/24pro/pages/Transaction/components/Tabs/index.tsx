import React from 'react';
import { Tabs } from 'antd-mobile';
import styles from './style.less';
import { Link } from 'react-router-dom';
// const tabs = [
//   { title: '分时', type: '1-minute-mountain' },
//   { title: '1分', type: '1-minute-candle' },
//   { title: '3分', type: '3-minute-candle' },
//   { title: '5分', type: '5-minute-candle' },
//   { title: '15分', type: '15-minute-candle' },
//   { title: '日线', type: '1-day-candle' }
// ];
// 'sline' | '1' | '3' | '5' | '15' | '1D';

const tabs = [
  { title: '分时', type: 'sline' },
  { title: '1分', type: '1' },
  { title: '3分', type: '3' },
  { title: '5分', type: '5' },
  { title: '15分', type: '15' },
  { title: '60分', type: '60' },
  { title: '日线', type: '1D' }
];

class TabsComponent extends React.PureComponent<any> {
  state = {
    page: 0
  };
  render() {
    const { code } = this.props;
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
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={7} />}
        ></Tabs>
        <Link to={`/rules/${code}`} className={styles['bw-market-tabs-layout-rule']}>
          规则
        </Link>
      </div>
    );
  }
}

export default React.memo(TabsComponent);
