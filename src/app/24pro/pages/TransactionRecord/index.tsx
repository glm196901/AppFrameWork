import React, { Component } from 'react';
// import styles from './style.less';
import { Link } from 'react-router-dom';

import Header from '@/app/base/components/Header';
class Index extends Component {
  render() {
    return (
      <div>
        <Header />
        <Link to="/addBankCard">
          <div>添加银行卡</div>
        </Link>
      </div>
    );
  }
}

export default Index;
