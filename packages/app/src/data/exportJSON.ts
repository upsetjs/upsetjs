// eslint-disable-next-line import/no-webpack-loader-syntax
import '!file-loader?name=schema.1.0.0.json!./schema.jsonc';

import Store from '../store/Store';

export interface IDumpSchema {
  $schema: string;
  name: string;
  description: string;
  author: string;

  elements: { uid: number; obj: number | string | any }[];
  sets: {
    uid: number;
    name: string;
    cardinality: number;
    elems: number[];
  }[];
  combinations: {
    uid: number;
    name: string;
    type: 'intersection' | 'union' | 'composite';
    degree: number;
    sets: number[];
    cardinality: number;
    elems: number[];
  }[];
}

function uidGenerator() {
  let uid = 1;
  const lookup = new Map<any, number>();
  return (obj: any) => {
    if (lookup.has(obj)) {
      return lookup.get(obj)!;
    }
    const id = uid++;
    lookup.set(obj, id);
    return id;
  };
}

export default function exportJSON(store: Store) {
  const sets = store.visibleSets;
  const combinations = store.visibleCombinations;
  const ds = store.dataset!;
  const elems = store.elems;

  const uid = uidGenerator();
  const r: IDumpSchema = {
    $schema: 'https://upsetjs.netlify.com/schema.1.0.0.json',
    name: ds.name,
    description: ds.description,
    author: ds.author,
    elements: elems.map((elem: any) => ({
      uid: uid(elem),
      obj: elem,
    })),
    sets: sets.map((set) => ({
      uid: uid(set),
      name: set.name,
      cardinality: set.cardinality,
      elems: set.elems.map((e) => uid(e)),
    })),
    combinations: combinations.map((c) => ({
      uid: uid(c),
      name: c.name,
      cardinality: c.cardinality,
      degree: c.degree,
      type: c.type,
      elems: c.elems.map((e) => uid(e)),
      sets: Array.from(c.sets).map((s) => uid(s)),
    })),
  };
  return JSON.stringify(r, null, 2);
}
