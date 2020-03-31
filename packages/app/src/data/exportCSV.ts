import { unparse } from 'papaparse';
import { IDumpInfo } from './interfaces';

export default function exportCSV({ sets, combinations }: IDumpInfo) {
  return unparse([
    ['Name', 'Cardinality', 'Degree', ...sets.map((d) => d.name)],
    ...combinations.map((c) => {
      return [c.name, c.cardinality, c.degree, ...sets.map((s) => (c.sets.has(s) ? 1 : 0))];
    }),
  ]);
}
