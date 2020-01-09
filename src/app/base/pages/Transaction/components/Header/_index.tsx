import * as React from 'react';
import PublicHeader from '@/app/base/components/Header';
import { Icon, Modal, Button } from 'antd-mobile';
// import { Icon, Modal, Button, Popover } from 'antd-mobile';
import styles from './style.less';
import { connect, dispatch, T } from '@/_store';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';

// const Item = Popover.Item;

export interface IHeaderProps extends Store.State, RouteComponentProps {}

// const IconPosition = () => <i className="iconfont icon-wodechicang" />;
// const IconRules = () => <i className="iconfont icon-guizeshuoming" />;

@connect('userInfo', 'productProps', 'quotesList', 'productIsupDown', 'favorList')
class Header extends React.PureComponent<IHeaderProps> {
  state = {
    visible: false,
    popoverVisible: false,
    activeIndex: ''
  };
  componentWillReceiveProps(nextProps: any) {
    if (this.props.code !== nextProps.code) {
      this.setState({ activeIndex: nextProps.code });
    }
    if (this.props.store.favorList !== nextProps.store.favorList) {
      dispatch(T.GET_QUOTES_LIST_DATA); // 获取商品
    }
  }
  componentDidMount() {
    this.setState({ activeIndex: this.props.code });
  }

  handleClick = () => {
    this.setState({ visible: true });
  };
  handleSwitch = (id: string) => {
    this.setState({ activeIndex: id, visible: false });
    this.props.handleSwitchCode(id);
  };
  handleVisibleChange = (popoverVisible: boolean) => {
    this.setState({ popoverVisible });
  };
  onSelect = (opt: any) => {
    this.setState({ popoverVisible: false });
    const to = opt.props.value;
    // if (to === 'forceUpdate') {
    //   return;
    // }
    const { isLogin } = this.props.store.userInfo;
    if (isLogin) {
      this.props.history.push(to);
    } else {
      this.props.history.push({
        pathname: '/login',
        state: { to }
      });
    }
  };
  public render() {
    const { name } = this.props.store.productProps || {};
    const { quotesList = {}, productIsupDown } = this.props.store || {};
    // const { visible, activeIndex, popoverVisible } = this.state;
    const { visible, activeIndex } = this.state;

    const { mock, handleSwitchMock, code } = this.props;
    const list = [
      { name: '自选', list: quotesList['自选'] },
      { name: '股指', list: quotesList['股指'] },
      { name: '期货', list: quotesList['期货'] },
      { name: '数字货币', list: quotesList['数字货币'] }
    ].filter(item => item.list.length);
    return (
      <div>
        <PublicHeader
          bgColor={productIsupDown ? styles.upColor : styles.downColor}
          rightIcons={[
            <Link to={`/position/${mock}/true`} key="1">
              <div className={styles['position']}>持仓</div>
              {/* <Popover
                mask
                visible={popoverVisible}
                onVisibleChange={this.handleVisibleChange}
                overlay={[
                  // @ts-ignore
                  <Item value={`/position/${mock}/true`} icon={<IconPosition />} key="1">
                    持仓
                  </Item>,
                  // @ts-ignore
                  <Item key="3" value={`/rules/${code}`} icon={<IconRules />}>
                    规则
                  </Item>
                ]}
                // @ts-ignore
                align={{ overflow: { adjustY: 0, adjustX: 0 }, offset: [-10, 0] }}
                onSelect={this.onSelect}
              >
                <div style={{ padding: '0 15px' }}>
                  <Icon type="ellipsis" />
                </div>
              </Popover> */}
            </Link>
          ]}
        >
          <div className={styles['transaction-header']} onClick={this.handleClick}>
            <span>{name}</span>
            <span style={{ fontSize: '10RPX', margin: '0  5RPX' }}>({mock ? '模拟' : '实盘'})</span>
            <Icon type="down" size="xxs" />
          </div>
        </PublicHeader>
        <Modal
          popup={true}
          closable
          visible={visible}
          animationType="slide-up"
          className={styles['modal-body']}
          onClose={() => this.setState({ visible: false })}
        >
          <div className={styles['modal-mock-switch']}>
            <Button
              icon={<img src={require('@app/static/images/svg/switch.svg')} />}
              size="small"
              onClick={handleSwitchMock.bind(this, !mock, code)}
            >
              {mock ? '切换实盘' : '切换模拟'}
            </Button>
          </div>
          {list.map((item: any) => {
            return (
              <div key={item.name} className={styles['modal-content']}>
                <p className={styles['modal-content-title']}>{item.name}</p>
                <div className={styles['modal-content-item']}>
                  {item.list.map((item: any) => {
                    return (
                      <div
                        key={item.id}
                        className={`${styles['modal-content-item-child']} ${
                          activeIndex === item.id
                            ? styles['modal-content-item-active']
                            : styles['modal-content-item-default']
                        }`}
                        onClick={() => this.handleSwitch(item.id)}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </Modal>
      </div>
    );
  }
}

export default React.memo(withRouter(Header));
