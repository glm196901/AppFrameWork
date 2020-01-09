import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { nameMark, idMark } from '@/app/base/components/tools';
import { Button, List, InputItem } from 'antd-mobile';
import { dispatch, T, connect } from '@/_store';

interface Props extends Store.State {}
@connect('userInfo')
class Index extends Component<Props> {
  state = { realName: '', IdCardNumber: '' };

  // 输入真实姓名
  onChangeRealName = (val: any) => {
    this.setState({ realName: val });
  };
  // 输入身份证号码
  onChangeIdCardNumber = (val: any) => {
    this.setState({ IdCardNumber: val });
  };

  render() {
    const { realName, IdCardNumber } = this.state;
    const { financeUserData = {} } = this.props.store.userInfo;
    return (
      <div>
        <Header>实名认证</Header>
        <div className={styles['login']}>实名认证</div>
        {financeUserData.identityNumberValid ? (
          <div className={styles['realName']}>
            <div className={styles['realName-name']}>{nameMark(financeUserData.name)}</div>
            <div className={styles['realName-verify']}>已实名认证</div>
            <div className={styles['realName-idCard']}>
              {idMark(financeUserData.identityNumber)}
            </div>
          </div>
        ) : (
          <div className={styles['login-input']}>
            <div className={styles['login-input-phone']}>
              <div className={styles['login-input-phone-tip']}>真实姓名</div>
              <div className={styles['login-input-phone-wrap']}>
                <List className={styles['login-input-phone-wrap-number']}>
                  <InputItem
                    type="text"
                    placeholder="请输入真实姓名"
                    minLength={2}
                    maxLength={30}
                    value={realName}
                    onChange={this.onChangeRealName}
                  ></InputItem>
                </List>
                <div
                  onClick={() => {
                    this.setState({ realName: '' });
                  }}
                  className={styles['login-input-phone-wrap-delete']}
                >
                  <i className="iconfont icon-cuowu"></i>
                </div>
              </div>
            </div>
            <div className={styles['login-input-pwd']}>
              <div className={styles['login-input-pwd-tip']}>身份证号</div>
              <div className={styles['login-input-pwd-wrap']}>
                <List className={styles['login-input-pwd-wrap-password']}>
                  <InputItem
                    type="text"
                    placeholder="请输身份证号"
                    maxLength={18}
                    value={IdCardNumber}
                    onChange={this.onChangeIdCardNumber}
                  ></InputItem>
                </List>
                <div
                  onClick={() => {
                    this.setState({ IdCardNumber: '' });
                  }}
                  className={styles['login-input-pwd-wrap-delete']}
                >
                  <i className="iconfont icon-cuowu"></i>
                </div>
              </div>
            </div>
            <Button
              className={styles['login-input-button']}
              onClick={() => {
                dispatch(T.REALNAME_AUTHENTICATION, {
                  realName: realName && realName.replace(/\s+/g, ''),
                  IdCardNumber: IdCardNumber
                });
              }}
            >
              提交
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Index;
