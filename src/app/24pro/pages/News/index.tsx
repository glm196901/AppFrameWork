import React from 'react';
import Tabs, { TabsType } from './components/Tabs';
import NewsList from './components/NewsList';
import NoticeList from './components//NoticeList';
import NewsFast from './components/NewsFast';
import { withPage } from '@/_store';
import { RouteComponentProps } from 'react-router-dom';

export interface IAppProps extends RouteComponentProps {}

@withPage
export default class News extends React.Component<IAppProps> {
  public newsList: any;
  state = {
    activeIndex: 0,
    // 记住滚动条的位置 对应这三个tabs
    scroll: {
      0: 0,
      1: 0,
      2: 0
    }
  };
  linkTarget = () => {
    const { activeIndex } = this.props.location.state || {};
    if (activeIndex) this.setState({ activeIndex });
  };
  componentDidMount = () => this.linkTarget();
  onShow = () => this.linkTarget();
  onPageScroll = (data: any) => {
    // 记住滚动的位置
    const y = data.scroll.y;
    this.setState({
      scroll: {
        ...this.state.scroll,
        [this.state.activeIndex]: y
      }
    });
  };
  onReachBottom = () => this.newsList();
  newsRef = (newsList: any) => (this.newsList = newsList.loadData);
  handleOnChange = (item: TabsType) => {
    this.setState({ activeIndex: item.type });
    // 选择对应的位置
    const y = this.state.scroll[item.type as 0 | 1 | 2];
    window.scrollTo(0, y);
  };
  public render() {
    const activeIndex = this.state.activeIndex;
    return (
      <div>
        <Tabs onChange={this.handleOnChange} page={activeIndex} />
        <div style={{ display: Object.is(activeIndex, 0) ? 'block' : 'none' }}>
          <NewsList newsRef={this.newsRef} type={activeIndex} {...this.props} />
        </div>
        <div style={{ display: Object.is(activeIndex, 1) ? 'block' : 'none' }}>
          <NewsFast type={activeIndex} {...this.props} />
        </div>
        <div style={{ display: Object.is(activeIndex, 2) ? 'block' : 'none' }}>
          <NoticeList type={activeIndex} {...this.props} />
        </div>
      </div>
    );
  }
}
