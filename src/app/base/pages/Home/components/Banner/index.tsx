import * as React from 'react';
import { dispatch, T, connect } from '@/_store';
import Loading from './Loading';
import styles from './style.less';

export interface IBannerProps extends Store.State {
  style?: object;
  autoplay?: boolean;
  dots?: boolean;
  autoplayInterval?: number;
  infinite?: boolean;
}

@connect('banner')
class Banner extends React.Component<IBannerProps> {
  public interval: any;
  public flag: boolean = true;
  static defaultProps = {
    autoplay: true, // 是否自动切换
    dots: true, // 是否显示点
    autoplayInterval: 3000, // 自动切换时间
    infinite: true // 是否循环播放
  };
  state = {
    activeIndex: 0
  };
  componentDidMount() {
    dispatch(T.GET_BANNER_LIST_DATA);
  }
  setAutoPlay = ({ imgs }: any) => {
    this.interval = setInterval(() => {
      this.setState(({ activeIndex }: any) => {
        if (imgs.length) {
          if (this.props.infinite) {
            return {
              activeIndex: activeIndex < imgs.length - 1 ? activeIndex + 1 : 0
            };
          } else {
            if (activeIndex < imgs.length - 1) {
              return {
                activeIndex: activeIndex + 1
              };
            } else {
              clearInterval(this.interval);
              return {
                activeIndex: imgs.length - 1
              };
            }
          }
        }
        return {};
      });
    }, 3000);
  };
  handleClickDot = (index: number, activeIndex: number) => {
    if (activeIndex !== index) {
      clearInterval(this.interval);
      this.setState({ activeIndex: index }, () =>
        this.setAutoPlay({
          imgs: this.props.store.banner || []
        })
      );
    }
  };

  componentWillUnmount = () => clearInterval(this.interval);

  public render() {
    const bannerList = this.props.store.banner || [];
    if (this.props.autoplay && bannerList.length && this.flag) {
      this.flag = false;
      this.setAutoPlay({ imgs: this.props.store.banner || [] });
    }
    return (
      <div className={styles.banner} style={this.props.style}>
        <div>
          {bannerList.map((item: any, index: number) => (
            <img
              className={index === this.state.activeIndex ? styles['active-img'] : null}
              key={index}
              src={item.url}
              alt={item.key}
              onClick={() => {}}
            />
          ))}
          {!Boolean(bannerList.length) && <Loading />}
        </div>
        {this.props.dots && (
          <ul className={styles.dot}>
            {bannerList.map((item: any, index: number) => (
              <li
                onClick={() => this.handleClickDot(index, this.state.activeIndex)}
                className={index === this.state.activeIndex ? styles['active-dot'] : null}
                key={item.url}
              ></li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
export default Banner;
