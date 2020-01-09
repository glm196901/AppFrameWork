import React from 'react';
import { createChart } from 'lightweight-charts';
import styles from './style.less';

const option = {
  width: 0,
  height: 0,
  layout: {
    backgroundColor: '#ffffff',
    textColor: '#000000'
  },
  grid: {
    vertLines: {
      color: '#eeeeee'
    },
    horzLines: {
      color: '#eeeeee'
    }
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false
    // lockVisibleTimeRangeOnResize: true,
    // borderColor: 'red'
  },
  handleScroll: {
    vertTouchDrag: false
  },
  priceScale: {
    invertScale: true
  },
  // priceFormatter: function(price) {
  //   return Number(price).toFixed(3);
  // },
  localization: {
    locale: 'zh',
    timeFormatter: function(businessDayOrTimestamp) {
      return new Date((businessDayOrTimestamp - 8 * 60 * 60) * 1000).toLocaleString();
    }
  }
};
export default class extends React.Component {
  state = {
    loading: true
  };
  flag = false;
  componentWillReceiveProps(nextProps) {
    if (this.props.code !== nextProps.code) {
      this.flag = false;
      this.chart.timeScale().resetTimeScale();
      // this.chart.timeScale().scrollToRealTime();
      this.getData(nextProps);
    }
    if (this.props.date !== nextProps.date && this.flag) {
      const areaSeries = nextProps.data;
      this.areaSeries.update(areaSeries);
    }
  }
  componentDidMount() {
    this.dom = document.getElementById('areaSeries');
    this.chart = createChart(this.dom, option);
    this.chart.resize(0, 0);
    this.areaSeries = this.chart.addAreaSeries({
      topColor: styles.topColor,
      bottomColor: styles.bottomColor,
      lineColor: styles.lineColor,
      lineWidth: 1,
      crosshairMarkerVisible: true
    });
    this.getData(this.props);
  }
  getData = ({ type, code }) => {
    this.setState({ loading: true });
    const h = this.dom.clientHeight;
    const w = this.dom.clientWidth;
    const date = +new Date();
    const day = 24 * 60 * 60 * 1000;
    const time = date - day * 1;
    const from = Math.floor(time / 1000);
    const to = Math.floor(date / 1000);
    const url = '/api/tv/tradingView/history';
    const params = `?symbol=${code}&resolution=${type}&from=${from}&to=${to}`;
    fetch(url + params)
      .then(res => res.json())
      .then(data => {
        const areaSeriesData = [];
        if (data.s === 'ok') {
          data.t.forEach((item, index) => {
            areaSeriesData.push({ time: +item + 8 * 60 * 60, value: data.c[index] });
          });
          this.areaSeries.setData(areaSeriesData);
          this.chart.resize(h, w);
          this.flag = true;
          this.setState({ loading: false });
        }
      })
      .catch(() => this.getData(this.props));
  };
  render() {
    return (
      <div
        id="areaSeries"
        style={{ height: '100%', width: '100%', position: 'relative', background: '#ffffff' }}
      >
        <div className={styles.loading} style={{ display: this.state.loading ? 'flex' : 'none' }}>
          <img src={require('./loading-spin.svg')} alt="loading" />
          {/* <p> {this.props.code}</p> */}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 10,
            padding: 5,
            background: 'rgba(0, 0, 0, 0.1)',
            borderRadius: 5,
            fontSize: '12RPX'
          }}
        >
          {this.props.code}
        </div>
      </div>
    );
  }
}
