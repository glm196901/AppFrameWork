import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.less';

export interface IItemProps extends Store.State {}

export default class Item extends React.Component<IItemProps> {
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
                to={`/transaction/${item.id}/`}
              >
                {item.assetMoney}
              </Link>
            );
          })}
      </div>
    );
  }
}
