import React from 'react';
import Header from './components/Header';
import QuotesTitle from './components/QuotesTitle';
import Footer from './components/Footer';
import Auth from '@/app/base/components/Auth';
import Tabs from './components/Tabs';
import TradingView, { TvType } from '@/app/base/components/TradingView';
import { withPage, T, dispatch, connect } from '@/_store';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'antd-mobile';
import styles from './style.less';

type Mock = boolean;

type Params = {
  code: string;
  mock: Mock;
};

type productDetail = {
  price: any;
  settle_price_yes: number;
  close: number;
};

interface State {
  code: string;
  mock: Mock;
  run: boolean; // 行情开关
  chartType: TvType;
}

interface Props extends RouteComponentProps, Store.State {}

@connect('userInfo', 'productIsupDown')
@withPage
export default class Transaction extends React.PureComponent<Props, State> {
  state: State = {
    code: '', // 商品id
    mock: false, // 是否模拟
    run: true, // 开关
    chartType: 'sline' // 图表类型
  };
  /* ---------------------------------- 生命周期 ---------------------------------- */
  componentDidMount() {
    const { code, mock } = (this.props.match.params as Params) || {};
    this.setState({ code, mock: Object.is(mock, 'true') });
    dispatch(T.GET_PRODUCT_DETAIL, { id: code });
    dispatch(T.GET_PRODUCT_PROPS, { id: code });
  }
  onShow = () => {
    this.setState({ run: true }); // 页面显示 启动行情
    const { code, mock } = this.props.match.params as Params;
    const { action } = this.props.history;
    // 只有是前进的到这个页面才会重新获取
    if (action === 'PUSH' || action === 'REPLACE') {
      this.setState({ code: code, mock: Object.is(mock, 'true') });
      dispatch(T.SWITCH_PRODUCT_DETAIL, { id: code });
      dispatch(T.GET_PRODUCT_PROPS, { id: code });
    }
    dispatch(T.GET_PRODUCT_DETAIL, { id: this.state.code });
  };
  onHide = () => {
    dispatch(T.END_PRODUCT_DETAIL); // 页面隐藏 停止行情
    this.setState({ run: false }); // 页面隐藏 停止图表行情
  };
  /* ---------------------------------- 自定义方法 --------------------------------- */
  // 切换商品
  handleSwitchCode = (id: string) => {
    this.setState({ code: id });
    dispatch(T.SWITCH_PRODUCT_DETAIL, { id });
    dispatch(T.GET_PRODUCT_PROPS, { id });
  };
  // 切换模拟和实盘
  handleSwitchMock = (mock: Mock, code: string) => {
    this.setState({ mock });
  };

  // tab 获取
  hanldeTabChange = (type: TvType) => this.setState({ chartType: type });
  /* --------------------------------- render --------------------------------- */
  public render() {
    const { code, mock, run, chartType } = this.state;
    const { userInfo = {}, productIsupDown } = this.props.store;
    return (
      <div className={styles['transcation']}>
        <Header
          mock={mock}
          code={code}
          handleSwitchCode={this.handleSwitchCode}
          handleSwitchMock={this.handleSwitchMock}
        />
        <QuotesTitle />
        <Tabs code={code} onChange={this.hanldeTabChange} />
        <div style={{ flex: 1 }}>
          <TradingView
            code={code}
            run={run}
            type={chartType as TvType}
            linewidth={2}
            color1={'#ffffff'}
            color2={productIsupDown ? styles.upColor : styles.downColor}
            linecolor={productIsupDown ? styles.upColor : styles.downColor}
            background={'#ffffff'}
            vertGridColor="#cccccc"
            horzGridColor="#cccccc"
            upColor={styles.upColor}
            downColor={styles.downColor}
            crossHair={styles.brandPrimary}
          />
        </div>
        {userInfo.isLogin ? (
          <Footer mock={mock} code={code} />
        ) : (
          <Auth>
            <Button icon="cross-circle" className={styles['login-btn']} style={{ borderRadius: 0 }}>
              未登录
            </Button>
          </Auth>
        )}
      </div>
    );
  }
}
