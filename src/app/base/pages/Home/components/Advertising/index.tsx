import * as React from 'react';
import styles from './style.less';
import guanggao from '@/app/base/static/images/png/home_activity.png';

export interface IAdvertisingProps {}

export default class Advertising extends React.Component<IAdvertisingProps> {
  public render() {
    return (
      <div className={styles['bw-home-advertising-container']}>
        <img src={guanggao} />
      </div>
    );
  }
}
