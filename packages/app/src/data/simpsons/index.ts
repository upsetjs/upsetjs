import { extractSets } from '@upsetjs/model';
import { IDataSet, IElems } from '../interfaces';

const simpsons: IDataSet = {
  id: 'simpsons',
  name: 'Simpsons',
  description: 'Simpsons Dataset',
  author: 'Alexander Lex',
  attrs: [],
  setCount: 5,
  load: () =>
    import('./data.json').then((data) => {
      const elems: IElems = data.default.map((d) => Object.assign({ attrs: {} }, d));
      return {
        sets: extractSets(elems),
        elems,
      };
    }),
};

export default simpsons;
