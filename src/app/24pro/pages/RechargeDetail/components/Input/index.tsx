import * as React from 'react';
import { List, InputItem, Picker } from 'antd-mobile';
import ICBC from '@/app/base/static/images/png/bankIcon/icbc.png';
import CMB from '@/app/base/static/images/png/bankIcon/cmb.png';
import CCB from '@/app/base/static/images/png/bankIcon/ccb.png';
import ABC from '@/app/base/static/images/png/bankIcon/abc.png';
import BOC from '@/app/base/static/images/png/bankIcon/boc.png';
import COMM from '@/app/base/static/images/png/bankIcon/comm.png';
import CMBC from '@/app/base/static/images/png/bankIcon/cmbc.png';
import SPDB from '@/app/base/static/images/png/bankIcon/spdb.png';
import CITIC from '@/app/base/static/images/png/bankIcon/citic.png';
import GDB from '@/app/base/static/images/png/bankIcon/gdb.png';
import SZPAB from '@/app/base/static/images/png/bankIcon/szpab.png';
import CIB from '@/app/base/static/images/png/bankIcon/cib.png';
import HXB from '@/app/base/static/images/png/bankIcon/hxb.png';
import CEB from '@/app/base/static/images/png/bankIcon/ceb.png';
import PSBC from '@/app/base/static/images/png/bankIcon/psbc.png';

function selectBank(name: string) {
  switch (name) {
    case '工商银行':
      return ICBC;
    case '招商银行':
      return CMB;
    case '建设银行':
      return CCB;
    case '农业银行':
      return ABC;
    case '中国银行':
      return BOC;
    case '交通银行':
      return COMM;
    case '民生银行':
      return CMBC;
    case '浦发银行':
      return SPDB;
    case '中信银行':
      return CITIC;
    case '广发银行':
      return GDB;
    case '平安银行':
      return SZPAB;
    case '兴业银行':
      return CIB;
    case '华夏银行':
      return HXB;
    case '光大银行':
      return CEB;
    case '邮政储蓄':
      return PSBC;
    default:
      return PSBC;
  }
}
let backList: any = [
  '工商银行',
  '招商银行',
  '建设银行',
  '农业银行',
  '中国银行',
  '交通银行',
  '民生银行',
  '浦发银行',
  '中信银行',
  '广发银行',
  '兴业银行',
  '华夏银行',
  '光大银行',
  '邮政储蓄'
];
backList = backList.map((item: string) => {
  return {
    value: item,
    label: (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 30, height: 30 }}>
          <img style={{ width: '100%', height: '100%' }} alt="" src={selectBank(item)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>{item}</div>
      </div>
    )
  };
});

export default class Input extends React.Component<any> {
  state = {
    bank: [],
    money: ''
  };
  onPickerChange = (bank: any) => {
    this.setState({ bank });
  };
  public render() {
    const { money } = this.props.params;
    return (
      <div>
        <List>
          {this.props.name.indexOf('银行') !== -1 && (
            <Picker data={backList} cols={1} value={this.state.bank} onOk={this.onPickerChange}>
              <List.Item arrow="horizontal">充值银行</List.Item>
            </Picker>
          )}
          <InputItem
            type="number"
            placeholder={money.placeholder}
            onChange={data => {
              this.setState({ money: data });
            }}
          >
            充值金额
          </InputItem>
        </List>
      </div>
    );
  }
}
