import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { Picker, List, InputItem, Toast, Button } from 'antd-mobile';
import {
  nameMark,
  bankNames,
  matchBank,
  provinceData,
  cityeData
} from '@/app/base/components/tools';
import { dispatch, T, connect } from '@/_store';

interface Props extends Store.State {}
let banks: any = [];
for (let i = 0; i < bankNames.length; i++) {
  const element = bankNames[i];
  let obj = {
    value: element,
    label: (
      <div style={{ display: 'block', justifyContent: 'center', verticalAlign: 'middle' }}>
        <div
          style={{
            width: 20,
            height: 20,
            display: 'inline-block',
            margin: 'auto',
            verticalAlign: 'middle',
            lineHeight: 0
          }}
        >
          <img style={{ width: '100%' }} alt={''} src={matchBank(element, 'background')} />
        </div>
        <div
          style={{
            marginRight: 10,
            display: 'inline',
            alignItems: 'center',
            verticalAlign: 'middle'
          }}
        >
          {element}
        </div>
      </div>
    )
  };
  banks.push(obj);
}
@connect('userInfo')
class Index extends Component<Props> {
  // bankType = [];
  state = {
    banks: banks,
    bankType: ['请选择银行'],
    province: ['请选择开户省份'],
    city: ['请选择开户城市'],
    subbranch: '',
    cardNumber: '',
    cfmCardNumber: ''
  };
  //todo 选择银行
  onChangeSelectBank = (val: any) => {
    this.setState({ bankType: val });
  };
  // 开户省份
  onProvincePickerChange = (val: any) => {
    this.setState({ province: val });
  };
  // 开户城市
  onCityPickerChange = (val: any) => {
    this.setState({ city: val });
  };
  // 开户支行
  onChangeSubBranch = (val: any) => {
    this.setState({ subbranch: val });
  };
  // 开户城市
  onChangeCardNumber = (val: any) => {
    this.setState({ cardNumber: val });
  };
  // 确认银行卡号
  onChangeCfmCardNumber = (val: any) => {
    this.setState({ cfmCardNumber: val });
  };
  componentDidMount() {
    dispatch(T.GET_USER_BANKCARD_LIST);
  }

  render() {
    const { financeUserData = {} } = this.props.store.userInfo;
    const { subbranch, cardNumber, cfmCardNumber, bankType, province, city } = this.state;

    return (
      <div>
        <Header>添加银行卡</Header>
        <h4>为确保资金安全，只能添加本号实名的的银行卡</h4>
        <div className={styles['bankInfo']}>
          <List prefixCls={'np-list'}>
            <InputItem
              className={styles['bankInfo-item']}
              prefixListCls={'np-input'}
              prefixCls={'np-input'}
              type={'number'}
              value={nameMark(financeUserData.name)}
              editable={false}
            >
              {/* 开户姓名 */}
            </InputItem>
            <Picker
              extra={'请选择开户银行'}
              data={this.state.banks}
              cols={1}
              onPickerChange={this.onChangeSelectBank}
              value={bankType}
            >
              <List.Item prefixCls={'np-picker'} arrow="horizontal">
                {/* 开户银行 */}
              </List.Item>
            </Picker>
            <Picker
              extra={'请选择开户省份'}
              data={provinceData(true)}
              cols={1}
              onPickerChange={this.onProvincePickerChange}
              value={province}
              // onOk={this.onProvinceOK}
            >
              <List.Item prefixCls={'np-picker'} arrow="horizontal">
                {/* 开户省份 */}
              </List.Item>
            </Picker>
            {this.state.province[0] === '请选择开户省份' ? (
              <div className={'lie-picker'}>
                {/* <span className={'np-picker-content'}>开户城市</span> */}
                <div onClick={() => Toast.info('请选择省份', 1)}>{'请选择开户城市'}</div>
              </div>
            ) : (
              <Picker
                extra={'请选择开户城市'}
                data={cityeData(this.state.province[0], true)}
                cols={1}
                onPickerChange={this.onCityPickerChange}
                value={city}
                // onOk={this.onCityOK}
              >
                <List.Item prefixCls={'np-picker'} arrow="horizontal">
                  {/* 开户城市 */}
                </List.Item>
              </Picker>
            )}
            <InputItem
              prefixListCls={'np-input'}
              prefixCls={'np-input'}
              type={'text'}
              onChange={this.onChangeSubBranch}
              value={subbranch}
              placeholder={'请输入开户支行'}
            >
              {/* 开户支行 */}
            </InputItem>
            <InputItem
              minLength={16}
              maxLength={19}
              prefixListCls={'np-input'}
              prefixCls={'np-input'}
              type={'number'}
              onChange={this.onChangeCardNumber}
              value={cardNumber}
              placeholder={'请输入银行卡号'}
            >
              {/* 银行卡号 */}
            </InputItem>
            <InputItem
              minLength={16}
              maxLength={19}
              prefixListCls={'np-input'}
              prefixCls={'np-input'}
              type={'number'}
              onChange={this.onChangeCfmCardNumber}
              value={cfmCardNumber}
              placeholder={'请在此确认银行卡号'}
            >
              {/* 确认卡号 */}
            </InputItem>
          </List>
        </div>
        <Button
          disabled={
            cfmCardNumber && cardNumber && subbranch && province && bankType && city ? false : true
          }
          className={styles['submit-addBankCard']}
          onClick={() =>
            dispatch(T.ADD_BANKCARD, {
              bankType: bankType[0],
              province: province[0],
              city: city[0],
              cardNumber: cardNumber,
              cfmCardNumber: cfmCardNumber,
              subbranch: subbranch
            })
          }
        >
          确认
        </Button>
      </div>
    );
  }
}

export default Index;
