import * as React from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import MiniTV from '@/app/base/components/MiniTV';
import { connect, dispatch, T } from '@/_store';

import styles from './style.less';

export interface IItemProps extends Store.State, RouteComponentProps {}

@connect('favorList', 'userInfo')
class Item extends React.Component<IItemProps> {
  public isStopOrUpDown = (item: any): any => {
    if (!(item.isOpen || item.id.includes('USDT'))) {
      return styles.stopColor;
    }
    try {
      const num = Number(item.rate.split('%')[0]);
      return num > 0 ? styles.upColor : styles.downColor;
    } catch (err) {
      /* eslint-disable */
      console.error(err);
      /* eslint-enable */
      return '';
    }
  };
  public render() {
    const list = this.props.data || [];
    const { favorList = [], userInfo = {} } = this.props.store;

    return (
      <div className={styles['bw-market-dclist']}>
        {Boolean(list.length) &&
          list.map((item: any) => {
            return (
              <div className={styles['bw-market-dclist-item']} key={item.name}>
                {userInfo.isLogin && (
                  <i
                    className="iconfont icon-shoucang"
                    style={{
                      fontSize: '18RPX',
                      marginRight: '10RPX',
                      color: favorList.some((_item: any) => Object.is(_item, item.code))
                        ? styles.brandPrimary
                        : '#ccc'
                    }}
                    onClick={e => {
                      dispatch(T.ADD_OPTIONAL, { code: item.code });
                    }}
                  />
                )}
                <Link
                  to={`/transaction/${item.id}/${false}`}
                  style={{
                    width: '100%',
                    height: '50px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <div className={styles['bw-market-dclist-left']}>
                    <div>
                      <div className={styles['bw-market-dclist-name']}>
                        <span>{item.name}</span>
                      </div>
                      <div className={styles['bw-market-dclist-code']}>{item.des || item.code}</div>
                    </div>
                  </div>
                  {item.isOpen || item.id.includes('USDT') ? (
                    <div className={styles['bw-market-dclist-miniTV']}>
                      <MiniTV
                        code={item.code}
                        width={80 * 2}
                        height={25}
                        backgroundColor="#ffffff"
                        gridColor="#ffffff"
                        topColor={
                          Number(item.rate.split('%')[0]) > 0 ? styles.upColor : styles.downColor
                        }
                        lineColor={
                          Number(item.rate.split('%')[0]) > 0 ? styles.upColor : styles.downColor
                        }
                        bottomColor="#ffffff"
                        lineWidth={1}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '160RPX',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <img
                        style={{ width: '35RPX', height: '35RPX' }}
                        src={require('@/app/base/static/images/png/stop.jpg')}
                        alt="休市"
                      />
                    </div>
                  )}
                  <div className={styles['bw-market-dclist-right']}>
                    <span
                      className={`${styles['bw-market-dclist-price']}`}
                      style={{ color: this.isStopOrUpDown(item) }}
                    >
                      {item.price}
                    </span>
                    <span
                      className={`${styles['bw-market-dclist-rate']} `}
                      style={{ backgroundColor: this.isStopOrUpDown(item) }}
                    >
                      {item.rate}
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    );
  }
}
export default withRouter(Item);
