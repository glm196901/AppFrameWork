import * as React from 'react';
import styles from './style.less';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom';

export interface IQuotesBlockItemProps extends RouteComponentProps {
  data: Array<any>;
  name: string;
}
class QuotesBlockItem extends React.Component<IQuotesBlockItemProps> {
  public render() {
    return (
      <div className={styles['bw-home-qbi-container']}>
        <div className={styles['bw-home-qbi-header']}>
          <span className={styles['bw-home-qbi-header-left']}>{this.props.name}</span>
          <Link
            to={{ pathname: '/market', state: { activeIndex: 3 } }}
            className={styles['bw-home-qbi-header-right']}
          >
            数字货币7*24小时全天交易 〉
          </Link>
        </div>
        <div style={{ height: '1RPX', backgroundColor: '#f9f9f9' }} />
        <div className={styles['bw-home-qbi-list']}>
          {Boolean(this.props.data.length) &&
            this.props.data.map((item: any) => {
              const { rate = '+0.00%', price = 0, isOpen = true } = item || {};
              return (
                <Link
                  key={item.id}
                  className={`${styles['bw-home-qbi-list-item']} ${
                    item.flux !== null
                      ? `${
                          item.flux === true
                            ? styles['bw-home-qbi-list-itemUp']
                            : styles['bw-home-qbi-list-itemDown']
                        }`
                      : ''
                  }  `}
                  to={`/transaction/${item.id}/${false}`}
                >
                  <div className={styles['bw-home-qbi-list-item-name']}>
                    <span className={isOpen ? '' : styles['gray-color']}>{item.name}</span>
                    {/* <img src={require('@/app/base/static/images/svg/home_quotes_hot.svg')} /> */}
                  </div>
                  <div
                    className={`${styles['bw-home-qbi-list-item-price']} ${
                      Number(String(rate).split('%')[0]) > 0
                        ? styles['up-color']
                        : styles['down-color']
                    }  ${isOpen ? '' : styles['gray-color']}`}
                  >
                    <i
                      className={
                        Number(String(rate).split('%')[0]) > 0
                          ? `${'iconfont icon-zhang'}`
                          : `${'iconfont icon-die'}`
                      }
                    ></i>
                    {price}
                  </div>
                  <div
                    className={`${styles['bw-home-qbi-list-item-amplitude']} ${
                      Number(String(rate).split('%')[0]) > 0
                        ? styles['up-color']
                        : styles['down-color']
                    } ${isOpen ? '' : styles['gray-color']}`}
                  >
                    {isOpen ? rate : '休市'}
                  </div>
                </Link>
              );
            })}
        </div>
        <div style={{ height: '5RPX', backgroundColor: '#f9f9f9' }} />
      </div>
    );
  }
}
export default withRouter(QuotesBlockItem);
