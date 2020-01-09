import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { Button, List, InputItem, Modal, Toast } from 'antd-mobile';
import { dispatch, T, connect, withPage } from '@/_store';
import { mobileMask } from '@/app/base/components/tools';

interface Props extends Store.State {}
@connect('userInfo')
@withPage
class PhoneBond extends Component<Props> {
  timer: any;
  state = {
    phone: '',
    messageCode: '',
    imgCode: '',
    imgCodeSrc: `/api/vf/verifyCode.jpg?_=${new Date()}`,
    showModal: false,
    countNumber: 60,
    count: '获取验证码',
    nextStep: false
  };
  // 中途返回其他页面时候出发，再次进入时出发
  onShow = () => {
    this.setState({ nextStep: false });
    clearTimeout(this.timer);
  };
  // 输入手机号
  onChangePhoneNumber = (val: any) => {
    this.setState({ phone: val });
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
      this.timer = setTimeout(() => {
        this.setState({
          countNumber: countNumber - 1,
          count: `${countNumber}s`
        });
        this.countDown();
      }, 1000);
    }
  }
  // 输入图形验证码
  onChangeImgCode = (val: any) => {
    this.setState({ imgCode: val });
  };
  //输入短信验证码
  onChangeCode = (val: any) => {
    if (!/^[0-9]{0,4}$/.test(val)) return null;
    this.setState({ messageCode: val });
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
  // 图形验证码回调
  getMessageCodeCallback = ({ status }: any) => {
    if (status === 'ok') {
      this.closeModal();
      this.countDown();
    }
  };
  // 第1、2次获取短信验证码
  getMessageCode = (step: any, phoneNumber: any, imageCode: any) => {
    dispatch(T.CHANGE_BONDPHONE_SEND_MESSAGE, {
      step: step,
      phoneNumber: phoneNumber,
      imageCode: imageCode,
      callback: this.getMessageCodeCallback
    });
  };
  // 第1、2次验证短信验证码
  verifyMessageCode = (mobile: any, smsCode: any, type: any) => {
    dispatch(T.CHANGE_BONDPHONE, {
      mobile: mobile,
      smsCode: smsCode,
      type: type,
      callback: type === 1 ? this.firstVerifyMessage : this.secondVerifyMessage
    });
  };
  //第一次验证短信后回调
  firstVerifyMessage = ({ status }: any) => {
    if (status === 'ok') {
      clearTimeout(this.timer);
      this.setState({
        nextStep: true,
        countNumber: 60,
        count: '获取验证码',
        messageCode: ''
      });
    }
  };
  //第二次验证短信后回调
  secondVerifyMessage = ({ status }: any) => {
    if (status === 'ok') clearTimeout(this.timer);
  };
  render() {
    const { financeUserData = {} } = this.props.store.userInfo;
    const { messageCode, phone, imgCode, showModal, count } = this.state;
    return (
      <div>
        <Header>修改手机号码</Header>
        {this.state.nextStep ? (
          <div className={styles['login-input']}>
            <div className={styles['login-input-phone']}>
              <div className={styles['login-input-phone-tip']}>手机号</div>
              <div className={styles['login-input-phone-wrap']}>
                <List className={styles['login-input-phone-wrap-number']}>
                  <InputItem
                    type="number"
                    placeholder="请输入手机号"
                    maxLength={11}
                    onChange={this.onChangePhoneNumber}
                  ></InputItem>
                </List>
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
                    onChange={this.onChangeCode}
                    value={messageCode}
                  ></InputItem>
                </List>
                <div
                  className={styles['login-input-pwd-wrap-code']}
                  onClick={phone ? () => this.showModal() : () => Toast.fail('请输入手机号')}
                >
                  {count}
                </div>
                <Modal
                  visible={showModal}
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
                        if (!phone) {
                          Toast.info('请输入手机号', 1);
                        } else {
                          this.getMessageCode(0, phone, imgCode);
                          this.setState({ imgCode: '' });
                          this.updateImgCode();
                        }
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
                        placeholder="请输验证码"
                        maxLength={4}
                        value={imgCode}
                        onChange={this.onChangeImgCode}
                      ></InputItem>
                    </List>
                  </div>
                </Modal>
              </div>
            </div>
            <Button
              className={styles['login-button']}
              disabled={messageCode && phone ? false : true}
              onClick={() => {
                if (phone === financeUserData.mobile) {
                  Toast.info('新手机号不能与旧手机相同', 1);
                } else {
                  this.verifyMessageCode(phone, messageCode, 2);
                }
              }}
            >
              确认修改
            </Button>
          </div>
        ) : (
          <div className={styles['login-input']}>
            <div className={styles['login-input-phone']}>
              <div className={styles['login-input-phone-tip']}>手机号</div>
              <div className={styles['login-input-phone-wrap']}>
                {mobileMask(financeUserData.mobile)}
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
                    onChange={this.onChangeCode}
                  ></InputItem>
                </List>
                <div
                  className={styles['login-input-pwd-wrap-code']}
                  onClick={() => this.showModal()}
                >
                  {count}
                </div>
                <Modal
                  visible={showModal}
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
                        this.getMessageCode(1, financeUserData.mobile, imgCode);
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
                    <List className={styles['login-input-pwd-wrap-password']}>
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
            </div>
            <Button
              className={styles['login-button']}
              disabled={messageCode ? false : true}
              onClick={() => {
                this.verifyMessageCode(financeUserData.mobile, messageCode, 1);
              }}
            >
              下一步
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default PhoneBond;
