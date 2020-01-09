import * as React from 'react';
import Header from '@/app/base/components/Header';
import customer from '@/app/base/static/images/png/person.png';
import customerService from '@/app/base/static/images/png/serverIcon.png';
import dayjs from 'dayjs';
import styles from './style.less';
import { connect, dispatch, T, withPage } from '@/_store';

interface Props extends Store.State {}

@connect('userInfo')
@withPage
export default class CustomerServive extends React.Component<Props> {
  public timer: any;
  state = {
    sendMessageContet: '',
    header: '在线客服 (工作日07:00~22:30)'
  };
  componentWillReceiveProps(nextProps: Props) {
    const preMsg = this.props.store.userInfo.customerServiveMeesage || [];
    const nextMsg = nextProps.store.userInfo.customerServiveMeesage || [];
    // 判断是否是初始化数据
    if (preMsg.length === 0 && nextMsg.length > 0) {
      this.msgCallback({ status: 'ok' });
    }
    // 判断最后一次的时间是否一样  不一样就是新的
    if (preMsg.length && preMsg.length) {
      if (preMsg[preMsg.length - 1].time !== nextMsg[nextMsg.length - 1].time) {
        this.msgCallback({ status: 'ok' });
      }
    }
  }
  // 滚动条的位置
  msgCallback = ({ status }: { status: string }) => {
    if (status === 'ok') {
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight));
    }
  };
  // 发送消息
  sendMessage = async (sendMessageContet: any) => {
    if (sendMessageContet.trim()) {
      dispatch(T.SEND_MESSAG_TO_CUSTOMER_SERVICE, {
        information: sendMessageContet,
        callback: ({ status }: { status: string }) => {
          if (status === 'ok') {
            dispatch(T.GET_MESSAG_FROM_CUSTOMER_SERVICE);
            this.setState({ sendMessageContet: '' });
          }
        }
      });
    }
  };
  // 获取消息
  getCustomerService = () => {
    this.msgCallback({ status: 'ok' });
    this.timer = setInterval(() => dispatch(T.GET_MESSAG_FROM_CUSTOMER_SERVICE), 5000);
  };
  componentDidMount = () => {
    this.getCustomerService();
  };
  onShow = () => {
    this.getCustomerService();
  };
  onHide = () => {
    clearInterval(this.timer);
  };
  onChangeText = (e: any) => this.setState({ sendMessageContet: e.target.value });

  public render() {
    const { customerServiveMeesage = [] } = this.props.store.userInfo || {};
    const { sendMessageContet, header } = this.state;
    return (
      <div className={styles['cs-context']}>
        <Header fixed>
          <span className={styles['cs-context-headerTitle']}>{header}</span>
        </Header>
        <div className={styles['cs-context-up']}>
          {Array.isArray(customerServiveMeesage) &&
            customerServiveMeesage.map((item: any, i: any) => {
              if (item.status === 3 || item.status === 4) {
                return (
                  <div className={styles['cs-context-up-cs']} key={i}>
                    <div style={{ padding: '0 15RPX', fontSize: 10, color: '#ccc' }}>
                      {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                    <div>
                      <img src={customerService} alt="" />
                      <div>
                        <label>{item.content}</label>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className={styles['cs-context-up-user']} key={i}>
                    <div style={{ padding: '0 15RPX', fontSize: 10, color: '#ccc' }}>
                      {dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                    <div>
                      <div>
                        <label>{item.content}</label>
                      </div>
                      <img src={customer} alt="" />
                    </div>
                  </div>
                );
              }
            })}
        </div>

        <div className={styles['cs-context-down']}>
          <input
            className={styles['cs-context-down-input']}
            type="text"
            value={sendMessageContet}
            onChange={this.onChangeText}
            placeholder={'有其他的需要，点此问我吧！'}
          />
          {/* <div className={'svgWrapper'} onClick={()=>this.submit()}>
                        <Svg path={send}/>
                    </div> */}
          <div
            className={styles['cs-context-down-submit']}
            onClick={() => this.sendMessage(sendMessageContet)}
            // _buttonClass={{ _buttonBox: 'sendButton' }}
          >
            发送
          </div>
        </div>
      </div>
    );
  }
}
