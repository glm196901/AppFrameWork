import * as React from 'react';
import styles from './style.less';
import guideBook from '@/app/base/static/images/svg/guideBook.svg';
import promotedManger from '@/app/base/static/images/svg/promotedManger.svg';
import rebPocket from '@/app/base/static/images/svg/rebPocket.svg';
// import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Toast } from 'antd-mobile';
import { connect } from '@/_store';
const activities = [
  { title: '新手指南', des: '入门教学', img: guideBook, link: '/guideBook' },
  { title: '开户送模拟金', des: '赠送10万模拟金', img: promotedManger, link: '/activity' },
  { title: '开户送现金', des: '赠送18元现金', img: rebPocket, link: '/activity' }
];
interface Props extends Store.State, RouteComponentProps {}
@connect('userInfo')
class Activity extends React.Component<Props> {
  apartIslogin = (islogin: boolean, link: string) => {
    if (islogin && link !== '/guideBook') {
      return Toast.info('您已开户', 1);
    } else {
      return this.props.history.push(link);
    }
  };
  public render() {
    const { isLogin } = this.props.store.userInfo || {};
    return (
      <div className={styles['bw-home-activity']}>
        {activities.map((item: any, index: number) => {
          return (
            <div
              onClick={() => {
                this.apartIslogin(isLogin, item.link);
              }}
              key={index}
              className={styles['bw-home-activity-item']}
            >
              <div className={styles['bw-home-activity-item-title']}>{item.title}</div>
              <div className={styles['bw-home-activity-item-des']}>{item.des}</div>
              <img className={styles['bw-home-activity-item-img']} src={item.img} alt="" />
            </div>
          );
        })}
      </div>
    );
  }
}

export default withRouter(Activity);
