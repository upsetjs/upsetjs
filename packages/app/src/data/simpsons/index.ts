import { extractSets } from '@upsetjs/model';
import { IDataSet } from '../interfaces';

const simpsons: IDataSet = {
  id: 'simpsons',
  name: 'Simpsons',
  description: 'Simpsons Dataset',
  creationDate: new Date(),
  sets: () =>
    import('./data.json').then((data) => {
      return extractSets(data.default);
    }),
};

export default simpsons;
