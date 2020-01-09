import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { Button, List, InputItem } from 'antd-mobile';
import { T, dispatch } from '@/_store';

class Index extends Component<any> {
  state = {
    passwordOld: '',
    passwordNew: '',
    passwordNewComfirm: '',
    isHidepasswordOld: true,
    isHidepasswordNew: true,
    isHidepasswordNewComfirm: true
  };
  // 旧密码
  onChangePasswordOld = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ passwordOld: val });
  };
  // 新密码
  onChangePasswordNew = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ passwordNew: val });
  };
  // 重复新密码
  onChangePasswordNewComfirm = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ passwordNewComfirm: val });
  };
  //输入验证码
  onChangeCode = (val: any) => {
    if (!/^[0-9]{0,4}$/.test(val)) return null;
    this.setState({ code: val });
  };
  render() {
    const {
      isHidepasswordOld,
      passwordNewComfirm,
      isHidepasswordNew,
      isHidepasswordNewComfirm,
      passwordOld,
      passwordNew
    } = this.state;
    return (
      <div>
        <Header>修改登录密码</Header>
        <div className={styles['password']}>
          <div className={styles['password-input']}>
            <List>
              <InputItem
                type={isHidepasswordOld ? 'password' : 'text'}
                placeholder="请输入原登录密码"
                onChange={this.onChangePasswordOld}
                maxLength={16}
                minLength={6}
              ></InputItem>
            </List>
            <div
              className={styles['password-show']}
              onClick={() => this.setState({ isHidepasswordOld: !isHidepasswordOld })}
            >
              {isHidepasswordOld ? (
                <i className="iconfont icon-yincang"></i>
              ) : (
                <i className="iconfont icon-xianshi"></i>
              )}
            </div>
          </div>
          <div className={styles['password-input']}>
            <List>
              <InputItem
                type={isHidepasswordNew ? 'password' : 'text'}
                placeholder="请输入新登录密码"
                onChange={this.onChangePasswordNew}
                maxLength={16}
                minLength={6}
              ></InputItem>
            </List>
            <div
              className={styles['password-show']}
              onClick={() => this.setState({ isHidepasswordNew: !isHidepasswordNew })}
            >
              {isHidepasswordNew ? (
                <i className="iconfont icon-yincang"></i>
              ) : (
                <i className="iconfont icon-xianshi"></i>
              )}
            </div>
          </div>
          <div className={styles['password-input']}>
            <List>
              <InputItem
                type={isHidepasswordNewComfirm ? 'password' : 'text'}
                placeholder="请确认新登录密码"
                onChange={this.onChangePasswordNewComfirm}
                maxLength={16}
                minLength={6}
              ></InputItem>
            </List>
            <div
              className={styles['password-show']}
              onClick={() => this.setState({ isHidepasswordNewComfirm: !isHidepasswordNewComfirm })}
            >
              {isHidepasswordNewComfirm ? (
                <i className="iconfont icon-yincang"></i>
              ) : (
                <i className="iconfont icon-xianshi"></i>
              )}
            </div>
          </div>
        </div>

        <Button
          className={styles['login-button']}
          disabled={passwordOld && passwordNew && passwordNewComfirm ? false : true}
          onClick={() => {
            dispatch(T.CHANGE_LOGIN_PASSWORD, {
              oldPassWord: passwordOld,
              newPassWord: passwordNew,
              newPassWordComfirmation: passwordNewComfirm
            });
          }}
        >
          确认修改
        </Button>
      </div>
    );
  }
}

export default Index;
