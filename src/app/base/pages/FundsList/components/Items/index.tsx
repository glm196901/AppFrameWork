import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.less';
import dayjs from 'dayjs';
export interface IItemProps extends Store.State {}

export default class Item extends React.Component<IItemProps> {
  // 看字变色
  // changeColor = (text: string) => {
  //   if (text === '网站活动') return { color: 'rgba(185, 205, 246)' };
  // };
  public render() {
    const list = this.props.data || [];
    return (
      <div className={styles['bw-market-dclist']}>
        {Boolean(list.length) &&
          list.map((item: any) => {
            return (
              <Link
                key={item.name}
                className={styles['bw-market-dclist-item']}
                to={{
                  pathname: '/fundDetail',
                  state: {
                    money: (item.type === 200 ? '-' : '+') + item.money,
                    explain: item.explain,
                    assetMoney: item.assetMoney,
                    createTime: item.createTime,
                    detail: item.detail
                  }
                }}
              >
                {/* style={this.changeColor(item.explain)} */}
                <div>{item.explain}</div>
                <div>
                  {item.type === 100
                    ? '+' + Math.floor(item.money * 100) / 100
                    : '-' + Math.floor(item.money * 100) / 100}
                </div>
                <div>{dayjs(item.createTime).format('YYYY-MM-DD HH:mm')}</div>
                {/* <div>-></div>
                 */}
                <i className={'iconfont icon-icon-up'}></i>
              </Link>
            );
          })}
      </div>
    );
  }
}
