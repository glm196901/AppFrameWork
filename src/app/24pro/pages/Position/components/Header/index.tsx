import * as React from 'react';
import PublicHeader from '@/app/base/components/Header';
import { connect } from '@/_store';
import styles from './style.less';
import { ReactComponent as Switch } from '@/app/base/static/images/svg/switch.svg';

export interface IHeaderProps extends Store.State {
  mock: boolean;
  handleSwitch: any;
  back: boolean;
}

@connect('productIsupDown')
export default class Header extends React.PureComponent<IHeaderProps> {
  public render() {
    const { mock, back } = this.props;
    return (
      <PublicHeader
        back={back}
        bgColor={this.props.store.productIsupDown ? styles.upColor : styles.downColor}
        rightIcons={[
          <Switch
            key="1"
            fill="#ffffff"
            style={{ marginRight: '10RPX', width: '20RPX', height: '20RPX' }}
            onClick={() => this.props.handleSwitch(!mock)}
          />
        ]}
      >
        {mock ? '模拟持仓' : '实盘持仓'}
      </PublicHeader>
    );
  }
}
