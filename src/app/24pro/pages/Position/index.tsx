import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Header from './components/Header';
import Title from './components/Title';
import PositionList from './components/PositionList';
import ResultList from './components/ResultList';
import Tabs from './components/Tabs';
import { withPage, dispatch, T } from '@/_store';
import { Toast } from 'antd-mobile';

import styles from './style.less';

interface Props extends RouteComponentProps {}

interface RouterParams {
  mock: 'true' | 'false';
  back: 'true' | 'false';
}

@withPage
class Position extends Component<Props> {
  state = {
    activeIndex: 0, // true 为持仓 false 结算
    mock: false, // 是否模拟
    back: false // 是否需要返回
  };
  // 获取数据
  getData = () => {
    try {
      const { back, mock } = this.props.match.params as RouterParams;
      const isMock = mock === 'true';
      this.setState({ mock: isMock, back: back === 'true' });
      dispatch(T.GET_QUOTES_LIST_DATA); // 启动行情
      dispatch(T.GET_POSITIONS_DATA, { mock: isMock }); //获取持仓数据
      dispatch(T.GET_POSITIONS_RESULT_LIST, { mock: isMock, callback: this.loadingCallback }); // 获取历史数据
    } catch (err) {
      /* eslint-disable */
      console.log('打印: Position -> getData -> err', err);
    }
  };
  // 停止数据
  endData = () => {
    dispatch(T.END_QUOTES_LIST_DATA);
    dispatch(T.END_POSTION_DATA);
  };
  loadingCallback = ({ loading }: { loading: boolean }) => {
    if (loading) {
      Toast.loading('', 0);
    } else {
      Toast.hide();
    }
  };
  // 食盘 和 模拟盘的切换
  handleSwitch = (isMock: boolean) => {
    this.setState({ mock: isMock });
    dispatch(T.GET_POSITIONS_DATA, { mock: isMock }); // 获取持仓数据
    dispatch(T.GET_POSITIONS_RESULT_LIST, { mock: isMock, callback: this.loadingCallback }); // 获取历史数据
  };
  // tabs 切换
  hanldeSwitchTabs = (e: any) => this.setState({ activeIndex: e.type });
  componentDidMount = () => this.getData();
  onShow = () => this.getData();
  onHide = () => this.endData();

  render() {
    const { mock, back } = this.state;
    const { activeIndex } = this.state;
    return (
      <div className={styles['position']}>
        <div className={styles['position-header']}>
          <Header back={back} mock={mock} handleSwitch={this.handleSwitch} />
          <Title mock={mock} />
          <Tabs onChange={this.hanldeSwitchTabs} activeIndex={activeIndex} />
        </div>
        {/*  */}
        <div style={{ display: Object.is(activeIndex, 0) ? '' : 'none' }}>
          <PositionList mock={mock} />
        </div>
        <div style={{ display: Object.is(activeIndex, 1) ? '' : 'none' }}>
          <ResultList mock={mock} />
        </div>
      </div>
    );
  }
}

export default withRouter(Position);
