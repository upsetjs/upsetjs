// eslint-disable-next-line import/no-webpack-loader-syntax
import '!file-loader?name=schema.1.0.0.json!./schema.jsonc';

import Store from '../store/Store';
import { ISet } from '@upsetjs/model';

export interface IDumpSchema {
  $schema: string;
  name: string;
  description: string;
  author: string;

  elements: ReadonlyArray<number | string | any>;
  sets: ReadonlyArray<{
    name: string;
    cardinality: number;
    elems: number[];
  }>;
  combinations: ReadonlyArray<{
    name: string;
    type: 'intersection' | 'union' | 'composite';
    degree: number;
    sets: number[];
    cardinality: number;
    elems: number[];
  }>;
}

function byIndex<T>(arr: ReadonlyArray<T>) {
  const r = new Map(arr.map((v, i) => [v, i]));
  return (v: T) => r.get(v)!;
}

export default function exportJSON(store: Store) {
  const sets = store.visibleSets;
  const combinations = store.visibleCombinations;
  const ds = store.dataset!;
  const elems = store.elems;
  const elem2Index = byIndex(elems);
  const set2Index = byIndex(sets);

  const r: IDumpSchema = {
    $schema: 'https://upsetjs.netlify.com/schema.1.0.0.json',
    name: ds.name,
    description: ds.description,
    author: ds.author,
    elements: elems,
    sets: sets.map((set) => ({
      name: set.name,
      cardinality: set.cardinality,
      elems: set.elems.map(elem2Index),
    })),
    combinations: combinations.map((c) => ({
      ...c,
      elems: c.elems.map(elem2Index),
      sets: Array.from(c.sets).map((v) => set2Index(v as ISet<any>)),
    })),
  };
  return JSON.stringify(r, null, 2);
}
