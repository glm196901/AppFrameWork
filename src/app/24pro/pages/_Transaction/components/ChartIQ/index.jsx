import React from 'react';
import { Tabs } from 'antd-mobile';
import styles from './style.less';

/* eslint-disable */
const { Contracts } = require(`@/_store/${APP}/saga/services/api/pro/contract`);

/**
 * chartType mountain || candle
 * resolution => 1 3 5 15 D 1D
 */

const tabs = [
  { title: '分时', resolution: 1, chartType: 'mountain' },
  { title: '1分', resolution: 1, chartType: 'candle' },
  { title: '3分', resolution: 3, chartType: 'candle' },
  { title: '5分', resolution: 5, chartType: 'candle' },
  { title: '15分', resolution: 15, chartType: 'candle' },
  { title: '日线', resolution: 'D', chartType: 'candle' }
];
export default class extends React.Component {
  state = {
    page: 0
  };
  componentWillReceiveProps(nextProps) {
    // if (this.props.run !== nextProps.run) {
    //   if (nextProps.run) {
    //   }
    // }
    if (this.props.code !== nextProps.code) {
      this.loadChart(nextProps.code, 1, 'mountain');
      this.setState({ page: 0 });
    }
  }
  componentDidMount() {
    this.IQ = document.getElementById('IQ').contentWindow;
    const { code } = this.props;
    this.IQ.onload = () => this.loadChart(code, 1, 'mountain');
  }
  loadChart = (code, resolution, chartType = 'mountain') => {
    const symbol = Contracts.getItem(code).code;
    this.IQ.loadChart(symbol, resolution, chartType);
    this.IQ.stxx.setStyle('stx_mountain_chart', 'backgroundColor', styles.brandPrimary);
    this.IQ.stxx.setStyle('stx_mountain_chart', 'borderTopColor', styles.brandPrimary);
  };
  hanldeOnChangeTabs = ({ resolution, chartType }, index) => {
    this.setState({ page: index });
    const { code } = this.props;
    this.loadChart(code, resolution, chartType);
  };
  render() {
    return (
      <div className={styles['chartiq']}>
        <div>
          <Tabs
            tabs={tabs}
            initialPage={0}
            swipeable={false}
            page={this.state.page}
            onChange={this.hanldeOnChangeTabs}
            renderTabBar={props => <Tabs.DefaultTabBar {...props} page={7} />}
            prerenderingSiblingsNumber={6}
          ></Tabs>
        </div>
        <iframe
          id="IQ"
          title="chartiq"
          src={`${process.env.PUBLIC_URL}/iq/index.html`}
          frameBorder="0"
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    );
  }
}
