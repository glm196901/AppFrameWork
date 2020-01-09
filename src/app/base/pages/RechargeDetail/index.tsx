import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect, dispatch, T } from '@/_store';
import { WhiteSpace, Button, Toast, WingBlank } from 'antd-mobile';
import Input from './components/Input';
import Select from './components/Select';
import Header from '@/app/base/components/Header';

export interface IRechargeDetailProps extends RouteComponentProps, Store.State {}

@connect('userInfo')
export default class RechargeDetail extends React.Component<IRechargeDetailProps> {
  public input: any;
  public select: any;
  submit = (param: any, name: string) => {
    const {
      money: { type, min, max },
      device = {},
      channel = {}
    } = param || {};
    let _type = ''; // 判断是否是银行卡 参数好像有些不一样
    if (type === 'input') {
      const { bank = [], money } = this.input.state;
      // 有银行选择
      if (name.indexOf('银行') !== -1) {
        _type = 'bank';
        if (!Boolean(bank.length)) {
          return Toast.info('请选择银行卡', 1);
        }
      }
      // 判断金额是否合法
      if (!money.trim() || !(+money >= +min && +money <= +max)) {
        return Toast.info(`金额不合法 请输入${min} - ${max}`, 1);
      }
      // 银行卡支付
      if (_type === 'bank') {
        const params = {
          cardNumber: 0,
          type: param.type.value || 'dp',
          bank: bank[0] || '',
          money: Number(money),
          callbackUrl: window.location.href
        };
        dispatch(T.SUBMIT_PAY, params);
      } else {
        // 其他支付
        const parmas = {
          money,
          channel: channel.value,
          type: param.type.value,
          min,
          max,
          device: device.value,
          callbackUrl: window.location.href
        };
        dispatch(T.SUBMIT_PAY, parmas);
      }
    }
    if (type === 'select') {
      const { money = 0 } = this.select.state;
      const parmas = {
        money,
        channel: channel.value,
        type: param.type.value,
        min,
        max,
        device: device.value,
        callbackUrl: window.location.href
      };
      dispatch(T.SUBMIT_PAY, parmas);
    }
  };

  public render() {
    const { title, des = [], param = {}, name = '' } = this.props.location.state;
    const { type } = param.money || {};
    const { basicUserData = {} } = this.props.store.userInfo || {};

    return (
      <div>
        <Header>{title}</Header>
        <div style={{ paddingTop: '15RPX', height: '100vh', background: '#fff' }}>
          <div style={{ textAlign: 'center' }}>
            <h3>账户余额</h3>
            <span style={{ fontSize: '28RPX' }}>
              {Number(Math.floor((basicUserData.money || 0) * 100) / 100).toFixed(2) || '获取中'}
            </span>
          </div>
          <WhiteSpace />
          <div>
            {type === 'input' && (
              <Input ref={e => (this.input = e)} params={param} name={name || title} />
            )}
            {type === 'select' && <Select ref={e => (this.select = e)} params={param} />}
          </div>
          <WingBlank>
            <WhiteSpace />
            <Button onClick={this.submit.bind(this, param, name || title)}> 下一步 </Button>
            <WhiteSpace />
          </WingBlank>
          <WingBlank>
            <div>
              <h3>温馨提示</h3>
              {des.map((item: string, index: number) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </WingBlank>
        </div>
      </div>
    );
  }
}
