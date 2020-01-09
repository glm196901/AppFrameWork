import * as React from 'react';
import { connect } from '@/_store';
import { withRouter, RouteComponentProps } from 'react-router-dom';

export interface IAuthProps extends RouteComponentProps, Store.State {
  to: string;
  className?: string | undefined;
  style?: object;
  auth?: boolean;
}

@connect('userInfo')
class Auth extends React.PureComponent<IAuthProps> {
  handleAuth = (isLogin: boolean) => {
    const to = this.props.to;
    if (isLogin) {
      this.props.history.push(to);
    } else {
      this.props.history.push({
        pathname: '/login',
        state: { to }
      });
    }
  };
  public render() {
    const { isLogin } = this.props.store.userInfo;
    return (
      <div
        className={this.props.className || undefined}
        onClick={this.handleAuth.bind(this, isLogin)}
        style={this.props.style || {}}
      >
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(Auth);
