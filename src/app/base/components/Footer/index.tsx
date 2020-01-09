import React from 'react';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import styles from './style.less';

interface Props extends RouteComponentProps {
  config: any;
}

class Footer extends React.Component<Props> {
  render() {
    const pathname = this.props.location.pathname;
    return (
      <div className={styles['bw-nav-layout']}>
        {this.props.config.map((item: any, index: number) => {
          return (
            <Link key={item.name} to={item.path}>
              <div className={`${styles['bw-nav-icons']} ${styles['bw-nav-icons-' + index]}`}>
                <i
                  className={`${item.icon} ${styles['bw-nav-' + index]}`}
                  style={{
                    fontSize: item.size,
                    color: Object.is(pathname, item.path) ? styles.brandPrimary : '#8e8e93'
                  }}
                />
              </div>
              <span
                className={
                  Object.is(pathname, item.path) ? styles['active-color'] : styles['default-color']
                }
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    );
  }
}

export default withRouter(Footer);
