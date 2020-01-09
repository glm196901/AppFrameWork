import * as React from 'react';
import { Modal, Slider } from 'antd-mobile';
import { dispatch, T } from '@/_store';
import styles from './style.less';

export interface IModalProps extends Store.State {}

class IModal extends React.Component<IModalProps> {
  state = {
    visible: false,
    profitValue: 0, // 止赢
    lossValue: 0 // 止损
  };
  hanldeCloseModal = () => this.setState({ visible: false, profitValue: 0, lossValue: 0 });
  submitCallback = ({ status }: any) => status === 'ok' && this.hanldeCloseModal();
  handleSubmit = (stopProfitIndex: number, stopLossIndex: number) => {
    const payload = {
      profit: stopProfitIndex,
      loss: stopLossIndex,
      order: true,
      callback: this.submitCallback // 回调
    };
    dispatch(T.SUBMIT_UP_DOWN, payload);
  };

  public render() {
    const { visible, profitValue, lossValue } = this.state; // 显示 和 本地操作的滑动数据
    const { upDownInfo = {} } = this.props.store.positions || {};
    const { stopProfitIndex = 0, stopLossIndex = 0 } = upDownInfo; // 操作过后的状态
    const { stopProfitMin = 0, stopProfitMax = 0 } = upDownInfo; // 止赢的 区间
    const { stopLossMin = 0, stopLossMax = 0 } = upDownInfo; //   止损的区间
    const { stopProfitStep = 0, stopLossStep = 0 } = upDownInfo; // 滑动条 最大值
    const { stopProfit, stopLoss } = upDownInfo; // 止赢 止损的计算后的值
    return (
      <>
        <Modal
          visible={visible}
          transparent
          maskClosable={false}
          title="设置止盈止损"
          closable
          onClose={this.hanldeCloseModal}
          footer={[
            {
              text: '取消',
              onPress: () => this.hanldeCloseModal()
            },
            {
              text: '确定',
              onPress: () => this.handleSubmit(stopProfitIndex, stopLossIndex)
            }
          ]}
        >
          <div className={styles['modal-body']}>
            <div>
              <p>
                <span style={{ marginRight: '15RPX' }}>止盈</span>
                <span className={styles['up-color']}>{stopProfit}</span>
              </p>
              <div className={styles['modal-body-flex']}>
                <span>{stopProfitMin}</span>
                <span>{stopProfitMax}</span>
              </div>
              <div></div>
              <br />
              <div className={styles['modal-body-slider']}>
                <div
                  onClick={() => {
                    this.setState({ profitValue });
                    dispatch(T.SUBMIT_UP_DOWN, { profit: stopProfitIndex - 1 });
                  }}
                  className={styles['modal-body-slider-sub']}
                >
                  —
                </div>
                <Slider
                  max={stopProfitStep}
                  min={1}
                  value={profitValue || stopProfitIndex}
                  onChange={value => {
                    this.setState({ profitValue });
                    dispatch(T.SUBMIT_UP_DOWN, { profit: value });
                  }}
                />
                <div
                  onClick={() => {
                    this.setState({ profitValue });
                    dispatch(T.SUBMIT_UP_DOWN, { profit: stopProfitIndex + 1 });
                  }}
                  className={styles['modal-body-slider-add']}
                >
                  +
                </div>
              </div>
            </div>
            <div>
              <p>
                <span style={{ marginRight: '15RPX' }}>止损</span>
                <span className={styles['down-color']}>{stopLoss}</span>
              </p>
              <div className={styles['modal-body-flex']}>
                <span>{stopLossMin}</span>
                <span>{stopLossMax}</span>
              </div>
              <br />
              <div className={styles['modal-body-slider']}>
                <div
                  className={styles['modal-body-slider-sub']}
                  onClick={() => {
                    this.setState({ lossValue });
                    dispatch(T.SUBMIT_UP_DOWN, { loss: stopLossIndex - 1 });
                  }}
                >
                  —
                </div>
                <Slider
                  max={stopLossStep}
                  min={1}
                  value={lossValue || stopLossIndex}
                  onChange={value => {
                    this.setState({ lossValue });
                    dispatch(T.SUBMIT_UP_DOWN, { loss: value });
                  }}
                />
                <div
                  className={styles['modal-body-slider-add']}
                  onClick={() => {
                    this.setState({ lossValue });
                    dispatch(T.SUBMIT_UP_DOWN, { loss: stopLossIndex + 1 });
                  }}
                >
                  +
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </>
    );
  }
}
export default IModal;
