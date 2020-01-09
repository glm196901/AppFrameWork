import React, { Component } from 'react';
import styles from './style.less';

// @ts-ignore
const SERVICES = require(`@/_store/${APP}/saga/services`).default;

/*------------------------------------------------------*/
const loadJS = (path: string) => {
  const script = document.createElement('script');
  script.src = path;
  document.body.appendChild(script);
};
const loadCSS = (path: string) => {
  const link = document.createElement('link');
  link.href = path;
  link.rel = 'stylesheet';
  const head = document.querySelector('head') as any;
  head.appendChild(link);
};
loadJS(`${process.env.PUBLIC_URL}/chartiq/js/quoteFeedSimulator.js`);
loadJS(`${process.env.PUBLIC_URL}/chartiq/js/chartiq.js`);
const t = setTimeout(() => {
  loadJS(`${process.env.PUBLIC_URL}/chartiq/js/addOns.js`);
  clearTimeout(t);
}, 500);
loadCSS(`${process.env.PUBLIC_URL}/chartiq/css/stx-chart.css`);
loadCSS(`${process.env.PUBLIC_URL}/chartiq/css/chartiq.css`);
/*------------------------------------------------------*/
interface Props {
  code: string; // 商品code CL2001
  type: ChartType; // 图表的切换类型
  MA?: object; // ma线配置对象
  backgroundColor?: string; // 背景颜色
  chartControls?: boolean; // 是否隐藏放在控件
  lineTopStyle?: 'solid' | 'dashed' | 'dotted'; // 线的类型
  lineTopColor?: string; //山图顶部 线的颜色
  linewidth?: number; // 线的粗细
  backgroundColorTop?: string; // 山图面积渐变颜色top
  backgroundColorBottom?: string; // 山图面积渐变颜色bottom
  gridColor?: string; //网格颜色
  fontColor: string; // 左上角字体颜色
  isShowLeftTopView: boolean; // 是否显示左上角的数值
}

/* {时间}-{minute（分） | day（天）}-{mountain（山图） | candle（蜡烛图）} */
export type ChartType =
  | '1-minute-mountain' // 分时山图
  | '1-day-candle' // 日线蜡烛图
  | '1-minute-candle' // 1分拉蜡烛图
  | '3-minute-candle' // 3分拉蜡烛图
  | '5-minute-candle' //5分拉蜡烛图
  | '15-minute-candle'; // 15分拉蜡烛图

class ChartIQ extends Component<Props> {
  static defaultProps = {
    code: 'CL2001',
    MA: {
      5: 'rgba(150,95,196,0.7)',
      10: 'rgba(132,170,213,0.7)',
      20: 'rgba(85,178,99,0.7)',
      40: 'rgba(183,36,138,0.7)'
    },
    type: '1-minute-mountain',
    backgroundColor: '#000000',
    chartControls: true,
    lineTopStyle: 'solid',
    lineTopColor: '#ffffff',
    linewidth: 2,
    backgroundColorTop: 'green',
    backgroundColorBottom: '#000000',
    gridColor: '#000000',
    isShowLeftTopView: true,
    fontColor: '#ffffff'
  };
  componentDidMount() {
    SERVICES().then(({ ChartIQ, Contracts }: any) => {
      this.init(ChartIQ, Contracts);
    });
  }
  // componentWillMount() {
  //   SERVICES().then(({ ChartIQ }) => ChartIQ.destroy());
  // }
  // props发生变化
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.code !== nextProps.code) {
      SERVICES().then(({ ChartIQ }: any) => {
        ChartIQ.swapContract(nextProps.code);
      });
    } else if (this.props.type !== nextProps.type) {
      SERVICES().then(({ ChartIQ }: any) => {
        const type = this.props.type as string;
        const [interval, timeUnit, chartType] = type.split('-');
        const info = {
          period: 1,
          interval,
          timeUnit
        };
        ChartIQ.swapResolutionAndChartStyle(info, chartType);
      });
    } else {
      this.overrides(nextProps);
    }
  }

  overrides = (props: Props) => {
    SERVICES().then(({ ChartIQ }: any) => {
      const { lineTopStyle, lineTopColor, linewidth } = props;
      const { backgroundColorTop, backgroundColorBottom } = props;
      const { chartControls, gridColor } = props;
      ChartIQ.stxx.setStyle('stx_mountain_chart', 'border-top-style', lineTopStyle);
      ChartIQ.stxx.setStyle('stx_mountain_chart', 'width', linewidth);
      ChartIQ.stxx.setStyle('stx_mountain_chart', 'borderTopColor', lineTopColor);
      ChartIQ.stxx.setStyle('stx_mountain_chart', 'backgroundColor', backgroundColorTop);
      ChartIQ.stxx.setStyle('stx_mountain_chart', 'color', backgroundColorBottom);
      ChartIQ.stxx.setStyle('stx_grid', 'color', gridColor);
      // 是否隐藏缩放按钮
      if (chartControls && ChartIQ.stxx && ChartIQ.stxx.controls.chartControls) {
        ChartIQ.stxx.controls.chartControls.style.display = 'none';
        ChartIQ.stxx.controls.chartControls = null;
      }
    });
  };
  init = async (ChartIQ: any, Contracts: any) => {
    const { code, MA } = this.props;
    let option = {
      contract: code,
      domName: '#chartIQ',
      MA: {
        period: Object.keys(MA as object),
        colors: Object.values(MA as object)
      },
      contracts: Contracts,
      info: { open: '#huOpen', high: '#huHigh', close: '#huClose', low: '#huLow' }
    };
    ChartIQ.init(option);
    this.overrides(this.props);
  };
  render() {
    return (
      <div
        id="chartIQ"
        className={styles['bw-chartiq-container']}
        style={{
          height: '100%',
          width: '100%',
          background: this.props.backgroundColor,
          position: 'relative'
        }}
      >
        {this.props.isShowLeftTopView && (
          <ul className={styles['controls']} style={{ color: this.props.fontColor }}>
            <li>
              <span className="huLabel">开=</span>
              <span id="huOpen" />
            </li>
            <li>
              <span className="huLabel">高=</span>
              <span id="huHigh" />
            </li>
            <li>
              <span className="huLabel">低=</span>
              <span id="huLow" />
            </li>
            <li>
              <span className="huLabel">收=</span>
              <span id="huClose" className={'huField'} />
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default ChartIQ;
