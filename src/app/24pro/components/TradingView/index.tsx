import React from 'react';

// @ts-ignore
const SERVICES = require(`@/_store/${APP}/saga/services`).default;

export type TvType = 'sline' | '1' | '3' | '5' | '15' | '60' | '1D';

interface Props {
  code: string; // 商品代码 CL
  type?: TvType; // 图表类型 分时 1分 5分 15分 日线
  color1?: string; // 面积图的顶部颜色和color2组成渐变
  color2?: string; // 面积图的底部颜色和color1组成渐变
  linecolor?: string; // 面积图上面线的颜色
  linewidth?: number; // 线的大小
  background?: string; // 背景颜色
  vertGridColor?: string; // 纵向网格颜色
  horzGridColor?: string; // 横向网格颜色
  crossHair?: string; // 触摸十字架的颜色
  run: boolean; // 启动停止开关
  upColor: string; //涨颜色
  downColor: string; //跌颜色
}

const isProps = (preProps: any, nextProps: any): boolean => !Object.is(preProps, nextProps);

class TradingView extends React.PureComponent<Props> {
  static defaultProps = {
    color1: '#ffffff',
    color2: '#000000',
    linecolor: '#ffffff',
    linewidth: 5,
    background: '#000000',
    vertGridColor: '#000000',
    horzGridColor: '#000000',
    crossHair: '#ffffff'
  };
  // 挂载
  componentDidMount = () => this.init();
  // props发生变化
  componentWillReceiveProps(nextProps: Props) {
    // 商品变化
    if (isProps(this.props.code, nextProps.code)) {
      SERVICES().then(({ Chart }: any) => {
        Chart && Chart.swap({ code: nextProps.code });
      });
    }
    // 图表类型变化
    if (isProps(this.props.type, nextProps.type)) {
      SERVICES().then(({ Chart }: any) => {
        Chart && Chart.swap({ type: nextProps.type });
      });
    }
    if (isProps(this.props.run, nextProps.run)) {
      if (nextProps.run) {
        SERVICES().then(({ Chart }: any) => {
          Chart.start(nextProps.code);
        });
      } else {
        SERVICES().then(({ Chart }: any) => {
          Chart.exit();
        });
      }
    }
    if (
      isProps(this.props.color1, nextProps.color1) ||
      isProps(this.props.color2, nextProps.color2) ||
      isProps(this.props.linecolor, nextProps.linecolor) ||
      isProps(this.props.linewidth, nextProps.linewidth) ||
      isProps(this.props.background, nextProps.background) ||
      isProps(this.props.vertGridColor, nextProps.vertGridColor) ||
      isProps(this.props.horzGridColor, nextProps.horzGridColor) ||
      isProps(this.props.crossHair, nextProps.crossHair)
    ) {
      SERVICES().then(({ Chart }: any) => {
        if (Chart && Chart.widget && Chart.widget.onChartReady) {
          Chart.widget.onChartReady(() => {
            if (nextProps.run && Chart && Chart.widget && Chart.widget.applyOverrides) {
              Chart.widget.applyOverrides(this.overrides(nextProps));
            }
          });
        }
      });
    }
  }

  overrides = (props: Props) => {
    const { color1, color2 } = props; // 渐变
    const { linecolor, linewidth } = props; // 线的颜色|宽度
    const { vertGridColor, horzGridColor } = props; // 网格的颜色
    const { background, crossHair } = props;
    const config = {
      'mainSeriesProperties.areaStyle.color1': color1,
      'mainSeriesProperties.areaStyle.color2': color2,
      'mainSeriesProperties.areaStyle.linecolor': linecolor,
      'mainSeriesProperties.areaStyle.linewidth': linewidth,
      'paneProperties.background': background,
      'paneProperties.vertGridProperties.color': vertGridColor,
      'paneProperties.horzGridProperties.color': horzGridColor,
      'paneProperties.crossHairProperties.color': crossHair
    };
    return config;
  };

  init = () => {
    const { upColor, downColor } = this.props;
    const tradingView: any = document.querySelector('#tradingView');
    SERVICES().then(({ Contracts, Chart }: any) => {
      if (JSON.stringify(Contracts._total) !== '{}' && Chart) {
        const option = {
          dom: 'tradingView',
          code: this.props.code,
          height: tradingView.clientHeight,
          width: tradingView.clientWidth,
          contract: Contracts,
          autosize: true,
          RAISE: upColor,
          FALL: downColor,
          overrides: this.overrides(this.props)
        };
        Chart.init(option);
      }
    });
  };
  render() {
    return <div id="tradingView" style={{ height: '100%', width: '100%' }}></div>;
  }
}

export default TradingView;
