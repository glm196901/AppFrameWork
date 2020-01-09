import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { nameMark } from '@/app/base/components/tools';
import Auth from '@/app/base/components/Auth';
import { Button, Modal, Toast } from 'antd-mobile';
import { Link } from 'react-router-dom';
import { T, dispatch, connect } from '@/_store';

interface Props extends Store.State {}
const introduction = [
  { title: '≤ 2次', limit: '每日限次' },
  { title: '≤ 100元', limit: '最低提现' },
  { title: '≤ 30分', limit: '到账时间' }
];
@connect('userInfo', 'userBankCardList')
class Index extends Component<Props> {
  state = {
    password: '',
    isHidePassWord: true,
    showWithdrawModal: false,
    showBankModal: false,
    bankCard: '',
    bankCardNumber: '',
    money: '',
    bankId: '',
    bankCardList: [],
    select: 0,
    bankCardId: ''
  };
  componentDidMount() {
    dispatch(T.GET_USER_BANKCARD_LIST);
  }
  // 打开提款银行卡选择
  openBankCardList = () => {
    this.setState({ showBankModal: true });
  };
  // 提款确认
  submitWithdraw = (money: any, cardId: any, password: any) => {
    dispatch(T.WITHDRAW_MONEY, { money: money, cardId: cardId, password: password });
  };
  // 检查提款时间
  checkTimeAvailable(from: number, to: number) {
    const now = new Date();
    const limit = [0, 6];
    console.log(!limit.includes(now.getDay()) && now.getHours() >= from && now.getHours() <= to);
    return !limit.includes(now.getDay()) && now.getHours() >= from && now.getHours() <= to;
  }
  // 提款金额判断
  withdrawMoney = (val: any, deposit: any) => {
    if (val >= deposit) {
      // Toast.info('超过提现最大余额', 1);
      this.setState({ money: deposit });
    } else {
      this.setState({ money: val });
    }
  };
  // 提交密码
  withdrawPassword = (val: any) => {
    if (/\s+/.test(val)) return;
    this.setState({ password: val });
  };
  render() {
    const { financeUserData = {}, basicUserData = {}, userBankCardList = {} } =
      this.props.store.userInfo || {};
    const {
      showWithdrawModal,
      bankCard,
      bankCardNumber,
      money,
      select,
      password,
      bankCardId
    } = this.state;
    return (
      <div>
        <Header
          rightIcons={[
            <Auth key="1" to="/withdrawHistory" style={{ marginRight: '15RPX' }}>
              提款记录
            </Auth>
          ]}
        >
          提款
        </Header>
        <div className={styles['withdrawInfo']}>
          <div className={styles['withdrawInfo-card']}>
            <div className={styles['withdrawInfo-card-top']}>
              <div className={styles['withdrawInfo-card-top-name']}>
                {nameMark(financeUserData.name)}
              </div>
            </div>
            <div className={styles['withdrawInfo-card-deposit']}>
              <div>{Math.floor(basicUserData.money * 100) / 100}</div>
              <div>账户余额</div>
            </div>
            <div className={styles['withdrawInfo-card-introduce']}>
              {introduction.map((item, index) => {
                return (
                  <div key={index} className={styles['withdrawInfo-card-introduce-info']}>
                    <div>
                      <div>{item.title}</div>
                    </div>
                    <div>{item.limit}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            className={styles['withdrawInfo-button']}
            onClick={() => {
              if (financeUserData.bankCardCount === 0) {
                Toast.info('请先去添加银行卡', 1);
              } else {
                this.setState({
                  bankCard: (userBankCardList.length > 0 && userBankCardList[0].bank) || '',
                  bankCardNumber:
                    (userBankCardList.length > 0 && userBankCardList[0].cardNumber) || '',
                  bankCardId: (userBankCardList.length > 0 && userBankCardList[0].id) || '',
                  showWithdrawModal: true
                });
              }
            }}
          >
            提款
          </Button>
          <Modal
            className={styles['withdrawModal']}
            closable
            popup={true}
            visible={showWithdrawModal}
            onClose={() => this.setState({ showWithdrawModal: false })}
            animationType="slide-up"
            title={<div className={styles['withdrawModal-modalTitle']}>银行卡提款</div>}
          >
            <div className={styles['withdrawModal-bankCardBox']}>
              <div className={styles['withdrawModal-bankCardBox-leftTitle']}>提款银行卡</div>
              <div
                onClick={this.openBankCardList}
                className={styles['withdrawModal-bankCardBox-rightContent']}
                // className={`rightContent ${!!this.state.bankCard ? 'color-black' : 'color-gray'}`}
              >
                {!!bankCard ? `${bankCard} ${bankCardNumber}` : '请选择银行卡'}
              </div>
            </div>
            <div className={styles['withdrawModal-passwordBox']}>
              <div className={styles['withdrawModal-passwordBox-leftTitle']}>提款密码</div>
              <input
                type={'password'}
                minLength={6}
                maxLength={16}
                placeholder={'请输入提款密码'}
                value={this.state.password}
                onChange={e => {
                  this.withdrawPassword(e.target.value);
                  // this.setState({ password: e.target.value });
                }}
              />
              <div
                className={styles['withdrawModal-passwordBox-forgotButtonBox']}
                onClick={() => this.setState({ showWithdrawModal: false })}
              >
                <Link to={'forgetWithDrawPwd'}>忘记密码</Link>
              </div>
            </div>
            <div className={styles['withdrawModal-amountBox']}>
              <div className={styles['withdrawModal-amountBox-leftTitle']}>提款金额</div>
              <div className={styles['withdrawModal-amountBox-amountInputBox']}>
                <div className={styles['withdrawModal-amountBox-amountInputBox-symbol']}>¥</div>
                <input
                  type={'number'}
                  placeholder={'请输入金额'}
                  value={money}
                  onChange={e => {
                    this.withdrawMoney(e.target.value, Math.floor(basicUserData.money * 100) / 100);
                    // this.setState({ money: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className={styles['withdrawModal-availableAmountBox']}>
              <div className={styles['withdrawModal-availableAmountBox-leftTitle']}>可提款金额</div>
              <div className={styles['withdrawModal-availableAmountBox-amountText']}>
                {Math.floor(basicUserData.money * 100) / 100}
              </div>
            </div>
            <Button
              disabled={
                this.checkTimeAvailable(9, 21) && money && bankCardNumber && password ? false : true
              }
              onClick={() => this.submitWithdraw(money, bankCardId, password)}
              className={styles['withdrawModal-submitButton']}
            >
              {this.checkTimeAvailable(9, 21) === false ? '提款时间为早9-晚9' : '提款'}
            </Button>
            <p>提款规则</p>
            <ul className={styles['withdrawModal-tips']}>
              <li>1.如充值未交易提款，则需收取3%手续费，10元起收；</li>
              <li>2.提款时间：周一至周五09:00-21:00，周末顺延至工作日处理；</li>
              <li>3.到账时间30分钟内，具体依据银行处理速度为准；</li>
              <li>4.如有其他疑问，请联系在线客服</li>
            </ul>
          </Modal>
          <Modal
            visible={this.state.showBankModal}
            transparent
            className={styles['checkBankModal']}
            maskClosable={true}
            onClose={() => this.setState({ showBankModal: false })}
            title={<div className={'modalTitle'}>请选择银行卡</div>}
            footer={[
              { text: '取消', onPress: () => this.setState({ showBankModal: false }) },
              {
                text: '确定',
                onPress: () => {
                  this.setState({ showBankModal: false });
                }
              }
            ]}
          >
            <ul className={styles['checkBankModal-checkBank']}>
              {userBankCardList[0] &&
                userBankCardList.map((item: any, index: number) => {
                  return (
                    <div
                      className={index === select ? styles['checkBankModal-checkBank-checked'] : ''}
                      key={index}
                      onClick={() => {
                        this.setState({
                          bankCard: item.bank,
                          bankCardNumber: item.cardNumber,
                          select: index,
                          bankCardId: item.id
                        });
                      }}
                    >
                      <div>{item.bank}</div>
                      &nbsp;
                      <div>{item.cardNumber}</div>
                    </div>
                  );
                })}
            </ul>
          </Modal>
        </div>
        <div className={styles['cancleWithdraw']}></div>
      </div>
    );
  }
}

export default Index;
