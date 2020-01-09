import React from 'react';
import Header from './components/Header';
import QuotesTitle from './components/QuotesTitle';
import Footer from './components/Footer';
import { withPage, T, dispatch, connect } from '@/_store';
import { RouteComponentProps } from 'react-router-dom';
import Auth from '@/app/base/components/Auth';
import { Button } from 'antd-mobile';
import ChartIQ from './components/ChartIQ';
import styles from './style.less';

type Mock = 'false' | 'true';
type Params = {
  code: string;
  mock: Mock;
};
type productDetail = {
  price: any;
  settle_price_yes: number;
  close: number;
};
interface Props extends RouteComponentProps, Store.State {}
interface State {
  code: string;
  mock: Mock;
  run: boolean; // 行情开关
}

@connect('productDetail', 'productProps', 'quotesList', 'userInfo')
@withPage
export default class App extends React.Component<Props, State> {
  state: State = {
    code: '',
    mock: 'false',
    run: true
  };
  /* ---------------------------------- 生命周期 ---------------------------------- */
  componentDidMount() {
    const { code, mock } = (this.props.match.params as Params) || {};
    this.setState({ code, mock });
    dispatch(T.GET_PRODUCT_DETAIL, { id: code });
    dispatch(T.GET_PRODUCT_PROPS, { id: code });
  }
  onShow = () => {
    this.setState({ run: true }); // 页面显示 启动行情
    const { code, mock } = this.props.match.params as Params;
    const { action } = this.props.history;
    // 只有是前进的到这个页面才会重新获取
    if (action === 'PUSH') {
      this.setState({ code: code, mock: mock });
      dispatch(T.SWITCH_PRODUCT_DETAIL, { id: code });
      dispatch(T.GET_PRODUCT_PROPS, { id: code });
    }
    dispatch(T.GET_PRODUCT_DETAIL, { id: this.state.code });
  };
  onHide = () => {
    dispatch(T.END_PRODUCT_DETAIL); // 页面隐藏 停止行情
    this.setState({ run: false }); // 页面隐藏 停止行情
  };
  /* ---------------------------------- 自定义方法 --------------------------------- */
  // 是否涨跌
  handleIsUpOrDown = (productDetail: productDetail) => {
    if (productDetail.price) {
      const prevValue = productDetail.settle_price_yes || productDetail.close;
      return productDetail.price.sub(prevValue) >= 0 ? styles.upColor : styles.downColor;
    }
  };
  // 切换商品
  handleSwitchCode = (id: string) => {
    this.setState({ code: id });
    dispatch(T.SWITCH_PRODUCT_DETAIL, { id });
    dispatch(T.GET_PRODUCT_PROPS, { id });
  };
  // 切换模拟和实盘
  handleSwitchMock = (mock: Mock) => this.setState({ mock });

  /* --------------------------------- render --------------------------------- */
  public render() {
    const { code, mock, run } = this.state;
    const { userInfo = {} } = this.props.store;
    return (
      <div className={styles['transcation']}>
        <Header
          mock={mock}
          code={code}
          handleSwitchCode={this.handleSwitchCode}
          handleSwitchMock={this.handleSwitchMock}
        />
        <QuotesTitle {...this.props} />
        {code && <ChartIQ code={code} run={run} />}
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
