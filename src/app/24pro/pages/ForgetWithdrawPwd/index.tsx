import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { Button, List, InputItem, Toast, Modal } from 'antd-mobile';
import { mobileMask } from '@/app/base/components/tools';
import { T, dispatch, connect } from '@/_store';

interface Props extends Store.State {}
@connect('userInfo')
class Index extends Component<Props> {
  timer: any;
  state = {
    imgCode: '',
    imgCodeSrc: `/api/vf/verifyCode.jpg?_=${new Date()}`,
    messageCode: '',
    step: 1,
    count: '获取验证码',
    countNumber: 60,
    showModal: false,
    status: 'ok',
    realName: '',
    identityNumber: '',
    password: '',
    confirmPassword: '',
    isHidePassword: true,
    isHidePasswordComfirm: true
  };

  // 输入图形验证码
  onChangeImgCode = (val: any) => {
    this.setState({ imgCode: val });
  };
  //更新图形验证码
  updateImgCode = () => {
    this.setState({
      imgCodeSrc: `/api/vf/verifyCode.jpg?_=${new Date()}`
    });
  };
  //显示获取验证码框
  showModal = () => {
    if (this.state.count === '获取验证码') {
      this.setState({
        showModal: true
      });
    } else {
      Toast.info(`请${this.state.countNumber}s后重试`, 1);
    }
  };
  closeModal = () => {
    this.setState({
      showModal: false
    });
  };
  // 60s
  countDown() {
    const { countNumber } = this.state;
    if (countNumber === 0) {
      this.setState({
        count: '获取验证码',
        countNumber: 60
      });
    } else {
      this.timer = setTimeout(() => {
        this.setState({
          countNumber: countNumber - 1,
          count: `${countNumber}s`
        });
        this.countDown();
      }, 1000);
    }
  }
  // 验证提交图形验证码
  validImgCode = (phone: any, imgCode: any, type: any) => {
    dispatch(T.GET_FORGET_MESSAGECODE, {
      phone: phone,
      imgCode: imgCode,
      type: type,
      callback: this.validImgCodeCallback
    });
  };
  // 验证图形验证码后回调
  validImgCodeCallback = ({ status }: any) => {
    if (status === 'ok') {
      this.closeModal();
      this.countDown();
    }
  };
  //输入短信验证码
  onChangeCode = (val: any) => {
    if (!/^[0-9]{0,4}$/.test(val)) return null;
    this.setState({ messageCode: val });
  };

  // 按钮显示文字
  showButtonText = (step: number) => {
    if (step === 1) {
      return '下一步';
    } else if (step === 2) {
      return '验证';
    } else {
      return '确认';
    }
  };

  // 验证短信验证码后回调
  validMessageCodeCallback = ({ status }: any) => {
    if (status === 'ok') {
      this.setState({ step: 2 });
    } else {
      this.setState({ step: 3 });
    }
  };
  // 实名验证后回调
  validRealNameSuccess = ({ status }: any) => {
    if (status === 'ok') {
      this.setState({ step: 3 });
    }
  };
  //输入身份证号
  onChangeRealName = (val: string) => {
    this.setState({ realName: val });
  };
  // 真实姓名
  onChangeidentityNumber = (val: string) => {
    this.setState({ identityNumber: val });
  };
  // 输入密码
  onChangePassword = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ password: val });
  };
  // 确认密码
  onChangePasswordConfirm = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ confirmPassword: val });
  };

  render() {
    const { financeUserData = {} } = this.props.store.userInfo;
    const {
      imgCode,
      count,
      step,
      messageCode,
      realName,
      identityNumber,
      password,
      confirmPassword,
      isHidePassword,
      isHidePasswordComfirm
    } = this.state;
    return (
      <div>
        <Header>忘记提款密码</Header>
        <div className={styles['login']}>找回提款密码</div>
        {step === 1 ? (
          <div className={styles['login-input']}>
            <div className={styles['login-input-phone']}>
              <div className={styles['login-input-phone-tip']}>手机号</div>
              <div className={styles['login-input-phone-wrap']}>
                <div className={styles['login-input-phone-wrap-number']}>
                  {mobileMask(financeUserData.mobile)}
                </div>
              </div>
            </div>
            <div className={styles['login-input-pwd']}>
              <div className={styles['login-input-pwd-tip']}>验证码</div>
              <div className={styles['login-input-pwd-wrap']}>
                <List className={styles['login-input-pwd-wrap-password']}>
                  <InputItem
                    type="number"
                    placeholder="请输入短信验证码"
                    onChange={this.onChangeCode}
                  ></InputItem>
                </List>
                <div
                  className={styles['login-input-pwd-wrap-code']}
                  onClick={() => {
                    this.showModal();
                  }}
                >
                  {count}
                </div>
              </div>
            </div>
            <Modal
              visible={this.state.showModal}
              transparent
              maskClosable={false}
              title="提示"
              footer={[
                {
                  text: '取消',
                  onPress: () => {
                    this.closeModal();
                  }
                },
                {
                  text: '确定',
                  onPress: () => {
                    this.validImgCode(financeUserData.mobile, imgCode, 2);
                    this.setState({ imgCode: '' });
                    this.updateImgCode();
                  }
                }
              ]}
            >
              <div className={styles['login-input-pwd-wrap-inputImgCode']}>
                <img
                  className={styles['login-input-pwd-wrap-inputImgCode-img']}
                  onClick={() => this.updateImgCode()}
                  src={this.state.imgCodeSrc}
                  alt=""
                />
                <List className={styles['login-input-pwd-wrap-inputImgCode-code']}>
                  <InputItem
                    type="text"
                    placeholder="请输入图片验证码"
                    maxLength={4}
                    value={imgCode}
                    onChange={this.onChangeImgCode}
                  ></InputItem>
                </List>
              </div>
            </Modal>
          </div>
        ) : (
          ''
        )}
        {step === 2 ? (
          <div className={styles['login-input']}>
            <div className={styles['login-input-phone']}>
              <div className={styles['login-input-phone-tip']}>真实姓名</div>
              <div className={styles['login-input-phone-wrap']}>
                <List className={styles['login-input-phone-wrap-number']}>
                  <InputItem
                    type="text"
                    placeholder="请输入真实姓名"
                    value={realName}
                    onChange={this.onChangeRealName}
                  ></InputItem>
                </List>
                <div
                  onClick={() => {
                    this.setState({ realName: '' });
                  }}
                  className={styles['login-input-pwd-wrap-delete']}
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
                    value={identityNumber}
                    onChange={this.onChangeidentityNumber}
                  ></InputItem>
                </List>
                <div
                  onClick={() => {
                    this.setState({ identityNumber: '' });
                  }}
                  className={styles['login-input-pwd-wrap-delete']}
                >
                  <i className="iconfont icon-cuowu"></i>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        {step === 3 ? (
          <div>
            <div className={styles['password-input']}>
              <List>
                <InputItem
                  type={isHidePassword ? 'password' : 'text'}
                  placeholder="请输入新提款密码"
                  onChange={this.onChangePassword}
                  maxLength={16}
                  minLength={6}
                ></InputItem>
              </List>
              <div
                className={styles['password-show']}
                onClick={() => this.setState({ isHidePassword: !isHidePassword })}
              >
                {isHidePassword ? (
                  <i className="iconfont icon-yincang"></i>
                ) : (
                  <i className="iconfont icon-xianshi"></i>
                )}
              </div>
            </div>
            <div className={styles['password-input']}>
              <List>
                <InputItem
                  type={isHidePasswordComfirm ? 'password' : 'text'}
                  placeholder="请确认新提款密码"
                  onChange={this.onChangePasswordConfirm}
                  maxLength={16}
                  minLength={6}
                ></InputItem>
              </List>
              <div
                className={styles['password-show']}
                onClick={() => this.setState({ isHidePasswordComfirm: !isHidePasswordComfirm })}
              >
                {isHidePasswordComfirm ? (
                  <i className="iconfont icon-yincang"></i>
                ) : (
                  <i className="iconfont icon-xianshi"></i>
                )}
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
        <Button
          className={styles['login-button']}
          onClick={() => {
            if (step === 1) {
              dispatch(T.VALIDA_FORGET_PHONE_NUM, {
                mobile: financeUserData.mobile,
                code: messageCode,
                type: 2,
                callback: this.validMessageCodeCallback
              });
            } else if (step === 2) {
              dispatch(T.VALIDA_FORGET_USERID, {
                name: realName,
                id: identityNumber,
                type: 2,
                callback: this.validRealNameSuccess
              });
            } else {
              dispatch(T.VALIDA_NEWPASSWORD, {
                newPass: password,
                confirmPass: confirmPassword,
                type: 2
              });
            }
          }}
        >
          {this.showButtonText(step)}
        </Button>
      </div>
    );
  }
}

export default Index;
