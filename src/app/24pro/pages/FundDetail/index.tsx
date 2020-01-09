import React, { Component } from 'react';
import { connect } from '@/_store';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import dayjs from 'dayjs';
export interface Props extends Store.State {}
const table = ['账户余额', '创建时间', '详情'];
@connect('userInfo')
class Index extends Component<Props> {
  render() {
    const { assetMoney, detail, money, explain, createTime } = this.props.location.state || {};
    return (
      <div>
        <Header>资金明细</Header>
        <div className={styles['fundDetail-up']}>
          <div className={styles['fundDetail-up-money']}>{money}</div>
          <div className={styles['fundDetail-up-des']}>{explain}</div>
        </div>
        {table.map((item, index) => {
          return (
            <div className={styles['fundDetail-down']} key={index}>
              <div className={styles['fundDetail-down-left']}>{item}</div>
              <div className={styles['fundDetail-down-right']}>
                {item === '账户余额' && Math.floor(assetMoney * 100) / 100}
                {item === '创建时间' && dayjs(createTime).format('YYYY-MM-DD')}
                {item === '详情' && detail}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Index;
