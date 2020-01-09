import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { Button, List, InputItem, Modal, Toast } from 'antd-mobile';
import { dispatch, T, connect, withPage } from '@/_store';
interface Props extends Store.State {}
@connect('userInfo')
@withPage
class Register extends Component<Props> {
  state = {
    phoneOrUserName: '',
    messageCode: '',
    imageCode: '',
    password: '',
    imgCodeSrc: `/api/vf/verifyCode.jpg?_=${new Date()}`,
    showModal: false,
    countNumber: 60,
    count: '获取验证码',
    nextStep: false,
    showPassword: false,
    register: '极速开户'
  };
  // 设置密码 隐藏/显示
  showPassword = () => {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  };
  // 中途返回其他页面时候出发，再次进入时出发
  onShow = () => this.setState({ nextStep: false });
  // 输入手机号或用户名
  onChangePhoneOrUserName = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ phoneOrUserName: val });
  };
  // 输入密码
  onChangePassword = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ password: val });
  };
  // 输入图形验证码
  onChangeImgCode = (val: any) => {
    if (!/^[0-9]{0,4}$/.test(val)) return null;
    this.setState({ imageCode: val });
  };
  //输入短信验证码
  onChangeMessageCode = (val: any) => {
    if (!/^[0-9]{0,4}$/.test(val)) return null;
    this.setState({ messageCode: val });
  };
  //显示获取验证码框
  showModal = () => {
    if (!!this.state.phoneOrUserName) {
      if (this.state.count === '获取验证码') {
        this.setState({
          showModal: true
        });
      } else {
        Toast.info(`请${this.state.countNumber}秒后重试`, 1);
      }
    } else {
      Toast.info('请输入手机号', 1);
    }
  };
  // 关闭获取验证码框
  closeModal = () => {
    this.setState({
      showModal: false
    });
  };
  //更新图形验证码
  updateImgCode = () => {
    this.setState({
      imgCodeSrc: `/api/vf/verifyCode.jpg?_=${new Date()}`
    });
  };

  // 验证提交图形验证码
  validImgCode = (mobile: any, imageCode: any) => {
    dispatch(T.GET_REGISTER_MESSAGE_CODE, {
      mobile: mobile,
      imageCode: imageCode,
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

  // 60秒验证码倒计时
  countDown() {
    const { countNumber } = this.state;
    if (countNumber === 0) {
      this.setState({
        count: '获取验证码',
        countNumber: 60
      });
    } else {
      setTimeout(() => {
        this.setState({
          countNumber: countNumber - 1,
          count: `${countNumber}秒后重发`
        });
        this.countDown();
      }, 1000);
    }
  }
  //下一步:验证短信验证码
  nextStep = () => {
    const { phoneOrUserName, messageCode } = this.state;
    if (phoneOrUserName.length === 0 || !/^1[1203456789]\d{9}$/.test(phoneOrUserName))
      return Toast.info('手机号码格式不对', 1);
    if (messageCode.length < 4) return Toast.info('验证码有误', 1);
    // 校验短信验证码
    dispatch(T.VERIFY_REGISTER_MESSAGE_CODE, {
      mobile: phoneOrUserName,
      messageCode: messageCode,
      callback: this.verifyMessageCallback
    });
  };
  // 短信验证码成功的回调
  verifyMessageCallback = ({ status, loading }: any) => {
    this.setState({ loading });
    if (status === 'ok') {
      this.setState({ nextStep: true, phoneOrUserName: '' });
    }
  };
  render() {
    const {
      register,
      phoneOrUserName,
      password,
      messageCode,
      imageCode,
      showPassword
    } = this.state;
    return (
      <div>
        <Header>{register}</Header>
        <div className={styles['login']}>{register}</div>
        {this.state.nextStep ? (
          <div className={styles['login-input']}>
            <div className={styles['login-input-phone']}>
              <div className={styles['login-input-phone-tip']}>用户名</div>
              <div className={styles['login-input-phone-wrap']}>
                <List className={styles['login-input-phone-wrap-number']}>
                  <InputItem
                    type="text"
                    minLength={3}
                    maxLength={16}
                    placeholder="给自己取一个响亮的名字"
                    value={phoneOrUserName}
                    onChange={this.onChangePhoneOrUserName}
                  ></InputItem>
                </List>
                <div
                  onClick={() => {
                    this.showPassword();
                  }}
                  className={styles['login-input-phone-wrap-delete']}
                >
                  {showPassword ? (
                    <i className="iconfont icon-yincang"></i>
                  ) : (
                    <i className="iconfont icon-xianshi"></i>
                  )}
                </div>
              </div>
            </div>
            <div className={styles['login-input-pwd']}>
              <div className={styles['login-input-pwd-tip']}>密码</div>
              <div className={styles['login-input-pwd-wrap']}>
                <List className={styles['login-input-pwd-wrap-password']}>
                  <InputItem
                    type="password"
                    placeholder="请输入密码"
                    maxLength={16}
                    minLength={6}
                    value={this.state.password}
                    onChange={this.onChangePassword}
                  ></InputItem>
                </List>
                <div
                  onClick={() => {
                    this.setState({ password: '' });
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
                dispatch(T.SUBMIT_REGISTER, {
                  nickName: phoneOrUserName,
                  password: password,
                  to: '/mine'
                });
              }}
            >
              {register}
            </Button>
          </div>
        ) : (
          <div className={styles['login-input']}>
            <div className={styles['login-input-phone']}>
              <div className={styles['login-input-phone-tip']}>手机号</div>
              <div className={styles['login-input-phone-wrap']}>
                <List className={styles['login-input-phone-wrap-number']}>
                  <InputItem
                    type="number"
                    maxLength={11}
                    placeholder="请输入手机号"
                    value={phoneOrUserName}
                    onChange={this.onChangePhoneOrUserName}
                  ></InputItem>
                </List>
                <div
                  onClick={() => {
                    this.setState({ phoneOrUserName: '' });
                  }}
                  className={styles['login-input-phone-wrap-delete']}
                >
                  <i className="iconfont icon-cuowu"></i>
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
                    maxLength={4}
                    onChange={this.onChangeMessageCode}
                  ></InputItem>
                </List>
                <div
                  className={styles['login-input-pwd-wrap-code']}
                  // onClick={() => this.getMessageCode()}
                  onClick={() => this.showModal()}
                >
                  {this.state.count}
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
                        this.validImgCode(phoneOrUserName, imageCode);
                        this.updateImgCode();
                        this.setState({ imageCode: '' });
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
                    <List className={styles['login-input-pwd-wrap-password']}>
                      <InputItem
                        type="text"
                        placeholder="请输入图形验证码"
                        maxLength={4}
                        onChange={this.onChangeImgCode}
                        value={imageCode}
                      ></InputItem>
                    </List>
                  </div>
                </Modal>
              </div>
            </div>
            <Button
              disabled={phoneOrUserName && messageCode ? false : true}
              className={styles['login-input-button']}
              onClick={() => {
                this.nextStep();
              }}
            >
              下一步
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Register;
