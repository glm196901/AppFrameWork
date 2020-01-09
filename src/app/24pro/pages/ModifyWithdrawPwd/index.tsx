import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { Button, List, InputItem } from 'antd-mobile';
import { T, dispatch, connect } from '@/_store';

interface Props extends Store.State {}
@connect('userInfo')
class Index extends Component<Props> {
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
  render() {
    const { financeUserData } = this.props.store.userInfo;
    const {
      passwordOld,
      passwordNew,
      passwordNewComfirm,
      isHidepasswordOld,
      isHidepasswordNew,
      isHidepasswordNewComfirm
    } = this.state;
    return (
      <div>
        <Header>修改提款密码</Header>
        <div className={styles['password']}>
          <div className={styles['password-input']}>
            <List>
              <InputItem
                type={isHidepasswordOld ? 'password' : 'text'}
                placeholder={financeUserData.withdrawPw ? '请输入旧提款密码密码' : '请输入登录密码'}
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
                placeholder="请输入新提款密码"
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
                placeholder="请确认新提款密码"
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
            dispatch(T.CHANGE_WITHDRAW_PASSWORD, {
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
