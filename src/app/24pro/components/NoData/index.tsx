import * as React from 'react';
import styles from './style.less';

export interface INoDataProps {
  style?: object;
  description?: string;
}

export default class NoData extends React.Component<INoDataProps> {
  public render() {
    return (
      <div style={this.props.style || {}} className={styles['no-data']}>
        <img src={require('./no_data.svg')} alt="暂无数据" />
        <p>{this.props.description || '暂无数据'}</p>
      </div>
    );
  }
}
