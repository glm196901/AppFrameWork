import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { dispatch, T, connect } from '@/_store';
import { matchBank, idMark } from '@/app/base/components/tools/index';

interface Props extends Store.State {}
@connect('userInfo')
class Index extends Component<Props> {
  // bankType = [];
  state = {
    table: [],
    bank: '',
    cardNumber: ''
  };

  componentDidMount() {
    dispatch(T.GET_USER_BANKCARD_LIST);
    const { item, name } = this.props.location.state;
    const { province, city, subbranch, bank, cardNumber } = item;
    this.setState({
      table: [
        { title: '开户姓名', content: name },
        { title: '开户省份', content: province },
        { title: '开户城市', content: city },
        { title: '开户支行', content: subbranch }
      ],
      bank: bank,
      cardNumber: cardNumber
    });
  }

  render() {
    const { table, bank, cardNumber } = this.state;
    return (
      <div>
        <Header>银行卡信息</Header>
        <div className={styles['bankInfo']}>
          <div className={styles['bankInfo-card']}>
            <img className={styles['bankInfo-card-img']} alt={''} src={matchBank(bank)} />
            <div className={styles['bankInfo-card-cardNumber']}>{idMark(cardNumber)}</div>
          </div>
          <div className={styles['bankInfo-infoTable']}>
            {table.map((item: any, index: any) => {
              return (
                <div className={styles['bankInfo-infoTable-item']} key={index}>
                  <div className={styles['bankInfo-infoTable-item-left']}>{item.title}</div>
                  <div className={styles['bankInfo-infoTable-item-right']}>{item.content}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
