import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { connect, T, dispatch } from '@/_store';
import dayjs from 'dayjs';
interface Props extends Store.State {}
@connect('userInfo')
class Index extends Component<Props> {
  componentDidMount() {
    dispatch(T.GET_MYUSER);
  }
  state = {
    header: '我的用户',
    tableHead: ['用户', '当天交易', '历史交易', '开户时间'],
    tableList: [],
    userId: 0,
    empty: 'iconfont icon-zanwuneirong'
  };
  render() {
    const { header, tableHead, empty } = this.state;
    const { myUser = {} } = this.props.store.userInfo;
    const { users = [] } = myUser;
    return (
      <div>
        <Header>{header}</Header>
        <div className={styles['myUser']}>
          <div className={styles['myUser-table']}>
            {tableHead.map((item, index) => {
              return (
                <div key={index} className={styles['myUser-table-tableHead']}>
                  {item}
                </div>
              );
            })}
          </div>
          <div className={styles['myUser-myUserList']}>
            {users.length ? (
              users.map((item: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>{item.username}</td>
                    <td>{item.dayTradeVolume}</td>
                    <td>{item.tradeVolume}</td>
                    <td>{dayjs(item.registerTime).format('YYYY-MM-DD')}</td>
                  </tr>
                );
              })
            ) : (
              <div className={styles['myUser-myUserList-noData']}>
                <i className={empty}></i>
                <div>暂无数据</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
