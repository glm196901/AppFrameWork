import * as React from 'react';
import QuotesBlockItem from './QuotesBlockItem';
import { connect } from '@/_store';
import Loading from './Loading';
export interface IQuotesBlockProps extends Store.State {}

type T = {
  name: string;
  list: Array<any>;
};

@connect('quotesList')
class QuotesBlock extends React.PureComponent<IQuotesBlockProps> {
  public render() {
    let data = this.props.store.quotesList['热门商品'] || [];
    return data.length ? <QuotesBlockItem name={'热门商品'} data={data} /> : <Loading />;
  }
}
export default React.memo(QuotesBlock);
