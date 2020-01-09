import React from 'react';
import { Tabs } from 'antd-mobile';
import AreaSeries from './chart/AreaSeries';
import Columnar from './chart/Columnar';
import styles from './style.less';

/* eslint-disable */
const { Contracts } = require(`@/_store/${APP}/saga/services/api/pro/contract`);

class TabsComponent extends React.Component {
  flag = false; // 开关
  state = {
    page: 0, // tabs 位置
    areaSeries: {}, // 山图
    columnar: {}, // 柱状图
    date: 0
  };
  end = () => (this.flag = false);
  loopData = props => {
    this.getData(props)
      .then(data => {
        data.t.forEach((item, index) => {
          this.setState(() => {
            return {
              areaSeries: { time: +item + 8 * 60 * 60, value: data.c[index] },
              columnar: {
                time: +item + 8 * 60 * 60,
                open: data.o[index],
                high: data.h[index],
                low: data.l[index],
                close: data.c[index]
              },
              date: +new Date()
            };
          });
        });
        if (this.flag) {
          setTimeout(() => this.loopData(this.props), 300);
        }
      })
      .catch(() => {
        if (this.flag) {
          setTimeout(() => this.loopData(this.props), 1000);
        }
      });
  };
  getData = ({ code }) => {
    const url = window.quoteURL; // 行情地址
    const date = Math.floor(new Date().getTime() / 1000);
    return new Promise((resolve, reject) => {
      const symbol = Contracts.getItem(code).code;
      fetch(`${url}/quota.jsp?symbol=${symbol}&resolution=1&from=${date}&to=${date}`)
        .then(json => json.json())
        .then(data => resolve(data))
        .catch(e => reject(e));
    });
  };
  componentWillReceiveProps(nextProps) {
    if (this.props.run !== nextProps.run) {
      this.flag = nextProps.run;
      if (nextProps.run) {
        this.loopData(nextProps);
      }
    }
    if (this.props.code !== nextProps.code) {
      this.setState(() => ({ page: 0, date: 0 }));
    }
  }
  componentDidMount() {
    if (this.props.run) {
      this.flag = true;
      this.loopData(this.props); // 获取数据
    }
  }
  render() {
    const code = Contracts.getItem(this.props.code).code;
    const { areaSeries = [], columnar = [], page = 0, date = 0 } = this.state;
    return (
      <div className={styles['bw-market-tabs-layout']}>
        <Tabs
          tabs={[
            { title: '分时' },
            { title: '1分' },
            { title: '3分' },
            { title: '5分' },
            { title: '15分' },
            { title: '日线' }
          ]}
          initialPage={0}
          swipeable={false}
          page={page}
          onChange={(e, i) => this.setState({ page: i })}
          renderTabBar={props => <Tabs.DefaultTabBar {...props} page={6} />}
          prerenderingSiblingsNumber={6}
        >
          {[
            <div style={{ height: '100%', width: '100%' }} key="1">
              <AreaSeries code={code} type="1" data={areaSeries} date={date} />
            </div>,
            <div style={{ height: '100%', width: '100%' }} key="2">
              <Columnar code={code} type="1" data={columnar} date={date} />
            </div>,
            <div style={{ height: '100%', width: '100%' }} key="3">
              <Columnar code={code} type="3" data={columnar} date={date} />
            </div>,
            <div style={{ height: '100%', width: '100%' }} key="4">
              <Columnar code={code} type="5" data={columnar} date={date} />
            </div>,
            <div style={{ height: '100%', width: '100%' }} key="5">
              <Columnar code={code} type="15" data={columnar} date={date} />
            </div>,
            <div style={{ height: '100%', width: '100%' }} key="6">
              <Columnar code={code} type="1D" data={columnar} date={date} />
            </div>
          ]}
        </Tabs>
      </div>
    );
  }
}

export default TabsComponent;
