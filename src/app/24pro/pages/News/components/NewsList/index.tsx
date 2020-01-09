import * as React from 'react';
import { dispatch, T, connect } from '@/_store';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Loading from '../Loading';

import styles from './style.less';

export interface INewsListProps extends Store.State, RouteComponentProps {
  type: number;
}

@connect('news')
class NewsList extends React.PureComponent<INewsListProps> {
  loadData = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    if (scrollTop + windowHeight === scrollHeight) {
      const data = this.props.store.news || [];
      if (Array.isArray(data) && data.length && this.props.type === 0) {
        dispatch(T.GET_NEWS_LIST_DATA, { type: 0, id: data[data.length - 1].date });
      }
    }
  };
  componentDidMount = () => this.props.newsRef(this);
  public render() {
    const data = this.props.store.news || [];
    return (
      <>
        {!Boolean(data.length) ? (
          <div style={{ marginTop: '45RPX' }}>
            {Object.keys([...new Array(10)]).map(item => (
              <div key={item} style={{ borderBottom: '1px solid #fff' }}>
                <Loading />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles['bw-news-news-list']}>
            {data.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={styles['bw-news-news-list-item']}
                  onClick={() => this.props.history.push(`/newsDetail/${item.id}`)}
                >
                  <div>
                    <p style={{ color: '#333' }}>{item.title}</p>
                    <p style={{ fontSize: 10 }}>{item.date}</p>
                  </div>
                  <img src={item.thumb} alt="" />
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }
}
export default withRouter(NewsList);
