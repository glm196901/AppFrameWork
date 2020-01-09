import * as React from 'react';
import { connect } from '@/_store';
import Loading from '../Loading';
import styles from './style.less';

export interface INewsListProps extends Store.State {}

@connect('newsFastList')
export default class NewsList extends React.PureComponent<INewsListProps> {
  componentDidMount() {}
  public render() {
    const data = this.props.store.newsFastList || [];
    return (
      <>
        {!Boolean(data.length) ? (
          <div style={{ marginTop: '45RPX' }}>
            {Object.keys([...new Array(5)]).map(item => (
              <div key={item}>
                <Loading />
                <div style={{ height: '1px', background: '#fff' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles['bw-news-fast-list']}>
            {data.map((item: any) => {
              return (
                <div key={item.id} className={styles['bw-news-fast-list-item']}>
                  <p
                    className={styles['bw-news-fast-list-item-title']}
                    dangerouslySetInnerHTML={{ __html: item.date }}
                  ></p>
                  <p
                    className={styles['bw-news-fast-list-item-content']}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></p>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }
}
