import { extractSets } from '@upsetjs/model';
import { IDataSet, IElems } from '../interfaces';

const simpsons: IDataSet = {
  id: 'simpsons',
  name: 'Simpsons',
  description: 'Simpsons Dataset',
  author: 'Alexander Lex',
  load: () =>
    import('./data.json').then((data) => {
      return {
        sets: extractSets(data.default as IElems),
        elems: data.default as IElems,
      };
    }),
};

export default simpsons;
