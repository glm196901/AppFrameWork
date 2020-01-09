import './api/lib/prototype/index.js';
import React from 'react';
// 异步读取
export default () => {
  return new Promise(async resolve => {
    const { Alpha } = await import('./api/pro/contract/alpha');
    const { init, Contracts, Data, Quote } = await import('./api/pro/contract');
    const { spy } = await import('./api/core/store');
    const { STORE } = await import('./api/core/store/state');
    const { EVENT } = await import('./api/pro/event');
    const { Chart } = await import('./api/pro/chartTV/chart');
    const { ChartIQ } = await import('./api/pro/chartiq/chartIQ');
    const { PAYMENT } = await import('./api/pro/payments');
    const { RULE } = await import('./api/pro/rule');
    const { RULE: DIGITALRULE } = await import('./api/pro/whitePage');
    const loading = await import('./api/pro/network/loading');
    /**设置全局loading */
    loading.default.setLoading(() => window.Toast && window.Toast.loading('', 15));
    // loading结束
    spy('loadingEnd', () => window.Toast && window.Toast.hide());
    /**设置全局错误提示 */
    EVENT.Error.setAlert(err => {
      const msg = err.errorMsg || err.resultMsg || err.msg || err.message || err;
      window.Toast.info(<div dangerouslySetInnerHTML={{ __html: msg }}></div>, 1);
    });
    resolve({
      Alpha,
      init,
      Contracts,
      Data,
      spy,
      EVENT,
      Quote,
      Chart,
      ChartIQ,
      STORE,
      PAYMENT,
      RULE,
      DIGITALRULE
    });
  });
};
