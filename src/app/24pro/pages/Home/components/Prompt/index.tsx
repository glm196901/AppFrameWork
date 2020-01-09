import * as React from 'react';
import styles from './style.less';

export interface IPromptProps {}

export default class Prompt extends React.Component<IPromptProps> {
  public render() {
    return (
      <div className={styles['bw-home-prompt-container']}>
        本产品属于高风险、高收益投资品种；投资者应具有较高的风险识别能力、资金实力与风险承受能力。
      </div>
    );
  }
}
