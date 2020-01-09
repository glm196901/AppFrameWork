import * as React from 'react';
import Header from '@/app/base/components/Header';
import { RouteComponentProps } from 'react-router-dom';
import { Toast } from 'antd-mobile';

export interface IPayIframeProps extends RouteComponentProps {}

export default class PayIframe extends React.Component<IPayIframeProps> {
  componentDidMount() {
    Toast.loading('加载中...');
    try {
      // @ts-ignore
      document.getElementById('PAY').contentWindow.onload = () => Toast.hide();
    } catch {
      Toast.hide();
    }
  }
  public render() {
    return (
      <div>
        <Header>支付</Header>
        <iframe
          // @ts-ignore
          src={this.props.location.state}
          id="PAY"
          frameBorder="0"
          title="支付"
          style={{ width: '100%', height: 'calc(100vh - 45RPX)' }}
        ></iframe>
      </div>
    );
  }
}
