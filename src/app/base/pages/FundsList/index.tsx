import React, { Component } from 'react';
import { connect, dispatch, T } from '@/_store';
import styles from './style.less';
import Header from '@/app/base/components/Header';

import Tabs from './components/Tabs';
import Items from './components/Items';
export interface Props extends Store.State {}

@connect('userInfo')
class Index extends Component<Props> {
  componentDidMount() {
    dispatch(T.GET_FUND_LIST, { type: 1 });
  }
  state = {
    activeIndex: 0,
    data: ''
  };
  onChange = (e: Event) => {
    this.setState({ activeIndex: Number(e.type) }, () => {
      dispatch(T.GET_FUND_LIST, { type: e.type });
      this.showMoneyDetail(e.type);
    });
  };
  // 每个item的内容;
  showMoneyDetail = (type: any) => {
    const { funds } = this.props.store.userInfo;
    const {
      transferRecordList = [],
      // eagleRecordList = [],
      transactionRecordList = [],
      commissionRecordList = []
    } = funds || {};
    if (type === 1) {
      this.setState({
        data: transferRecordList
      });
    } else if (type === 2) {
      this.setState({
        data: transactionRecordList
      });
    }
    // else if (type === 3) {
    //   this.setState({
    //     data:  eagleRecordList
    //   });
    // }
    else {
      this.setState({
        data: commissionRecordList
      });
    }
  };

  render() {
    const { funds } = this.props.store.userInfo;
    return (
      <div>
        <Header>资金明细</Header>
        <div className={styles['bw-market-tabs-layout']}>
          <Tabs onChange={this.onChange} />
        </div>
        <div className={styles['fundDetail-body']}>
          <Items data={this.state.data || funds.transferRecordList} />
        </div>
      </div>
    );
  }
}

export default Index;
