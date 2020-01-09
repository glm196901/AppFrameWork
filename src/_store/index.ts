import { createStore, Reducer, applyMiddleware as apply } from 'redux';
import { Provider, connect as reduxConnect } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools as devTools } from 'redux-devtools-extension';
import withPage from './withPage';

// @ts-ignore
const T = require(`./${APP}/state/types`);
// @ts-ignore
const rootSaga = require(`./${APP}/saga/index`).default;
// @ts-ignore
const data = require(`./${APP}/state/index`).default;

const SAGA = createSagaMiddleware();
const __PORD__: boolean = process.env.NODE_ENV === 'production';
const store = createStore(data as Reducer, __PORD__ ? apply(SAGA) : devTools(apply(SAGA)));
SAGA.run(rootSaga);

// 获取redux数据的装饰器
const connect = (...args: Array<string>): any => {
  return reduxConnect((state: Store.State) => {
    const object: any = {};
    args.forEach((item: string) => (object[item] = state[item]));
    return { store: object };
  });
};

const dispatch = (type: string, payload?: any) => store.dispatch({ type, payload });
const reduxState = () => store.getState();
export { Provider, connect, dispatch, withPage, T, reduxState, __PORD__ };
export default store;
