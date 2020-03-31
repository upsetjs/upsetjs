import { unparse } from 'papaparse';
import Store from '../store/Store';

export default function exportCSV(store: Store) {
  const sets = store.visibleSets;
  const combinations = store.visibleCombinations;
  return unparse([
    ['Name', 'Cardinality', 'Degree', ...sets.map((d) => d.name)],
    ...combinations.map((c) => {
      return [c.name, c.cardinality, c.degree, ...sets.map((s) => (c.sets.has(s) ? 1 : 0))];
    }),
  ]);
}
