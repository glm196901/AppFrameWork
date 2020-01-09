import * as React from 'react';

export interface IPcLayoutProps {}

export default class PcLayout extends React.Component<IPcLayoutProps> {
  public render() {
    return <div>{this.props.children}</div>;
  }
}
