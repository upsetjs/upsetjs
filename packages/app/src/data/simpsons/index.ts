import { extractSets } from '@upsetjs/model';
import { IDataSet } from '../interfaces';

const simpsons: IDataSet = {
  id: 'simpsons',
  name: 'Simpsons',
  description: 'Simpsons Dataset',
  creationDate: new Date(),
  load: () =>
    import('./data.json').then((data) => {
      return {
        sets: extractSets(data.default),
        combinations: {
          type: 'intersection',
          order: 'cardinality',
          limit: 100,
        },
      };
    }),
};

export default simpsons;
