import { unparse, parse } from 'papaparse';
import Store from '../store/Store';
import { IDataSet, ILoadedDataSet } from './interfaces';
import { extractSets } from '@upsetjs/model';

export function exportCSV(store: Store) {
  const sets = store.visibleSets;
  const combinations = store.visibleCombinations;
  return unparse([
    ['Name', 'Cardinality', 'Degree', ...sets.map((d) => d.name)],
    ...combinations.map((c) => {
      return [c.name, c.cardinality, c.degree, ...sets.map((s) => (c.sets.has(s) ? 1 : 0))];
    }),
  ]);
}

function isBoolean(v: any) {
  if (v === '' || v == null) {
    // cannot say
    return true;
  }
  if (typeof v === 'number') {
    return v === 1 || v === 0;
  }
  if (typeof v === 'string') {
    const l = v.toLowerCase();
    return l === 't' || l === 'f' || l === 'true' || l === 'false';
  }
  return false;
}

function isTrue(v: any) {
  if (v === '' || v == null) {
    return false;
  }
  if (typeof v === 'number') {
    return v === 1;
  }
  if (typeof v === 'string') {
    const l = v.toLowerCase();
    return l === 't' || l === 'true';
  }
  return false;
}

function determineSets(rows: any[], fields: string[]) {
  // set fields should be like numbers with just 0 and ones
  const setNames = fields.filter((f) => rows.every((row) => isBoolean(row[f])));
  return (row: any) => setNames.filter((f) => isTrue(row[f]));
}

export function importCSV(file: File): Promise<IDataSet> {
  const name = file.name.includes('.') ? file.name.slice(0, file.name.lastIndexOf('.')) : file.name;
  return Promise.resolve({
    id: file.name,
    name,
    creationDate: new Date(),
    author: 'User',
    description: `imported from ${file.name}`,
    load: () =>
      new Promise<ILoadedDataSet>((resolve) => {
        parse(file, {
          dynamicTyping: true,
          header: true,
          complete(results) {
            const elems = results.data;
            const fields = results.meta.fields;
            const toSet = determineSets(elems, fields);
            const sets = extractSets(
              elems.map((e) => {
                e.sets = toSet(e);
                return e;
              })
            );

            resolve({
              elems,
              sets,
            });
          },
        });
      }),
  });
}
