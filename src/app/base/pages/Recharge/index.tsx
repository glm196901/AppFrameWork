import React, { Component } from 'react';
import { dispatch, T, connect, withPage } from '@/_store';
import { List } from 'antd-mobile';
import Header from '@/app/base/components/Header';
import Loading from './Loading';
import Auth from '@/app/base/components/Auth';
import { withRouter, Link } from 'react-router-dom';
import styles from './style.less';

const Item = List.Item;
const Brief = Item.Brief;

function chooseIcon(name: string) {
  if (name.toLowerCase().indexOf('qq') !== -1) {
    return require('@/app/base/static/images/svg/qq.svg');
  }
  if (name.toLowerCase().indexOf('微信') !== -1) {
    return require('@/app/base/static/images/svg/weChat.svg');
  }
  if (name.indexOf('支付宝') !== -1) {
    return require('@/app/base/static/images/svg/alipay.svg');
  }
  if (name.indexOf('银行卡') !== -1) {
    return require('@/app/base/static/images/svg/uint.svg');
  }
  if (name.indexOf('银联') !== -1) {
    return require('@/app/base/static/images/svg/uint.svg');
  }
  if (name.indexOf('百度') !== -1) {
    return require('@/app/base/static/images/svg/baidupay.svg');
  }
  if (name.indexOf('福旺') !== -1) {
    return require('@app/static/images/svg/fuwang.svg');
  }
}

@connect('payment')
@withPage
class Recharge extends Component<any> {
  onShow = () => dispatch(T.GET_PAYMENT_LIST);
  componentDidMount = () => dispatch(T.GET_PAYMENT_LIST);
  render() {
    const { payList = [] } = this.props.store.payment || {};
    return (
      <div className={styles['recharge']}>
        <Header
          rightIcons={[
            <Auth key="1" to="/rechargeHistory" style={{ marginRight: '15RPX' }}>
              充值记录
            </Auth>
          ]}
        >
          充值
        </Header>
        <List>
          {payList.map((item: any) => {
            return (
              <Item
                className={styles['recharge-itemClass']}
                key={item.id}
                arrow="horizontal"
                thumb={chooseIcon(item.name)}
                multipleLine
                onClick={() => {
                  this.props.history.push({
                    pathname: '/RechargeDetail',
                    state: item
                  });
                }}
              >
                {item.name || item.title} <Brief>{item.subtitle}</Brief>
              </Item>
            );
          })}
        </List>
        {Boolean(payList.length) && (
          <div className={styles['recharge-issue']}>
            充值过程中，有任何额疑问请<Link to="/customerServive">联系客服</Link>
          </div>
        )}
        {!Boolean(payList.length) && (
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
      </div>
    );
  }
}

export default withRouter(Recharge);
