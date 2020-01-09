import * as React from 'react';
import { dispatch, T, connect } from '@/_store';
import StopModal from './Modal';
import { Modal } from 'antd-mobile';
import dayjs from 'dayjs';
import NoData from '@/app/base/components/NoData';
import styles from './style.less';

export interface IPositionListProps extends Store.State {}

@connect('positions')
class PositionList extends React.PureComponent<IPositionListProps> {
  public modal: any = null;
  stopLoss = (value: number) => {
    this.setState({ valueDown: value });
  };
  stopProfit = (value: number) => {
    this.setState({ valueUp: value });
  };
  // 平仓
  handleClose = (id: string | number) => {
    Modal.alert('提示', '确定平仓吗？', [
      {
        text: '取消',
        onPress: () => {}
      },
      {
        text: '确定',
        onPress: () => {
          dispatch(T.ClOSE_POSTION, { id, mock: !!this.props.mock });
        }
      }
    ]);
  };
  public render() {
    const { positionList = [] } = this.props.store.positions || {};
    return (
      <div className={styles['position-list']}>
        {!Boolean(positionList.length) ? (
          <NoData />
        ) : (
          positionList.map((item: any) => {
            return (
              <div key={item.id} className={styles['position-list-item']}>
                <div className={styles['position-list-item-top']}>
                  <div>
                    <span style={{ fontSize: '16RPX', marginBottom: '10RPX' }}>
                      {item.commodity} ({item.contractCode})
                    </span>
                    <span
                      style={{ fontSize: '16RPX', textAlign: 'right' }}
                      className={item.income >= 0 ? styles['up-color'] : styles['down-color']}
                    >
                      {item.income >= 0 ? '+' + item.income : item.income}
                    </span>
                  </div>
                  <div>
                    <span>订单ID：{item.id}</span>
                  </div>

                  {/* <div>
                  <span>合约号：{}</span>
                </div> */}
                  <div>
                    <span>买入价：{item.opPrice.toFixed(item.priceDigit)}</span>
                    <span className={item.income >= 0 ? styles['up-color'] : styles['down-color']}>
                      当前价：{Number(item.current).toFixed(item.priceDigit)}
                    </span>
                  </div>
                  <div>
                    <span>止损价：{item.stopLoss}</span>
                    <span className={item.isBuy ? styles['up-color'] : styles['down-color']}>
                      状态：{item.isBuy ? '买涨' : '买跌'}
                    </span>
                  </div>
                  <div>
                    <span>止盈价：{item.stopProfit}</span>
                    <span className={item.isBuy ? styles['up-color'] : styles['down-color']}>
                      交易量：{item.volume}手
                    </span>
                  </div>
                  <div>
                    <span>时间：{dayjs(item.tradeTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    <span>手续费：{Number(item.serviceCharge).toFixed(2)}</span>
                  </div>
                </div>

                <div className={styles['position-list-item-bottom']}>
                  <span onClick={this.handleClose.bind(this, item.id)}>平仓</span>
                  <span
                    onClick={() => {
                      this.modal.setState({ visible: true });
                      dispatch(T.GET_UP_DOWN_DATA, { id: item.id });
                    }}
                  >
                    设置止盈止损
                  </span>
                </div>
              </div>
            );
          })
        )}
        <StopModal ref={e => (this.modal = e)} store={this.props.store} />
      </div>
    );
  }
}
export default React.memo(PositionList);
