import * as React from 'react';
import { connect } from '@/_store';
import styles from './style.less';
import Auth from '@/app/base/components/Auth';
import { Badge } from 'antd-mobile';

export interface IHeaderProps extends Store.State {}

@connect('userInfo')
export default class Header extends React.Component<IHeaderProps> {
  public render() {
    const { basicUserData = {} } = this.props.store.userInfo || {};
    const { unread = 0 } = basicUserData;
    return (
      <div className={styles['bw-home-header-container']}>
        {/* <div className={styles['bw-home-header-container-search']}>
          <img src={require('@/app/base/static/images/svg/home_header_search.svg')} alt="" />
          <input type="text" placeholder="搜索期货" />
        </div> */}
        <div className={styles['bw-home-header-container-icons']}>
          <Auth to={'/customerServive'}>
            <Badge text={unread}>
              <span
                style={{ height: '21RPX', width: '20RPX', color: '#ffffff', fontWeight: 'bold' }}
              >
                客服
              </span>
              {/* 脑残不要图标改文字，醉了额 */}
              {/* <img
                style={{ height: '21RPX', width: '20RPX' }}
                src={require('@/app/base/static/images/svg/home_header_CS.svg')}
                alt=""
              /> */}
            </Badge>
          </Auth>
          {/* <img
            style={{ height: '18RPX', width: '23RPX' }}
            src={require('@/app/base/static/images/svg/home_header_message.svg')}
            alt=""
          /> */}
        </div>
      </div>
    );
  }
}
