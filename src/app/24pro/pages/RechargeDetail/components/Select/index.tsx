import * as React from 'react';
import { Button } from 'antd-mobile';
import styles from './style.less';
export default class Select extends React.Component<any> {
  state = {
    money: 0
  };
  public render() {
    const { store = [] } = this.props.params.money || {};
    return (
      <div className={styles['recharge-detail-select']}>
        {store.map((item: number) => {
          return (
            <div key={item}>
              <Button
                type={this.state.money === item ? 'primary' : undefined}
                size="small"
                onClick={() => {
                  this.setState({ money: item });
                }}
              >
                {item}
              </Button>
            </div>
          );
        })}
      </div>
    );
  }
}
