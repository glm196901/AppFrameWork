import * as React from 'react';
import Header from '@/app/base/components/Header';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { dispatch, T, connect } from '@/_store';
import styles from './style.less';
export interface INewsDetailProps extends RouteComponentProps, Store.State {}

@connect('newsDetail')
class NewsDetail extends React.Component<INewsDetailProps> {
  componentDidMount() {
    const { id = '' } = (this.props.match.params as any) || {};
    window.scrollTo(0, 0);
    dispatch(T.GET_NEWS_DETAIL, { id });
  }
  public render() {
    const { newsDetail } = this.props.store || {};
    return (
      <div className={styles['news-detail']}>
        <Header fixed>资讯正文</Header>
        <div className={styles['news-detail-content']}>
          <h1>{newsDetail.title}</h1>
          <p>{newsDetail.date}</p>
          <hr />
          <div dangerouslySetInnerHTML={{ __html: newsDetail.content }}></div>
        </div>
      </div>
    );
  }
}
export default withRouter(NewsDetail);
