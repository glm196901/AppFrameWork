import * as React from 'react';
import Header from '@/app/base/components/Header';
import { RouteComponentProps } from 'react-router-dom';
import aboutUs from '@/app/base/static/images/png/aboutB.png';
import cercafication from '@/app/base/static/images/png/certificateB.png';
import relation from '@/app/base/static/images/png/relationB.png';

export interface IActivityProps extends RouteComponentProps {}

export default class AboutUs extends React.Component<IActivityProps> {
  public render() {
    const { activeIndex } = this.props.location.state;
    return (
      <div style={{ paddingTop: '45RPX' }}>
        <Header fixed>
          {activeIndex === 0 && '关于我们'}
          {activeIndex === 1 && '营业执照'}
          {activeIndex === 2 && '牌照资质'}
        </Header>
        {activeIndex === 0 && <img width="100%" src={aboutUs} alt="aboutUs" />}
        {activeIndex === 1 && <img width="100%" src={cercafication} alt="cercafication" />}
        {activeIndex === 2 && <img width="100%" src={relation} alt="relation" />}
      </div>
    );
  }
}
