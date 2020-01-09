import React from 'react';
import { dispatch, T, withPage } from '@/_store';
import Header from './components/Header';
import Banner from './components/Banner';
import NavMenu from './components/NavMenu';
import Announcement from './components/Announcement';
// import Advertising from './components/Advertising';
import QuotesBlock from './components/QuotesBlock';
import Activity from './components/Activity';
import Prompt from './components/Prompt';
import AboutUs from './components/AboutUs';
import { Toast, Modal } from 'antd-mobile';
import styles from './style.less';

// @ts-ignore
window.Toast = Toast;
// @ts-ignore
window.Alert = Modal.alert;
dispatch(T.__PRE_LOAD_DATA__);
interface Props {}
interface State {}

@withPage
class Home extends React.Component<Props, State> {
  onShow = () => dispatch(T.GET_QUOTES_LIST_DATA);
  onHide = () => dispatch(T.END_QUOTES_LIST_DATA);
  render() {
    return (
      <div className={styles['home-container']}>
        <Header />
        <Banner />
        <NavMenu />
        <Announcement />
        {/* <Advertising /> */}
        <QuotesBlock />
        <Activity />
        <Prompt />
        <AboutUs />
      </div>
    );
  }
}

export default React.memo(Home);
