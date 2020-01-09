import * as React from 'react';
import dayjs from 'dayjs';
import NoData from '@/app/base/components/NoData';
import { connect } from '@/_store';
import styles from './style.less';

export interface IPositionListProps extends Store.State {}

@connect('positions')
class PositionList extends React.PureComponent<IPositionListProps> {
  public render() {
    const { resultList = [] } = this.props.store.positions || {};
    return (
      <div className={styles['position-list']}>
        {!Boolean(resultList.length) ? (
          <NoData />
        ) : (
          resultList.map((item: any) => {
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
                    <span className={item.isBuy ? styles['up-color'] : styles['down-color']}>
                      状态：{item.isBuy ? '买涨' : '买跌'}
                    </span>
                  </div>
                  {/* <div>
                  <span>合约号：</span>
                </div> */}
                  <div>
                    <span>买入价：{item.opPrice.toFixed(item.priceDigit)}</span>
                    <span className={item.isBuy ? styles['up-color'] : styles['down-color']}>
                      交易量：{item.volume}手
                    </span>
                  </div>
                  <div>
                    <span>平仓价：{Number(item.cpPrice).toFixed(item.priceDigit)}</span>
                    <span>止损价：{item.stopLoss}</span>
                  </div>
                  <div>
                    <span>手续费：{Number(item.serviceCharge).toFixed(2)}</span>
                    <span>止盈价：{item.stopProfit}</span>
                  </div>
                  <div>
                    <span>时间：{dayjs(item.tradeTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </div>
                </div>
                <div className={styles['position-list-item-bottom']}>
                  {item.tradeStatus === 14 ? '结算成功' : '等待结算'}
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

export default React.memo(PositionList);
