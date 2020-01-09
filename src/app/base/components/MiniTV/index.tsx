import * as React from 'react';
import Loading from './Loading';
import { createChart } from 'lightweight-charts';

export interface IMiniTVProps {
  code: string;
  width: number;
  height: number;
  backgroundColor?: string; // 背景颜色
  gridColor?: string; // 网格颜色
  topColor?: string;
  bottomColor?: string;
  lineColor?: string;
  lineWidth?: number;
}
const isProps = (preProps: any, nextProps: any): boolean => !Object.is(preProps, nextProps);

function callBack(data: any) {
  if (Array.isArray(data.t)) {
    const areaSeriesData: any = [];
    data.t.forEach((item: any, index: any) => {
      areaSeriesData.push({
        time: item * 1000,
        value: data.c[index]
      });
    });
    return areaSeriesData;
  }
  return [];
}
export default class MiniTV extends React.Component<IMiniTVProps, any> {
  _chart: any;
  _areaSeries: any;
  _count: number = 0;
  state = {
    loading: true,
    id: new Date().getTime() + Math.random()
  };
  static defaultProps = {
    code: 'CL2001',
    width: 300,
    height: 150,
    backgroundColor: '#ffffff',
    gridColor: '#ffffff',
    topColor: '#000000',
    bottomColor: '#ffffff',
    lineColor: 'red',
    lineWidth: 1
  };

  public componentDidMount = () => this.getHistory();
  public componentWillReceiveProps = (nextProps: IMiniTVProps) => {
    const a = this.props;
    const b = nextProps;
    if (
      isProps(a.code, b.code) ||
      isProps(a.backgroundColor, b.backgroundColor) ||
      isProps(a.gridColor, b.gridColor) ||
      isProps(a.topColor, b.topColor) ||
      isProps(a.bottomColor, b.bottomColor) ||
      isProps(a.lineColor, b.lineColor) ||
      isProps(a.lineWidth, b.lineWidth)
    ) {
      const Theme = {
        chart: {
          layout: { backgroundColor: b.backgroundColor },
          grid: { vertLines: { color: b.gridColor }, horzLines: { color: b.gridColor } }
        },
        series: {
          topColor: b.topColor,
          lineColor: b.lineColor,
          bottomColor: b.bottomColor,
          lineWidth: b.lineWidth
        }
      };
      if (this._chart) {
        this._chart.applyOptions(Theme.chart);
        this._areaSeries.applyOptions(Theme.series);
      }
    }
  };
  initChart = () => {};
  public getHistory = () => {
    const { code, width, height, gridColor, backgroundColor } = this.props;
    const { topColor, bottomColor, lineColor, lineWidth } = this.props;
    const time: any = Math.floor(+new Date() / 1000);
    const from = time - 60 * 60 * 24;
    const to = time;
    const params = `symbol=${code}&resolution=1&from=${from}&to=${to}`;
    fetch(`/api/tv/tradingView/history?${params}`)
      .then(json => json.json())
      .then(response => {
        let data = [];
        try {
          data = callBack(response);
        } catch (err) {
          data = [];
        }
        // @ts-ignore
        const chart = createChart(document.getElementById('MiniTV-' + this.state.id), {
          width: width,
          height: height,
          priceScale: {
            scaleMargins: {
              top: 0,
              bottom: 0
            },
            position: 'none'
          },
          timeScale: {
            visible: false
          },
          crosshair: {
            horzLine: {
              visible: false
            },
            vertLine: {
              visible: false
            }
          },
          layout: {
            backgroundColor: backgroundColor
          },
          grid: {
            vertLines: {
              color: gridColor
            },
            horzLines: {
              color: gridColor
            }
          },
          handleScroll: {
            mouseWheel: false,
            pressedMouseMove: false
          },
          handleScale: {
            axisPressedMouseMove: false,
            mouseWheel: false,
            pinch: false
          }
        });
        const areaSeries = chart.addAreaSeries({
          // @ts-ignore
          symbol: 'AAPL',
          topColor,
          lineColor,
          bottomColor,
          lineWidth
        });
        chart.addHistogramSeries({
          color: 'rgba(76, 175, 80, 0.5)',
          priceFormat: {
            type: 'volume'
          },
          priceLineVisible: false,
          overlay: true,
          scaleMargins: {
            top: 0,
            bottom: 0
          }
        });
        areaSeries.setData(data);
        this._chart = chart;
        this._areaSeries = areaSeries;
        this.setState({ loading: false });
      })
      .catch((error: any) => {
        this._count++;
        if (this._count < 10) {
          this.getHistory();
        }
        /* eslint-disable */
        console.error(error);
      });
  };
  public render() {
    return (
      <>
        {this.state.loading && <Loading width={this.props.width} height={this.props.height} />}
        <div
          id={'MiniTV-' + this.state.id}
          style={{ width: '100%', height: '100%', display: this.state.loading ? 'none' : 'block' }}
        ></div>
      </>
    );
  }
}
