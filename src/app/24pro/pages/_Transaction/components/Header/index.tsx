import * as React from 'react';
import PublicHeader from '@/app/base/components/Header';
import { Icon, Modal, Button, Popover } from 'antd-mobile';
import styles from './style.less';
import { connect } from '@/_store';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const Item = Popover.Item;

export interface IHeaderProps extends Store.State, RouteComponentProps {}

@connect('userInfo', 'productProps', 'quotesList')
class Header extends React.Component<IHeaderProps> {
  state = {
    visible: false,
    popoverVisible: false,
    activeIndex: ''
  };
  componentWillReceiveProps(nextProps: any) {
    if (this.props.code !== nextProps.code) {
      this.setState({ activeIndex: nextProps.code });
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
    const { name } = this.props.store.productProps;
    const { quotesList } = this.props.store;
    const { visible, activeIndex, popoverVisible } = this.state;
    const { mock, handleSwitchMock, code } = this.props;
    return (
      <div>
        <PublicHeader
          rightIcons={[
            <div key="1">
              <Popover
                mask
                visible={popoverVisible}
                onVisibleChange={this.handleVisibleChange}
                overlay={[
                  // @ts-ignore
                  <Item key="1" value={'/position/false'} style={{ whiteSpace: 'nowrap' }}>
                    实盘持仓
                  </Item>,
                  // @ts-ignore
                  <Item key="2" value={'/position/true'} style={{ whiteSpace: 'nowrap' }}>
                    模拟持仓
                  </Item>,
                  // @ts-ignore
                  <Item key="3" value={`/rules/${code}`} style={{ whiteSpace: 'nowrap' }}>
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
              </Popover>
            </div>
          ]}
        >
          <div className={styles['transaction-header']} onClick={this.handleClick}>
            <span>{name}</span>
            <span style={{ fontSize: '10RPX', margin: '0  5RPX' }}>
              ({mock === 'true' ? '模拟' : '实盘'})
            </span>
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
              size="small"
              onClick={handleSwitchMock.bind(this, mock === 'true' ? 'false' : 'true')}
            >
              {mock === 'true' ? '切换实盘' : '切换模拟'}
            </Button>
          </div>
          {quotesList.map((item: any) => {
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

export default withRouter(Header);
