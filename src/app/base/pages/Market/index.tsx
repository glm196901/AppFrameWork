import React from 'react';
import { connect, withPage, dispatch, T } from '@/_store';
import { Button } from 'antd-mobile';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import NoData from '@/app/base/components/NoData';
import Tabs from './components/Tabs';
import Item from './components/Item';
import styles from './style.less';

interface Props extends RouteComponentProps, Store.State {}

@connect('quotesList', 'favorList', 'userInfo')
@withPage
class Market extends React.Component<Props> {
  state = {
    activeIndex: 0
  };
  linkTarget = () => {
    dispatch(T.ADD_OPTIONAL);
    dispatch(T.GET_QUOTES_LIST_DATA);
    const { activeIndex = 0 } = this.props.location.state || {};
    if (activeIndex) this.setState({ activeIndex });
  };
  hanldeGotoMarket = () => {
    const { userInfo } = this.props.store;
    if (userInfo.isLogin) {
      this.setState({ activeIndex: 1 });
    } else {
      this.props.history.push('/login');
    }
  };
  componentDidMount = () => this.linkTarget();
  onShow = () => this.linkTarget();
  onHide = () => dispatch(T.END_QUOTES_LIST_DATA);
  onChange = (e: Event) => this.setState({ activeIndex: Number(e.type) });
  render() {
    const { quotesList = {}, userInfo = {} } = this.props.store;
    const 数字货币 = quotesList['数字货币'] || [];
    const 股指 = quotesList['股指'] || [];
    const 期货 = quotesList['期货'] || [];
    const 自选 = quotesList['自选'] || [];
    const activeIndex = this.state.activeIndex;
    return (
      <div className={styles['bw-market']}>
        <div className={styles['bw-market-tabs']}>
          <Tabs onChange={this.onChange} page={activeIndex} />
        </div>
        <div className={styles['bw-market-body']}>
          {
            <div style={{ display: Object.is(activeIndex, 0) ? 'block' : 'none' }}>
              {!Boolean(自选.length || 0) || !userInfo.isLogin ? (
                <div>
                  <NoData />
                  <div
                    style={{ textAlign: 'center', padding: '0 33%' }}
                    onClick={this.hanldeGotoMarket}
                  >
                    <Button size="small" type="primary">
                      添加自选
                    </Button>
                  </div>
                </div>
              ) : (
                <Item data={自选} type="自选" />
              )}
            </div>
          }
          {
            <div style={{ display: Object.is(activeIndex, 1) ? 'block' : 'none' }}>
              <Item data={期货} type="期货" />
            </div>
          }
          {
            <div style={{ display: Object.is(activeIndex, 2) ? 'block' : 'none' }}>
              <Item data={股指} type="股指" />
            </div>
          }
          {
            <div style={{ display: Object.is(activeIndex, 3) ? 'block' : 'none' }}>
              <Item data={数字货币} type="数字货币" />
            </div>
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Market);
