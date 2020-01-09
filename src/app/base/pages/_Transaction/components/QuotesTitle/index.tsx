import * as React from 'react';
import styles from './style.less';

export interface IAppProps extends Store.State {}

export default class App extends React.Component<IAppProps> {
  fun = (props: any) => {
    const S = props.productDetail;
    // const { priceDigit } = props.productProps;
    const prevValue = S.settle_price_yes || S.close;
    let rate = S.price && S.price.sub(prevValue);
    let percent: any = rate && rate.div(prevValue);
    rate = rate && `${rate >= 0 ? '+' : ''}${Number(rate || 0).toFixed(2)}`;
    percent = percent && `${rate >= 0 ? '+' : ''}${Number(percent.mul(100) || 0).toFixed(2)}%`;
    return {
      price: S.price, // 金额
      rate,
      percent,
      wt_buy_volume: S.wt_buy_volume, // 买手
      wt_sell_volume: S.wt_sell_volume, // 卖手
      code: S.code, // 合约号
      hold_volume: S.hold_volume, //持仓
      lastVolume: S.lastVolume, // 总手
      close: S.close,
      open: S.open,
      max: S.max,
      min: S.min
    };
  };
  isUporDown = (rate: number) => {
    return { color: rate >= 0 ? styles.upColor : styles.downColor };
  };
  public render() {
    const { price, rate, percent, code } = this.fun(this.props.store);
    // const { wt_buy_volume, wt_sell_volume, hold_volume, lastVolume } = this.fun(this.props.store);
    const { max, min, open, close } = this.fun(this.props.store);
    return (
      <div className={styles['transaction-quotestitle']}>
        <div className={styles['transaction-quotestitle-left']}>
          <div className={styles['transaction-quotestitle-rate']}>
            <span style={this.isUporDown(rate)}>{code}</span>
          </div>
          <div className={styles['transaction-quotestitle-price']}>
            <span style={this.isUporDown(rate)}>{price}</span>
            <img src="" alt="" />
          </div>
          <div className={styles['transaction-quotestitle-rate']}>
            <span style={this.isUporDown(rate)}>{rate}</span>
            <span style={this.isUporDown(rate)}>{percent}</span>
          </div>
        </div>
        <div className={styles['transaction-quotestitle-right-body']}>
          <div className={styles['transaction-quotestitle-right']} style={{ marginRight: '10RPX' }}>
            <div>
              <span>高：</span>
              <span>{max}</span>
            </div>
            <div>
              <span>低：</span>
              <span>{min}</span>
            </div>
          </div>
          <div className={styles['transaction-quotestitle-right']}>
            <div>
              <span>开：</span>
              <span>{open}</span>
            </div>
            <div>
              <span>收：</span>
              <span>{close}</span>
            </div>
            {/* <div>
              <span>持仓：</span>
              <span>{hold_volume}</span>
            </div>
            <div>
              <span>总手：</span>
              <span>{lastVolume}</span>
            </div>
            <div>
              <span>买量：</span>
              <span>{wt_buy_volume}</span>
            </div>
            <div>
              <span>卖量：</span>
              <span>{wt_sell_volume}</span>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}
