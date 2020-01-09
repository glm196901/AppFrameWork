import React from 'react';
import ReactDOM from 'react-dom';
import Pages from '@/_components/Router';
import ErrorBoundary from '@/_components/ErrorBoundary';
import store, { Provider } from '@/_store';

const App = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <Pages />
    </Provider>
  </ErrorBoundary>
);

ReactDOM.render(<App />, document.getElementById('root'));

// 移动端300ms延迟
if (process.env.isFastclick) {
  // @ts-ignore
  import('react-fastclick').then(module => module.default());
}

// 注册PWA
if (process.env.isSW) {
  import('./sw.js').then(module => module.register());
}

// 热重载
if (process.env.isHot) {
  import('react-hot-loader').then(({ hot }: any) => hot(module)(App));
}
