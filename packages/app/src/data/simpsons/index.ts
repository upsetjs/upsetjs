import { extractSets } from '@upsetjs/model';

export default {
  name: 'Simpsons',
  sets: () => import('./data.json').then((data) => extractSets(data)),
};
