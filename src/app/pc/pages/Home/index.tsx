import * as React from 'react';

export interface IHomeProps {}

export default class Home extends React.Component<IHomeProps> {
  public render() {
    return (
      <h1
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 0
        }}
      >
        pc-demo
      </h1>
    );
  }
}
