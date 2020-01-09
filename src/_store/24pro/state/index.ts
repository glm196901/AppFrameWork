import init from './state';
import * as T from './types';

const reducer = (state = init, action: Store.Action): Store.State => {
  switch (action.type) {
    case T.SET_QUOTES_LIST_DATA:
      return {
        ...state,
        ...{ quotesList: action.payload }
      };
    case T.SET_BANNER_LIST_DATA:
      return {
        ...state,
        ...{ banner: action.payload }
      };
    case T.SET_NOTICE_LIST_DATA:
      return {
        ...state,
        ...{ notice: action.payload }
      };
    case T.SET_NEWS_LIST_DATA:
      return {
        ...state,
        ...{ news: action.payload }
      };
    case T.SET_USER_INFO:
      return {
        ...state,
        ...{ userInfo: { ...state.userInfo, ...action.payload } }
      };
    case T.SET_NEWS_DETAIL:
      return {
        ...state,
        ...{ newsDetail: action.payload }
      };
    case T.SET_QUOTE_DOMAIN:
      return {
        ...state,
        ...{ quoteDomain: action.payload }
      };
    case T.SET_PRODUCT_DETAIL:
      return {
        ...state,
        ...{ productDetail: action.payload }
      };
    case T.SET_PRODUCT_PROPS:
      return {
        ...state,
        ...{ productProps: action.payload }
      };
    case T.SET_NEWS_FAET_LIST:
      return {
        ...state,
        ...{ newsFastList: action.payload }
      };
    case T.SET_TRANAACTION_MODAL:
      return {
        ...state,
        ...{
          transactionMoadl: {
            ...state.transactionMoadl,
            ...action.payload
          }
        }
      };
    case T.SET_ROUTER_INFO:
      return {
        ...state,
        ...{ routing: action.payload }
      };
    case T.SET_POSITIONS_DATA:
      return {
        ...state,
        ...{ positions: { ...state.positions, ...action.payload } }
      };
    case T.SET_PAYMENT_LIST:
      return {
        ...state,
        ...{ payment: { ...state.payment, ...action.payload } }
      };
    case T.SET_RULES_DATA:
      return {
        ...state,
        ...{ rules: action.payload }
      };
    case T.SET_PRODUCT_IS_UP_DOWN:
      return {
        ...state,
        ...{ productIsupDown: action.payload }
      };
    case T.SET_OPTIONAL:
      return {
        ...state,
        ...{ favorList: action.payload }
      };

    default:
      return state;
  }
};

export default reducer;
