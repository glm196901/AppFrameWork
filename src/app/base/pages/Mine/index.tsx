import React, { Component } from 'react';
import styles from './style.less';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect, dispatch, T, withPage } from '@/_store';
import { Toast } from 'antd-mobile';
import profile from '@/app/base/static/images/svg/profile.svg';
const Line = () => (
  <div className={styles['mine-down-option-line']}>
    <p></p>
    <div></div>
  </div>
);

const options = [
  {
    title: '资金明细',
    icon: 'iconfont icon-mingxi',
    link: '/fundsList',
    verified: ''
  },
  // {
  //   title: '交易记录',
  //   icon: require('@/app/base/static/images/svg/footer_mine.svg'),
  //   link: '/transactionRecord',
  //   verified: ''
  // },
  {
    title: '账户安全',
    icon: 'iconfont icon-zhanghu',
    link: '/accountSafety',
    realName: '待实名认证'
  },
  {
    title: '我的持仓',
    icon: 'iconfont icon-chicang',
    link: '/position/false/false'
  },
  { title: '推广赚钱', icon: 'iconfont icon-tuiguang', link: '/promote' },
  { title: '我的用户', icon: 'iconfont icon-wodeyonghuqun', link: '/myUser' }
];

interface Props extends Store.State, RouteComponentProps {}
@connect('userInfo')
@withPage
class Mine extends Component<Props> {
  state = {
    isLogin: true,
    verified: true,
    withdrawPassword: true,
    assetMoneyShow: true,
    profilePath: profile,
    deposit: ['余额', '模拟币'],
    gofont: 'iconfont icon-icon-up',
    register: '极速开户'
  };
  assetMoneyShow = () => {
    const { assetMoneyShow } = this.state;
    this.setState({ assetMoneyShow: !assetMoneyShow });
  };
  // 判断是否实名
  identityNumberVerify = (val: any, islogin: any) => {
    if (val === true) {
      // return '/withdraw';
      return this.props.history.push('/withdraw');
    } else {
      if (islogin) {
        Toast.info('请先实名认证', 1);
      } else {
        return this.props.history.push('/login');
      }
    }
  };

  render() {
    const { isLogin, basicUserData = {}, financeUserData = {} } = this.props.store.userInfo;
    const { assetMoneyShow, profilePath, deposit, gofont, register } = this.state;
    return (
      <div className={styles['mine']}>
        <div className={styles['mine-up']}>
          <div className={styles['mine-up-profile']}>
            {isLogin ? (
              <div className={styles['mine-up-profile-relect']}>
                <div>
                  <img
                    className={styles['mine-up-profile-relect-profile']}
                    src={profilePath}
                    alt=""
                  />
                </div>
                <div className={styles['mine-up-profile-relect-login']}>
                  {basicUserData.username + ',' + basicUserData.hello}
                </div>
                <div
                  className={styles['mine-up-profile-relect-logout']}
                  onClick={() => {
                    dispatch(T.OUT_LOGIN);
                  }}
                >
                  退出
                </div>
              </div>
            ) : (
              <div className={styles['mine-up-profile-relect']}>
                <Link to="/login">
                  <div className={styles['mine-up-profile-relect-login']}>登录</div>
                </Link>
                <p className={styles['mine-up-profile-relect-lean']}>/</p>
                <Link to="/register">
                  <div className={styles['mine-up-profile-relect-register']}>{register}</div>
                </Link>
              </div>
            )}
          </div>
          <div className={styles['mine-up-fund']}>
            <div className={styles['mine-up-fund-sum']}>
              <span>总资产</span>
              <span
                className={styles['mine-up-fund-sum-assetMoneyShow']}
                onClick={() => {
                  this.assetMoneyShow();
                }}
              >
                {assetMoneyShow ? (
                  <i className="iconfont icon-yincang"></i>
                ) : (
                  <i className="iconfont icon-xianshi"></i>
                )}
              </span>
            </div>

            <div className={styles['mine-up-fund-left']}>
              {/* <div className={styles['mine-up-fund-left-money']}></div> */}
              {deposit.map((item, index) => {
                return (
                  <div key={index} className={styles['mine-up-fund-left-depost']}>
                    <div>{item}</div>
                    <div>
                      {isLogin && basicUserData && item === '余额'
                        ? `${assetMoneyShow ? Math.floor(basicUserData.money * 100) / 100 : '****'}`
                        : `${isLogin ? '' : '**'}`}
                      {isLogin && basicUserData && item === '模拟币'
                        ? `${assetMoneyShow ? Math.floor(basicUserData.game * 100) / 100 : '****'}`
                        : `${isLogin ? '' : '**'}`}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles['mine-up-fund-line']}></div>
            <div className={styles['mine-up-fund-right']}>
              <Link to={'/recharge'}>
                <div className={styles['mine-up-fund-right-charge']}>充值</div>
              </Link>
              <div
                onClick={() => {
                  this.identityNumberVerify(financeUserData.identityNumberValid, isLogin);
                }}
                className={styles['mine-up-fund-right-withdraw']}
              >
                提现
              </div>
            </div>
          </div>
        </div>
        <div className={styles['mine-down']}>
          {options.map((item, key) => {
            return (
              <Link to={item.link} key={key} className={styles['mine-down-option']}>
                <div className={styles['mine-down-option-wrap']}>
                  <div className={styles['mine-down-option-wrap-icon']}>
                    {/* <i src={item.icon} alt="" /> */}
                    <i className={`${item.icon} ${styles['mine-down-option-wrap-icon-i']}`}></i>
                  </div>
                  <div className={styles['mine-down-option-wrap-title']}>{item.title}</div>
                  <div className={styles['mine-down-option-wrap-description']}>
                    {isLogin && item.title === '账户安全' && financeUserData.identityNumberValid
                      ? '已实名'
                      : item.realName}
                  </div>
                  <div className={styles['mine-down-option-wrap-triangle']}>
                    {/* <img src={require('@/app/base/static/images/svg/home_quotes_hot.svg')} alt="" /> */}
                    <i className={gofont}></i>
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

export default Mine;
