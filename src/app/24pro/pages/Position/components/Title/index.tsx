import * as React from 'react';
import { Button, Modal } from 'antd-mobile';
import { connect, dispatch, T } from '@/_store';
import styles from './style.less';

export interface ITitleProps extends Store.State {
  mock: boolean;
}

@connect('positions', 'productIsupDown')
class Title extends React.PureComponent<ITitleProps> {
  hanldeCloseAll = (mock: boolean) => {
    Modal.alert('提示', '确定全部平仓吗？', [
      {
        text: '取消',
        onPress: () => {}
      },
      {
        text: '确定',
        onPress: () => {
          dispatch(T.ClOSE_POSTION_ALL, { mock });
        }
      }
    ]);
  };
  public render() {
    const { total = 0, positionList = [] } = this.props.store.positions || {};
    return (
      <div
        className={styles['position-title']}
        style={{
          backgroundColor: this.props.store.productIsupDown ? styles.upColor : styles.downColor
        }}
      >
        <div className={styles['position-title-left']}>
          <div className={styles['position-title-left-title']}>浮动总盈亏</div>
          <div className={`${styles['position-title-left-moeny']}`}>
            {Number(total) > 0 ? '+' + total : total}
          </div>
        </div>
        <div className={styles['position-title-right']}>
          {Boolean(positionList.length) && (
            <Button
              type="primary"
              size="small"
              onClick={this.hanldeCloseAll.bind(this, this.props.mock)}
            >
              一键平仓
            </Button>
          )}
        </div>
      </div>
    );
  }
}
export default React.memo(Title);
