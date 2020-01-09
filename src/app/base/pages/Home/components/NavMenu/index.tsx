import * as React from 'react';
import home_nav_simulation from '@/app/base/static/images/svg/home_nav_simulation.svg';
import home_nav_activity from '@/app/base/static/images/svg/home_nav_activity.svg';
import home_nav_withdrawal from '@/app/base/static/images/svg/home_nav_withdrawal.svg';
import home_nav_DC from '@/app/base/static/images/svg/home_nav_DC.svg';
import { Link } from 'react-router-dom';
import styles from './style.less';

export interface INavMenuProps {}

const config = [
  {
    name: '模拟练习',
    img: home_nav_simulation,
    path: '/transaction/CL/true',
    style: {
      width: '36RPX',
      height: '35RPX'
    }
  },
  {
    name: '优惠活动',
    img: home_nav_activity,
    path: '/activity',
    // path: '/payIframe',

    style: {
      width: '34RPX',
      height: '34RPX'
    }
  },
  {
    name: '快速入金',
    img: home_nav_withdrawal,
    path: '/recharge',
    style: {
      width: '37RPX',
      height: '36RPX'
    }
  },
  {
    name: '数字货币',
    img: home_nav_DC,
    path: '/market',
    style: {
      width: '32RPX',
      height: '35RPX'
    },
    params: { activeIndex: 3 }
  }
];

export default class NavMenu extends React.Component<INavMenuProps> {
  public render() {
    return (
      <div className={styles['bw-home-nav']}>
        {config.map(item => (
          <Link
            to={{ pathname: item.path, state: item.params }}
            key={item.name}
            className={styles['bw-home-nav-item']}
          >
            <img style={item.style} src={item.img} />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    );
  }
}
