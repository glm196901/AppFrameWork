import * as React from 'react';
import Header from '@/app/base/components/Header';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from '@/_store';
import { Toast } from 'antd-mobile';
export interface IActivityProps extends RouteComponentProps, Store.State {}
@connect('userInfo')
export default class Activity extends React.Component<IActivityProps> {
  goWhere = () => {};
  public render() {
    const { isLogin } = this.props.store.userInfo;
    return (
      <div style={{ paddingTop: '45RPX' }}>
        <Header fixed>活动</Header>
        <img
          onClick={
            !isLogin
              ? () => this.props.history.push('/register')
              : () => {
                  Toast.info('请关注我们其他活动', 1);
                }
          }
          width="100%"
          src={require('@/app/base/static/images/png/activity.png')}
          alt="activity"
        />
      </div>
    );
  }
}
