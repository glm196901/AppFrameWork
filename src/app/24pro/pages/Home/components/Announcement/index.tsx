import * as React from 'react';
import { Carousel } from 'antd-mobile';
import pintaigonggao from '@/app/base/static/images/png/home_announcement.png';
import { connect, T, dispatch } from '@/_store';
import { Link } from 'react-router-dom';
import styles from './style.less';

export interface IAnnouncementProps extends Store.State {}

@connect('notice')
export default class Announcement extends React.Component<IAnnouncementProps> {
  componentDidMount() {
    dispatch(T.GET_NOTICE_LIST_DATA);
  }
  public render() {
    const notice = this.props.store.notice;
    return (
      <div className={styles['bw-home-announcement-container']}>
        <img src={pintaigonggao} />
        {Boolean(notice.length) ? (
          <Carousel className="my-carousel" vertical dots={false} autoplay infinite>
            {notice.map((item: any) => {
              return (
                <Link
                  to={{ pathname: '/news', state: { activeIndex: 2 } }}
                  key={item.id}
                  className="v-item"
                >
                  {item.title}
                </Link>
              );
            })}
          </Carousel>
        ) : null}
        <Link
          className={styles['bw-home-announcement-container-more']}
          to={{ pathname: '/news', state: { activeIndex: 2 } }}
        >
          <div>更多</div>
        </Link>
      </div>
    );
  }
}
