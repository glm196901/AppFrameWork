import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, dispatch, T } from '@/_store';
import styles from './style.less';

export interface IAppProps extends Store.State, RouteComponentProps {}

@connect('productDetail', 'productProps', 'productIsupDown', 'favorList', 'userInfo')
class QuotesTitle extends React.PureComponent<IAppProps> {
  fun = (props: any) => {
    const S = props.productDetail;
    const { priceDigit } = props.productProps;
    const prevValue = S.settle_price_yes || S.close;
    let rate = (S.price && S.price.sub(prevValue)) || 0;
    let percent: any = rate && rate.div(prevValue);
    rate = rate && `${rate > 0 ? '+' : ''}${Number(rate || 0).toFixed(priceDigit)}`;
    percent = percent && `${rate > 0 ? '+' : ''}${Number(percent.mul(100) || 0).toFixed(2)}%`;
    // +0.00  +0.00%
    return {
      price: Number(S.price || 0).toFixed(priceDigit), // 金额
      rate: rate === 0 ? '+0.00' : rate,
      percent: percent === 0 ? '+0.00%' : percent,
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
  isUporDown = (rate?: number) => {
    return { color: '#ffffff' };
  };

  public render() {
    const { price, rate, percent, code } = this.fun(this.props.store);
    const { productProps = {}, productIsupDown, favorList = [] } = this.props.store;
    const { coins, priceDigit } = productProps; // 判断是否是数字货币 和 期货
    const { wt_buy_volume, wt_sell_volume, hold_volume, lastVolume } = this.fun(this.props.store);
    const { max, min } = this.fun(this.props.store);
    return (
      <div
        className={styles['transaction-quotestitle']}
        style={{ backgroundColor: productIsupDown ? styles.upColor : styles.downColor }}
      >
        <div className={styles['transaction-quotestitle-child']}>
          <div className={styles['transaction-quotestitle-left']}>
            <div className={styles['transaction-quotestitle-rate']}>
              <span style={this.isUporDown(rate)}>{code}</span>
            </div>
            <div className={styles['transaction-quotestitle-price']}>
              <span style={this.isUporDown(rate)}>{price}</span>
              <i
                className="iconfont icon-shoucang"
                style={{
                  fontSize: '16RPX',
                  color: favorList.some((item: any) => Object.is(item, code))
                    ? styles.brandPrimary
                    : '#ccc'
                }}
                onClick={() => {
                  try {
                    this.props.store.userInfo.isLogin
                      ? dispatch(T.ADD_OPTIONAL, { code })
                      : this.props.history.push({
                          pathname: '/login',
                          state: { to: this.props.location.pathname }
                        });
                  } catch (err) {
                    /* eslint-disable */
                    console.log('打印: QuotesTitle -> render -> err', err);
                    /* eslint-enable */
                  }
                }}
              />
            </div>
            <div className={styles['transaction-quotestitle-rate']}>
              <span style={this.isUporDown(rate)}>{rate}</span>
              <span style={this.isUporDown(rate)}>{percent}</span>
            </div>
          </div>
          <div className={styles['transaction-quotestitle-right-body']}>
            <div className={styles['transaction-quotestitle-right']}>
              <div>
                <span style={this.isUporDown(rate)}>{coins ? '24H最高:' : '最高'}</span>
                <span style={this.isUporDown(rate)}>{max && max.toFixed(priceDigit)}</span>
              </div>
              <div>
                <span style={this.isUporDown(rate)}>{coins ? '24H最低:' : '最低'}</span>
                <span style={this.isUporDown(rate)}>{min && min.toFixed(priceDigit)}</span>
              </div>
              {!coins && (
                <div>
                  <span style={this.isUporDown(rate)}>持仓量：</span>
                  <span style={this.isUporDown(rate)}>{hold_volume}</span>
                </div>
              )}
            </div>
            {!coins && (
              <div className={styles['transaction-quotestitle-right']}>
                <div>
                  <span style={this.isUporDown(rate)}>买量：</span>
                  <span style={this.isUporDown(rate)}>{wt_buy_volume} 手</span>
                </div>
                <div>
                  <span style={this.isUporDown(rate)}>卖量：</span>
                  <span style={this.isUporDown(rate)}>{wt_sell_volume} 手</span>
                </div>
                <div>
                  <span style={this.isUporDown(rate)}>总手：</span>
                  <span style={this.isUporDown(rate)}>{lastVolume} 手</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default React.memo(withRouter(QuotesTitle));
