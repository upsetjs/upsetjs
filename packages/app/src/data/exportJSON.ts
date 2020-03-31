// eslint-disable-next-line import/no-webpack-loader-syntax
import '!file-loader?name=schema.1.0.0.json!./schema.jsonc';

import Store, { stripDefaults } from '../store/Store';
import { GenerateSetCombinationsOptions } from '@upsetjs/model';
import { toJS } from 'mobx';
import { ICustomizeOptions } from './interfaces';

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
  combinations: GenerateSetCombinationsOptions<any>;
  props: ICustomizeOptions;
}

function byIndex<T>(arr: ReadonlyArray<T>) {
  const r = new Map(arr.map((v, i) => [v, i]));
  return (v: T) => r.get(v)!;
}

export default function exportJSON(store: Store) {
  const sets = store.visibleSets;
  const ds = store.dataset!;
  const elems = store.elems;
  const elem2Index = byIndex(elems);

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
    combinations: toJS(store.combinationsOptions),
    props: stripDefaults(store.props),
  };
  return JSON.stringify(r, null, 2);
}
