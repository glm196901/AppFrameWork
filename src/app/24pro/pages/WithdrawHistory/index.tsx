import * as React from 'react';
import Header from '@/app/base/components/Header';
import { connect, T, dispatch } from '@/_store';
import { List } from 'antd-mobile';
import Loading from './Loading';
import styles from './style.less';
import dayjs from 'dayjs';
const Item = List.Item;

export interface IRechargeHistoryProps extends Store.State {}

@connect('userInfo')
export default class RechargeHistory extends React.Component<IRechargeHistoryProps> {
  componentDidMount() {
    dispatch(T.GET_WITHDRAW_HISTORY_LIST);
    this.countDown();
  }
  timer: any;
  state = {
    countNumber: 5,
    empty: 'iconfont icon-zanwuneirong'
  };
  countDown() {
    const { countNumber } = this.state;
    if (countNumber === 0) {
      clearTimeout(this.timer);
    } else {
      this.timer = setTimeout(() => {
        this.setState({
          countNumber: countNumber - 1
        });
        this.countDown();
      }, 1000);
    }
  }

  public render() {
    const { empty } = this.state;
    const { withdrawHistory = [] } = this.props.store.userInfo || {};
    const { inouts = [] } = withdrawHistory;
    return (
      <div className={styles['pay-history']}>
        <div className={styles['pay-history-header']}>
          <Header>提现记录</Header>
        </div>
        <List>
          {inouts.length ? (
            inouts.map((item: any) => {
              return (
                <Item
                  key={item.id}
                  extra={
                    <div>
                      <div>{item.bankCard}</div>
                      <div>{item.statusName}</div>
                      <div>{dayjs(item.time).format('YYYY-MM-DD')}</div>
                    </div>
                  }
                >
                  {item.type}
                  <div>{item.status === 1 ? `+ ${item.money}` : `- ${item.money}`}</div>
                  {/* <Brief>{new Date(item.time).toLocaleString()}</Brief> */}
                </Item>
              );
            })
          ) : (
            <>
              {/* {setTimeout(() => {

              })} */}
              {this.state.countNumber > 0 ? (
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
              ) : (
                <div className={styles['pay-history-noData']}>
                  <i className={empty}></i>
                  <div>暂无数据</div>
                </div>
              )}
            </>
          )}
        </List>
      </div>
    );
  }
}
