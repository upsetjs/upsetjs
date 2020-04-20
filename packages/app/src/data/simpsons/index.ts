import { extractSets } from '@upsetjs/model';
import { IDataSet, IElem } from '../interfaces';
import data from './data.json';

const simpsons: IDataSet = {
  id: 'simpsons',
  name: 'Simpsons',
  description: 'Simpsons Dataset',
  author: 'Alexander Lex',
  attrs: [],
  setCount: 5,
  load: () => {
    const elems: (IElem & { sets: string[] })[] = data.map((d) => Object.assign({ attrs: {} }, d));
    return Promise.resolve({
      sets: extractSets(elems),
      elems,
    });
  },
};

export default simpsons;
