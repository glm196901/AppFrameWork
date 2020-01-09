import React from 'react';
import CustomErrorComponent from './CustomErrorComponent';

interface State {
  hasError: boolean;
}
interface Props {
  readonly children: React.ReactChildren | React.ReactElement | React.ReactNode;
}
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError = (): State => ({ hasError: true });
  componentDidCatch = (error: any, info: any) => {
    /* eslint-disable */
    console.error('打印: 错误信息', error, info);
    // 将错误上传服务器log
    // logComponentStackToMyService(error, info.componentStack)
  };

  public render = () => (this.state.hasError ? <CustomErrorComponent /> : this.props.children);
}

export default ErrorBoundary;
