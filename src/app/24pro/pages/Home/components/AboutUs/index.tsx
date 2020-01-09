import * as React from 'react';
import styles from './style.less';
import { Link } from 'react-router-dom';

export interface IPromptProps {}
const aboutUs = [
  {
    title: '关于我们'
  },
  {
    title: '营业执照'
  },
  {
    title: '资质牌照'
  }
];
export default class Prompt extends React.Component<IPromptProps> {
  public render() {
    return (
      <div className={styles['bw-home-about-container']}>
        {aboutUs.map((item, index) => {
          return (
            <Link
              key={index}
              to={{ pathname: '/aboutUs', state: { activeIndex: index } }}
              className={styles['bw-home-about-container-about']}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
    );
  }
}
