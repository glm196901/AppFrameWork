import * as React from 'react';
import Header from '@/app/base/components/Header';
import { connect, T, dispatch } from '@/_store';
import { List } from 'antd-mobile';
import Loading from './Loading';
import styles from './style.less';
const Item = List.Item;
const Brief = Item.Brief;

export interface IRechargeHistoryProps extends Store.State {}

@connect('payment')
export default class RechargeHistory extends React.Component<IRechargeHistoryProps> {
  componentDidMount() {
    dispatch(T.GET_PAY_HISTORY_LIST);
  }
  public render() {
    const { history = [] } = this.props.store.payment || {};
    return (
      <div className={styles['pay-history']}>
        <div className={styles['pay-history-header']}>
          <Header>充值记录</Header>
        </div>
        <List>
          {history.map((item: any) => {
            return (
              <Item
                key={item.id}
                extra={
                  <div>
                    <div>+{item.money}</div>
                    <div>{item.status}</div>
                  </div>
                }
              >
                {'充值存入'}
                <Brief>{new Date(item.time).toLocaleString()}</Brief>
              </Item>
            );
          })}
          {!Boolean(history.length) && (
            <>
              <Loading />
              <div style={{ height: '1px', background: '#fff' }}></div>
              <Loading />
              <div style={{ height: '1px', background: '#fff' }}></div>
              <Loading />
              <div style={{ height: '1px', background: '#fff' }}></div>
              <Loading />
              <div style={{ height: '1px', background: '#fff' }}></div>
              <Loading />
            </>
          )}
        </List>
      </div>
    );
  }
}
