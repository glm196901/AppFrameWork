import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { Button, List, InputItem } from 'antd-mobile';
import { Link, withRouter } from 'react-router-dom';
import { T, dispatch, connect } from '@/_store';

@connect('userInfo')
class Index extends Component<any> {
  state = {
    username: '',
    password: '',
    phone: '',
    code: '',
    checkProtocol: false,
    showPortocol: false,
    step: 1,
    isHidePassWord: true,
    register: '极速开户'
  };
  // 输入电话
  onChangePhone = (val: any) => {
    if (!/^[0-9]{0,11}$/.test(val)) return null;
    this.setState({ phone: val });
  };
  onChangePassword = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ password: val });
  };
  //输入验证码
  onChangeCode = (val: any) => {
    if (!/^[0-9]{0,4}$/.test(val)) return null;
    this.setState({ code: val });
  };
  //点击隐藏密码
  onChangeHideMode = () => {
    const { isHidePassWord } = this.state;
    this.setState({
      isHidePassWord: !isHidePassWord
    });
  };
  goToRegister = (
    <div key="register" className={styles['goToRegister']}>
      <Link to={'/register'}>{this.state.register}</Link>
    </div>
  );

  render() {
    const { isHidePassWord, phone, password } = this.state;
    const { to = null } = this.props.location.state || {};
    return (
      <div>
        <Header rightIcons={[this.goToRegister]}>登录</Header>
        <div className={styles['login']}>账号登录</div>
        <div className={styles['login-input']}>
          <div className={styles['login-input-phone']}>
            <div className={styles['login-input-phone-tip']}>手机号</div>
            <div className={styles['login-input-phone-wrap']}>
              <List className={styles['login-input-phone-wrap-number']}>
                <InputItem
                  type="number"
                  placeholder="请输入手机号"
                  maxLength={11}
                  onChange={this.onChangePhone}
                ></InputItem>
              </List>
            </div>
          </div>
          <div className={styles['login-input-pwd']}>
            <div className={styles['login-input-pwd-tip']}>密码</div>
            <div className={styles['login-input-pwd-wrap']}>
              <List className={styles['login-input-pwd-wrap-password']}>
                <InputItem
                  type={this.state.isHidePassWord ? 'password' : 'text'}
                  placeholder="请输入密码"
                  onChange={this.onChangePassword}
                  maxLength={16}
                  minLength={6}
                ></InputItem>
              </List>
              <div className={styles['login-input-pwd-wrap-code']} onClick={this.onChangeHideMode}>
                {isHidePassWord ? (
                  <i className="iconfont icon-yincang"></i>
                ) : (
                  <i className="iconfont icon-xianshi"></i>
                )}
              </div>
            </div>
          </div>
          <div className={styles['login-input-forgetwrap']}>
            <Link to="/forgetLoginpwd">忘记密码</Link>
          </div>
        </div>
        <Button
          className={styles['login-button']}
          disabled={phone && password ? false : true}
          onClick={() => {
            dispatch(T.SUBMIT_LOGIN, {
              mobile: this.state.phone,
              password: this.state.password,
              test: true,
              to
            });
          }}
        >
          登录
        </Button>
      </div>
    );
  }
}

export default withRouter(Index);
