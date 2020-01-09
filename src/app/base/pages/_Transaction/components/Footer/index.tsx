import * as React from 'react';
import { Modal, Button } from 'antd-mobile';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { dispatch, T, connect } from '@/_store';
import styles from './style.less';

export interface IFooterProps extends Store.State, RouteComponentProps {}
export interface IFooterState {
  visible: boolean;
  submitType: 0 | 1; // 1 买涨 0 买跌
  volumeIndex: number;
  stopLessIndex: number;
}
// /**
//  * @param {number} volumeIndex - 手数
//  * @param {number} stopLessIndex - 设置止损
//  * @param {string} code - 合约号
//  * @param {boolean} mock - 模拟
//  * @param {boolean} isBuy - 买涨买跌
//  * @param {boolean} order - 是否发起订单
//  */
@connect('userInfo', 'transactionMoadl', 'productDetail')
class Footer extends React.Component<IFooterProps, IFooterState> {
  state: IFooterState = {
    visible: false,
    submitType: 0,
    volumeIndex: 0,
    stopLessIndex: 0
  };
  componentWillReceiveProps(nextProps: any) {
    if (this.props.code !== nextProps.code) {
      this.switchCode(nextProps);
    }
    if (
      this.props.store.transactionMoadl.success !== nextProps.store.transactionMoadl.success &&
      nextProps.store.transactionMoadl.success
    ) {
      this.setState({ visible: false }, () => {
        // 成功后关闭 并且初始化操作状态
        dispatch(T.SET_TRANAACTION_MODAL, { success: false });
      });
    }
  }
  componentDidMount() {
    this.switchCode(this.props);
  }
  handleSwitch = (index: number, type: number) => {
    if (type === 0) {
      this.setState({ volumeIndex: index }, () => {
        this.switchCode(this.props);
      });
    }
    if (type === 1) {
      this.setState({ stopLessIndex: index }, () => {
        this.switchCode(this.props);
      });
    }
  };
  switchCode = (props: any) => {
    dispatch(T.GET_OR_SUBMIT_TRANAACTION, {
      volumeIndex: this.state.volumeIndex,
      stopLessIndex: this.state.stopLessIndex,
      code: props.code,
      mock: props.mock
    });
  };
  submit = () => {
    dispatch(T.GET_OR_SUBMIT_TRANAACTION, {
      volumeIndex: this.state.volumeIndex,
      stopLessIndex: this.state.stopLessIndex,
      code: this.props.code,
      mock: this.props.mock === 'true',
      isBuy: this.state.submitType,
      order: true
    });
  };
  handleTransaction = (type: 0 | 1) => {
    this.setState({ submitType: type, visible: true });
  };
  // 充值
  handleAddMoney = (mock: string) => {
    if (mock === 'true') {
      dispatch(T.ADD_MOCK_MONEY);
    } else {
      // 充值
      this.setState({ visible: false });
      this.props.history.push('/recharge');
    }
  };
  public render() {
    const { visible, submitType, volumeIndex, stopLessIndex } = this.state;
    const { mock } = this.props;
    const { transactionMoadl = {}, userInfo = {}, productDetail = {} } = this.props.store;
    const { money = '', game = '' } = userInfo.basicUserData || {};
    const { volumeList = [], stopLossList = [], stopProfitList = [] } = transactionMoadl.SHOW || {};
    const { name, code, charge = 0 } = transactionMoadl.SHOW || {};
    return (
      <div className={styles['transaction-footer']}>
        {/* <div className={styles['transaction-footer-1']}>闪电下单</div> */}
        <div
          className={styles['transaction-footer-2']}
          onClick={this.handleTransaction.bind(this, 1)}
        >
          <span>{productDetail.wt_sell_price}</span>
          <span>买涨</span>
        </div>
        <div
          className={styles['transaction-footer-3']}
          onClick={this.handleTransaction.bind(this, 0)}
        >
          <span>{productDetail.wt_buy_price}</span>
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
                {mock === 'true' ? '模拟' : '账户'}金额：{mock === 'true' ? game : money}
              </span>
              <Button type="primary" size="small" onClick={this.handleAddMoney.bind(this, mock)}>
                {mock === 'true' ? '一键加币' : '充值'}
              </Button>
            </div>
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
              <div>触发止赢</div>
              <div>{stopProfitList[stopLessIndex]}元</div>
            </div>
            {/*  */}
            <div className={styles['transaction-footer-modal-service']}>
              <div>交易综合费</div>
              <div>{charge}元</div>
            </div>
            {/*  */}

            <Button
              onClick={this.submit}
              className={`${styles['transaction-footer-modal-submit']} ${
                submitType ? styles['up'] : styles['down']
              }`}
            >
              {(submitType === 0 && '确定买跌') || (submitType && '确定买涨')}
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Footer);
