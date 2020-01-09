import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { withPage } from '@/_store';
import img0 from '@/app/base/static/images/png/guide/0.png';
import img1 from '@/app/base/static/images/png/guide/1.png';
import img2 from '@/app/base/static/images/png/guide/2.png';
import img3 from '@/app/base/static/images/png/guide/3.png';
import img4 from '@/app/base/static/images/png/guide/4.png';
import img5 from '@/app/base/static/images/png/guide/5.png';
import Header from '@/app/base/components/Header';

import styles from './style.less';
export interface IActivityProps extends RouteComponentProps {}
@withPage
class GuideBook extends React.Component<IActivityProps> {
  state = {
    header: '新手指南',
    page: 0,
    imgList: [img0, img1, img2, img3, img4, img5],
    mockpath: '/transaction/CL/true',
    path: '/transaction/CL/false'
  };
  onHide = () => {
    this.setState({ page: 0 });
  };
  public render() {
    const { page, imgList, mockpath, path } = this.state;
    return (
      <div>
        <Header fixed>新手指南</Header>
        <div className={styles['last']} onClick={() => this.setState({ page: 5 })}></div>
        <img className={styles['page']} src={imgList[page]} alt="" />
        {page === 5 ? null : (
          <div className={styles['next']} onClick={() => this.setState({ page: page + 1 })}></div>
        )}
        {page === 5 ? (
          <div className={styles['lastStep']}>
            {/* <div className={styles['lastStep-space']}></div> */}
            <div className={styles['lastStep-goWhere']}>
              <Link to={mockpath} replace></Link>
              <Link to={path} replace></Link>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
export default GuideBook;
