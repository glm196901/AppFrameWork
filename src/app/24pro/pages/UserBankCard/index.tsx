import React, { Component } from 'react';
import styles from './style.less';
// import { Link } from 'react-router-dom';
import { Button, Toast } from 'antd-mobile';

import Loading from './Loading';
import { matchBank, idMark } from '@/app/base/components/tools/index';
import { dispatch, T, connect } from '@/_store';
import Header from '@/app/base/components/Header';

interface Props extends Store.State {}
@connect('userInfo')
class Index extends Component<Props> {
  componentDidMount() {
    dispatch(T.GET_USER_BANKCARD_LIST);
  }
  // 遍历银行卡骨架
  loopBank = (banckCardCount: number) => {
    return Object.keys([...new Array(banckCardCount)]).map(item => {
      return (
        <div key={item} className={styles['boonBank']}>
          <Loading />
          <div style={{ height: '1px', background: '#fff' }}></div>
        </div>
      );
    });
  };
  render() {
    const { userBankCardList = [], financeUserData = {} } = this.props.store.userInfo || {};
    const { name } = financeUserData || {};
    return (
      <div>
        <Header>银行卡管理</Header>
        {!!Boolean(userBankCardList.length) &&
          userBankCardList.map((item: any, key: any) => {
            return (
              <div className={styles['bank-list']}>
                <div className={styles['bank-list-item']} key={key}>
                  <img
                    className={styles['bank-list-item-img']}
                    alt={''}
                    src={matchBank(item.bank)}
                    onClick={() => {
                      this.props.history.push({
                        pathname: '/modifyBankCard',
                        state: { item, name }
                      });
                    }}
                  />
                  <div className={styles['bank-list-item-operate']}>
                    <p
                      className={styles['bank-list-item-operate-default']}
                      onClick={() => {
                        dispatch(T.SET_DEFAULT_BANKCARD, { id: item.id });
                      }}
                    >
                      {item.defaultCard ? '' : '设为默认卡'}
                    </p>
                    <br />
                    <p
                      className={styles['bank-list-item-operate-delete']}
                      onClick={() => {
                        dispatch(T.DELETE_BANKCARD, { id: item.id });
                      }}
                    >
                      删除卡片
                    </p>
                  </div>
                  <div className={styles['bank-list-item-cardNumber']}>
                    {idMark(item.cardNumber)}
                  </div>
                  {item.defaultCard === 1 ? (
                    <div className={styles['bank-list-item-mark']}>默认</div>
                  ) : null}
                </div>
              </div>
            );
          })}
        {!Boolean(userBankCardList.length) && this.loopBank(financeUserData.bankCardCount)}
        {/* <Link to="/addBankCard"> */}
        <Button
          className={styles['addBankBtn']}
          onClick={() => {
            if (financeUserData.identityNumberValid) {
              this.props.history.push('/addBankCard');
            } else {
              Toast.info('请先实名认证', 1);
            }
          }}
        >
          + 添加银行卡
        </Button>
        {/* </Link> */}
      </div>
    );
  }
}

export default Index;
