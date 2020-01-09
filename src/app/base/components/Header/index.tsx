import React from 'react';
import { Icon } from 'antd-mobile';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styles from './style.less';

interface Props extends RouteComponentProps {
  bgColor?: string;
  leftIcon?: React.ReactElement;
  color?: string;
  rightIcons?: Array<React.ReactElement>;
  fixed?: boolean;
  back?: boolean;
}
const fixedStyle = {
  position: 'fixed',
  height: '45RPX',
  overflow: 'hidden',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: 2
};
class Header extends React.Component<Props> {
  static defaultProps = {
    bgColor: styles.bgColor,
    leftIcon: <Icon size="lg" type="left" />,
    color: styles.color,
    rightIcons: [],
    back: true
  };
  render() {
    const { bgColor, history, leftIcon, children, rightIcons, color, fixed, back } = this.props;
    const _style = fixed ? fixedStyle : {};
    return (
      <div className={styles['header']} style={{ background: bgColor, color, ..._style }}>
        <div className={styles['left-icon']}>
          {back && <div onClick={() => history.goBack()}>{leftIcon}</div>}
        </div>
        <div className={styles['content']}>{children}</div>
        <div className={styles['right-icon']}>{rightIcons}</div>
      </div>
    );
  }
}

export default withRouter(Header);
