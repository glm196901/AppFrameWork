import React, { Component } from 'react';
import styles from './style.less';
import Header from '@/app/base/components/Header';
import { connect, T, dispatch } from '@/_store';
import { Button, Toast } from 'antd-mobile';
import QRCode from 'qrcode.react';
import { copyToClipboard } from '@/app/base/components/tools/index';

interface Props extends Store.State {}
@connect('userInfo')
class Index extends Component<Props> {
  state = {
    header: '推广详情',
    rebateWord: '当月累计返佣',
    rebateRate: '比例',
    // btnIntroduce: '平台介绍',
    shareWords: '分享您的专属链接',
    shareLink: '',
    btnCopy: '复制',
    contents: [{ title: '开户用户数' }, { title: '我的交易用户' }, { title: '累计交易手数' }],
    userId: 0,
    commRatio: 0,
    levName: '',
    userCount: 0,
    userConsume: 0,
    unionVolume: 0
  };
  componentDidMount() {
    dispatch(T.GET_USER_PROMOTION);
  }
  // 复制
  copyLink = (str: string) => {
    Toast.success('成功复制到剪切板', 1);
    copyToClipboard(str);
  };
  // 复制
  platformIntroducce = (str: string) => {
    copyToClipboard(str);
  };

  render() {
    const { union, basicUserData = {} } = this.props.store.userInfo;
    const qrAdress = window.location.origin + `/?ru=${basicUserData.id}`;
    // 依次 累计返佣, 返佣比例, 用户数量, 我的交易用户,用户手数
    const { unionTotal, commRatio, userCount, userConsume, unionVolume } = union;
    const {
      header,
      // btnIntroduce,
      shareWords,
      contents,
      rebateWord,
      rebateRate,
      btnCopy
    } = this.state;
    return (
      <div>
        <Header>{header}</Header>
        <div className={styles['promote']}>
          <div className={styles['promote-rebate']}>
            <div className={styles['promote-rebate-left']}>
              <div className={styles['promote-rebate-left-word']}>{rebateWord}</div>
              <div className={styles['promote-rebate-left-num']}>
                {Math.floor(unionTotal * 100) / 100}
              </div>
            </div>
            <div className={styles['promote-rebate-right']}>
              <div className={styles['promote-rebate-left-word']}>{rebateRate}</div>
              <div className={styles['promote-rebate-left-num']}>{commRatio + '%'}</div>
            </div>
          </div>
          <div className={styles['promote-promoteInfo']}>
            {contents.map((item, index) => {
              return (
                <div
                  key={index}
                  className={
                    item.title === contents[2].title
                      ? `${styles['promote-promoteInfo-item']}`
                      : `${styles['promote-promoteInfo-itemLine']}`
                  }
                >
                  <div className={styles['promote-promoteInfo-item-title']}>{item.title}</div>
                  {item.title === contents[0].title ? (
                    <div className={styles['promote-promoteInfo-item-num']}>{userCount}</div>
                  ) : (
                    ''
                  )}
                  {item.title === contents[1].title ? (
                    <div className={styles['promote-promoteInfo-item-num']}>{userConsume}</div>
                  ) : (
                    ''
                  )}{' '}
                  {item.title === contents[2].title ? (
                    <div className={styles['promote-promoteInfo-item-num']}>{unionVolume}</div>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
          </div>
          <div className={styles['promote-platformIntroducce']}>
            {/* <Button className={styles['promote-platformIntroducce-btn']} onClick={() => {}}>
              {btnIntroduce}
            </Button> */}
          </div>
          <div className={styles['promote-qrCodeWrap']}>
            <QRCode className={styles['promote-qrCodeWrap-qrCode']} value={qrAdress} />
          </div>
          <div className={styles['promote-shareBox']}>
            <div className={styles['promote-shareBox-words']}>{shareWords}</div>
            <div className={styles['promote-shareBox-link']}>{qrAdress}</div>
            <Button
              className={styles['promote-shareBox-btn']}
              onClick={() => {
                this.copyLink(qrAdress);
              }}
            >
              {btnCopy}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
