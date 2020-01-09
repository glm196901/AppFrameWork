import React from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';

const option = {
  crosshair: {
    mode: CrosshairMode.Normal
  },
  layout: {
    backgroundColor: '#ffffff',
    textColor: '#000000'
  },
  grid: {
    vertLines: { color: '#eeeeee' },
    horzLines: { color: '#eeeeee' }
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false
  },
  // priceScale: {
  //   invertScale: true
  // },
  localization: {
    locale: 'zh',
    timeFormatter: function(businessDayOrTimestamp) {
      return new Date((businessDayOrTimestamp - 8 * 60 * 60) * 1000).toLocaleString();
    }
  },
  priceFormatter: function(price) {
    return String(price);
  }
};

export default class extends React.Component {
  flag = false;
  componentWillReceiveProps(nextProps) {
    if (this.props.code !== nextProps.code) {
      this.flag = false;
      this.chart.timeScale().resetTimeScale();
      this.getData(nextProps);
    }
    if (this.props.date !== nextProps.date && this.flag) {
      const candleSeries = nextProps.data;
      this.candleSeries.update(candleSeries);
    }
  }
  componentDidMount() {
    this.dom = document.getElementById(`Columnar-${this.props.type}`);
    this.chart = createChart(this.dom, option);
    this.chart.resize(0, 0);
    this.candleSeries = this.chart.addCandlestickSeries({
      upColor: '#ef5350',
      downColor: '#26a69a',
      wickUpColor: '#ef5350',
      wickDownColor: '#26a69a',
      borderUpColor: '#ef5350',
      borderDownColor: '#26a69a'
    });
    this.getData(this.props);
  }
  getData = ({ type, code }) => {
    const date = +new Date();
    const day = 24 * 60 * 60 * 1000;
    const time = Object.is(type, '1D') ? date - day * 30 : date - day * 1;
    const from = Math.floor(time / 1000);
    const to = Math.floor(date / 1000);
    const url = '/api/tv/tradingView/history';
    const params = `?symbol=${code}&resolution=${type}&from=${from}&to=${to}`;
    fetch(url + params)
      .then(res => res.json())
      .then(data => {
        const candleSeriesData = [];
        if (data.t && Array.isArray(data.t) && Boolean(data.t.length)) {
          data.t.forEach((item, index) => {
            candleSeriesData.push({
              time: +item + 8 * 60 * 60,
              open: data.o[index],
              high: data.h[index],
              low: data.l[index],
              close: data.c[index]
            });
          });
          this.candleSeries.setData(candleSeriesData);
          const h = this.dom.clientHeight;
          const w = this.dom.clientWidth;
          this.chart.resize(h, w);
          this.flag = true;
        }
      })
      .catch(() => this.getData(this.props));
  };

  render() {
    return (
      <div
        id={`Columnar-${this.props.type}`}
        style={{ height: '100%', width: '100%', position: 'absolute' }}
      >
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
