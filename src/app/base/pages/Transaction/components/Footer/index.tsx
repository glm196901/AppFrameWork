import * as React from 'react';
import { Modal, Button, Toast } from 'antd-mobile';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { dispatch, T, connect } from '@/_store';
import NP from 'number-precision';

import styles from './style.less';

export interface IFooterProps extends Store.State, RouteComponentProps {}
export interface IFooterState {
  visible: boolean;
  submitType: 0 | 1; // 1 买涨 0 买跌
  volumeIndex: number;
  stopLessIndex: number;
  moneyType: number;
  loading: boolean; // 计算的loading
}

@connect('userInfo', 'transactionMoadl', 'productDetail', 'productProps')
class Footer extends React.PureComponent<IFooterProps, IFooterState> {
  state: IFooterState = {
    visible: false,
    submitType: 0,
    volumeIndex: 0, // 手数
    stopLessIndex: 0, // 止损
    moneyType: 0, // 金额模式
    loading: false
  };
  // 商品 或者 交易模式发生变更
  componentWillReceiveProps(nextProps: any) {
    if (this.props.code !== nextProps.code) {
      this.switchCode(nextProps, 0);
    }
    if (this.props.mock !== nextProps.mock) {
      this.switchCode(nextProps, 0);
    }
  }
  // 初始化
  componentDidMount() {
    this.switchCode(this.props, 0);
  }
  // 各种模式的或者金额的选择的公共方法处理
  handleSwitch = (index: number, type: number) => {
    // 手数
    if (type === 0) {
      this.setState({ volumeIndex: index }, () => this.switchCode(this.props, 1));
    }
    // 止损
    if (type === 1) {
      this.setState({ stopLessIndex: index }, () => this.switchCode(this.props, 1));
    }
    // 金额模式
    if (type === 2) {
      this.setState({ moneyType: index }, () => this.switchCode(this.props, 1));
    }
  };
  // 0 代表模拟 或者 商品发生变化  1 代表计算
  switchCode = (props: any, type: number) => {
    if (type === 0) {
      const init = {
        volumeIndex: 0,
        stopLessIndex: 0,
        moneyType: 0
      };
      this.setState(init, () => {
        dispatch(T.GET_OR_SUBMIT_TRANAACTION, {
          ...init,
          code: props.code,
          mock: props.mock,
          callback: this.submitCallback
        });
      });
    }
    if (type === 1) {
      dispatch(T.GET_OR_SUBMIT_TRANAACTION, {
        volumeIndex: this.state.volumeIndex,
        stopLessIndex: this.state.stopLessIndex,
        moneyType: this.state.moneyType,
        code: props.code,
        mock: props.mock,
        callback: this.submitCallback
      });
    }
  };
  // 提交订单的回掉
  submitCallback = ({ status, loading, msg }: any) => {
    if (loading === 'open') {
      this.setState({ loading: true });
      return Toast.loading('', 0);
    }
    if (loading === 'closed') {
      this.setState({ loading: false });
      return Toast.hide();
    }
    if (status === 'ok') {
      this.setState({ visible: false });
      return Toast.success('买入委托已提交', 1);
    }
    // 登录失效
    if (status === 401) {
      this.setState({ visible: false });
      return;
    }
    if (msg) {
      Modal.alert('', <div dangerouslySetInnerHTML={{ __html: msg }}></div>);
      return;
    }
  };
  // 发起订单的方法
  submit = () => {
    dispatch(T.GET_OR_SUBMIT_TRANAACTION, {
      volumeIndex: this.state.volumeIndex,
      stopLessIndex: this.state.stopLessIndex,
      code: this.props.code,
      mock: this.props.mock,
      isBuy: this.state.submitType,
      moneyType: this.state.moneyType,
      order: true,
      callback: this.submitCallback
    });
  };
  // 显示交易的modal type 为买涨 还是买跌
  handleTransaction = (type: 0 | 1) => {
    this.setState({ submitType: type, visible: true });
  };
  // 充值
  handleAddMoney = (mock: string) => {
    // 模拟币充值
    if (mock) {
      dispatch(T.ADD_MOCK_MONEY);
    } else {
      // 跳转到充值页面
      this.setState({ visible: false });
      this.props.history.push('/recharge');
    }
  };
  public render() {
    const { visible, submitType, volumeIndex, stopLessIndex, loading, moneyType } = this.state;
    const { mock } = this.props;
    const {
      transactionMoadl = {},
      userInfo = {},
      productDetail = {},
      productProps = {}
    } = this.props.store;
    const { priceDigit } = productProps;
    const { wt_sell_price = '', wt_buy_price = '' } = productDetail;
    const { money = '', game = '' } = userInfo.basicUserData || {};
    const { volumeList = [], stopLossList = [], stopProfitList = [] } = transactionMoadl.SHOW || {};
    const { name, code, deductCharge = 0 } = transactionMoadl.SHOW || {};
    const { moneyName = [] } = transactionMoadl.SHOW || {};
    return (
      <div className={styles['transaction-footer']}>
        {/* <div className={styles['transaction-footer-1']}>闪电下单</div> */}
        <div
          className={styles['transaction-footer-2']}
          onClick={this.handleTransaction.bind(this, 1)}
        >
          <span>{wt_sell_price && wt_sell_price.toFixed(priceDigit)}</span>
          <span>买涨</span>
        </div>
        <div
          className={styles['transaction-footer-3']}
          onClick={this.handleTransaction.bind(this, 0)}
        >
          <span>{wt_buy_price && wt_buy_price.toFixed(priceDigit)}</span>
          <span>买跌</span>
        </div>
        <Modal
          popup={true}
          closable
          visible={visible}
          className={styles['modal-body']}
          animationType="slide-up"
          onClose={() => this.setState({ visible: false })}
        >
          <div className={styles['transaction-footer-modal']}>
            <div className={styles['transaction-footer-modal-title']}>
              {name}({code})
            </div>
            <div className={styles['transaction-footer-modal-price']}>
              <span>
                {mock ? '模拟' : '账户'}金额：
                {mock ? Math.floor(game * 100) / 100 : Math.floor(money * 100) / 100}
              </span>
              <Button type="primary" size="small" onClick={this.handleAddMoney.bind(this, mock)}>
                {mock ? '一键加币' : '充值'}
              </Button>
            </div>
            <div style={{ height: 1, backgroundColor: '#eeeeee', margin: 0 }}></div>
            <div className={styles['transaction-footer-modal-money-mode']}>
              <div>金额模式</div>
              <div className={styles['transaction-footer-modal-money-mode-list']}>
                {moneyName.map((item: number, index: number) => {
                  return (
                    <div key={index}>
                      <Button
                        type={moneyType === index ? 'primary' : undefined}
                        size="small"
                        onClick={this.handleSwitch.bind(this, index, 2)}
                      >
                        {item}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: '#eeeeee', margin: 0 }}></div>
            {/*  */}
            <div className={styles['transaction-footer-modal-lots']}>
              <div>交易手数</div>
              <div className={styles['transaction-footer-modal-lots-list']}>
                {volumeList.map((item: number, index: number) => {
                  return (
                    <div key={index}>
                      <Button
                        type={volumeIndex === index ? 'primary' : undefined}
                        size="small"
                        onClick={this.handleSwitch.bind(this, index, 0)}
                      >
                        {item}手
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: '#eeeeee', margin: 0 }}></div>
            {/*  */}
            <div className={styles['transaction-footer-modal-down']}>
              <div>触发止损</div>
              <div className={styles['transaction-footer-modal-down-list']}>
                {stopLossList.map((item: number, index: number) => {
                  return (
                    <Button
                      key={index}
                      type={stopLessIndex === index ? 'primary' : undefined}
                      size="small"
                      onClick={this.handleSwitch.bind(this, index, 1)}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>
            </div>
            {/*  */}
            <div className={styles['transaction-footer-modal-up']}>
              <div>触发止盈</div>
              <div>{stopProfitList[stopLessIndex]}元</div>
            </div>
            <div style={{ height: 1, backgroundColor: '#eeeeee', margin: 0 }}></div>
            {/*  */}
            <div className={styles['transaction-footer-modal-service']}>
              <div>交易综合费</div>
              <div>{Number(deductCharge) < 0 ? '计算中' : deductCharge}元</div>
            </div>
            <div className={styles['transaction-footer-modal-service']}>
              <div>履约保证金</div>
              <div>{Number(Math.abs(stopLossList[stopLessIndex] || 0)).toFixed(2)}元</div>
            </div>
            <div className={styles['transaction-footer-modal-service']}>
              <div>合计支付</div>
              <div>
                {Number(deductCharge) < 0
                  ? '计算中'
                  : Number(
                      NP.plus(
                        Math.abs(stopLossList[stopLessIndex] || 0),
                        Math.abs(deductCharge || 0)
                      )
                    ).toFixed(2)}
                元
              </div>
            </div>
            {/*  */}

            <Button
              loading={loading}
              disabled={loading}
              onClick={this.submit}
              className={`${styles['transaction-footer-modal-submit']} ${
                submitType ? styles['up'] : styles['down']
              }`}
            >
              {(submitType === 0 && `${productDetail.wt_buy_price} 买跌`) ||
                (submitType && `${productDetail.wt_sell_price} 买涨`)}
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default React.memo(withRouter(Footer));
