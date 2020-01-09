import React, { Component } from 'react';
import styles from './style.less';
import { Link } from 'react-router-dom';
import { mobileMask, nameMark } from '@/app/base/components/tools';

// import { connect, dispatch, T } from '@/_store';
import { connect } from '@/_store';

import Header from '@/app/base/components/Header';

const Line = () => (
  <div className={styles['mine-down-option-line']}>
    <p></p>
    <div></div>
  </div>
);
const options = [
  {
    title: '实名认证',
    icon: 'iconfont icon-shimingrenzheng3',
    link: '/realNameAuthentication',
    realName: '待完成'
  },
  {
    title: '手机绑定',
    icon: 'iconfont icon-shoujibangding',
    link: '/phoneBond',
    phoneBond: '去登录'
  },
  {
    title: '登录密码',
    icon: 'iconfont icon-denglumima',
    link: '/modifyLoginPwd',
    loginPwd: '修改'
  },
  {
    title: '提款密码',
    icon: 'iconfont icon-zijinmima',
    link: '/modifywithdrawPwd',
    withdrawPwd: '未设置'
  },
  {
    title: '银行卡',
    icon: 'iconfont icon-yinhangka',
    link: '/userBankCard',
    bankCard: '添加'
  }
];

interface Props extends Store.State {}
@connect('userInfo')
class index extends Component<Props> {
  state = {
    isLogin: true,
    verified: true,
    withdrawPassword: true
  };
  render() {
    const { isLogin, financeUserData = {} } = this.props.store.userInfo;
    // const { isLogin, basicUserData = {}, financeUserData = {} } = this.props.store.userInfo;
    return (
      <div className={styles['mine']}>
        <Header>账户安全</Header>

        <div className={styles['mine-down']}>
          {options.map((item, key) => {
            return (
              <Link
                to={isLogin ? item.link : '/login'}
                key={key}
                className={styles['mine-down-option']}
              >
                <div className={styles['mine-down-option-wrap']}>
                  <div className={styles['mine-down-option-wrap-icon']}>
                    <i className={item.icon}></i>
                  </div>
                  <div className={styles['mine-down-option-wrap-title']}>{item.title}</div>
                  <div className={styles['mine-down-option-wrap-description']}>
                    {isLogin && item.title === '实名认证' && financeUserData.identityNumberValid
                      ? nameMark(financeUserData.name)
                      : item.realName}
                    {isLogin && item.title === '手机绑定'
                      ? mobileMask(financeUserData.mobile)
                      : item.phoneBond}
                    {isLogin && item.title === '登录密码' ? item.loginPwd : ''}
                    {isLogin && item.title === '提款密码' && financeUserData.withdrawPw
                      ? '修改'
                      : item.withdrawPwd}
                    {isLogin && item.title === '银行卡' && financeUserData.bankCardCount
                      ? `${financeUserData.bankCardCount}张`
                      : item.bankCard}
                  </div>
                  <div className={styles['mine-down-option-wrap-triangle']}>
                    {/* <img src={require('@/app/base/static/images/svg/home_quotes_hot.svg')} alt="" /> */}
                  </div>
                </div>
                <Line />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}

export default index;
