import * as React from 'react';
import { connect } from '@/_store';
import dayjs from 'dayjs';
import styles from './style.less';
import NoData from '@/app/base/components/NoData';
export interface INewsListProps {}

export interface INewsListProps extends Store.State {}

@connect('notice')
export default class NewsList extends React.PureComponent<INewsListProps> {
  componentDidMount() {}
  public render() {
    const data = this.props.store.notice || [];
    return (
      <>
        {!Boolean(data.length) ? (
          <div style={{ marginTop: '45RPX' }}>
            <NoData />
          </div>
        ) : (
          <div className={styles['bw-news-notice-list']}>
            {data.map((item: any) => {
              return (
                <div key={item.id} className={styles['bw-news-notice-list-item']}>
                  <p className={styles['bw-news-notice-list-item-time']}>
                    <span>{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</span>
                  </p>
                  <div className={styles['bw-news-notice-list-item-block']}>
                    <p
                      className={styles['bw-news-notice-list-item-block-title']}
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    ></p>
                    <p
                      className={styles['bw-news-notice-list-item-block-content']}
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    ></p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }
}
