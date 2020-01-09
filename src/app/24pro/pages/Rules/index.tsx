import * as React from 'react';
import Header from '@/app/base/components/Header';
import { connect, dispatch, T } from '@/_store';
import styles from './style.less';

export interface IRulesProps extends Store.State {}

@connect('rules')
export default class Rules extends React.Component<IRulesProps> {
  componentDidMount() {
    const { code } = this.props.match.params as any;
    this.isCoin(code);
    dispatch(T.GET_RULES, { code });
  }
  state = {
    isCoin: ''
  };
  // 判断是否为数字货币
  isCoin = (code: any) => {
    if (code.includes('USDT')) {
      this.setState({ isCoin: true });
    } else {
      this.setState({ isCoin: false });
    }
  };
  public render() {
    const { rules = {} } = this.props.store || {};
    const { isCoin } = this.state;
    return (
      <div className={styles['rules']}>
        <Header fixed>规则</Header>
        <div className={styles['rules-table']}>
          <div>
            <span>交易品种</span>
            <span>{rules.name}</span>
          </div>
          <div>
            <span>货币单位</span>
            <span>{isCoin ? 'USDT' : rules.currency}</span>
          </div>
          <div>
            <span>交易单位</span>
            <span>{rules.unit}</span>
          </div>
          <div>
            <span>{isCoin ? '交易时间' : '最小波动'}</span>
            <span>{isCoin ? rules.buyTimeAM : rules.volatility}</span>
          </div>
          <div>
            <span>{isCoin ? '交易手续费' : '波动盈亏'}</span>
            <span>{isCoin ? rules.chargeUnit : rules.volatilityIncome}</span>
          </div>
          {isCoin ? (
            <div>
              <span>{'发行时间'}</span>
              <span>{rules.publicTime}</span>
            </div>
          ) : (
            <div>
              <span>交易时间</span>
              <span>
                <p>【买入时间】</p>
                <p dangerouslySetInnerHTML={{ __html: rules.buyTimeAM }} />
                <p dangerouslySetInnerHTML={{ __html: rules.buyTimePM }} />
                <p dangerouslySetInnerHTML={{ __html: rules.buyTimeNI }} />
                <p>【卖出时间】</p>
                <p dangerouslySetInnerHTML={{ __html: rules.sellTimeAM }} />
                <p dangerouslySetInnerHTML={{ __html: rules.sellTimePM }} />
                <p dangerouslySetInnerHTML={{ __html: rules.sellTimeNI }} />
              </span>
            </div>
          )}

          <div>
            <span>{isCoin ? '发行总量' : '清仓时间'}</span>
            <span>{isCoin ? rules.publicTotal : rules.clearTime}</span>
          </div>
          <div>
            <span>{isCoin ? '流动总数' : '交易综合费'}</span>
            <span>{isCoin ? rules.publicCurrent : rules.chargeUnit}</span>
          </div>
          <div>
            <span>{isCoin ? '众筹价格' : '汇率'}</span>
            <span>{isCoin ? rules.publicPrice : rules.rate}</span>
          </div>
          {isCoin ? (
            <>
              <div>
                <span>{'白皮书'}</span>
                <span>{rules.shu}</span>
              </div>
              <div>
                <span>{'官网'}</span>
                <span>{rules.publicWeb}</span>
              </div>
              <div>
                <span>{'区块查询'}</span>
                <span>{rules.publicSearch}</span>
              </div>
              <div>
                <span>{'简介'}</span>
                <span>{rules.dec}</span>
              </div>
            </>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
