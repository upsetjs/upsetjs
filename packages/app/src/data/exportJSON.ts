/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { loadFile } from '../dump';
import type Store from '../store/Store';
import { toEmbeddedDump, toEmbeddedStaticDump } from './shareEmbedded';
import type { IDataSet, IElem } from './interfaces';
import { loadJSON, decompressElems } from '../dump';
import { IUpSetJSDump, extractSets } from '@upsetjs/react';
import { asSet, fromIndicesArray } from '@upsetjs/model';

export function exportJSON(store: Store) {
  const r = toEmbeddedDump(store, { compress: 'no' });
  return JSON.stringify(r, null, 2);
}

export function exportStaticJSON(store: Store) {
  const r = toEmbeddedStaticDump(store, { compress: 'no' });
  return JSON.stringify(r, null, 2);
}

export function fromDump(dump: IUpSetJSDump, id: string): IDataSet {
  return {
    id,
    name: dump.name,
    author: dump.author ?? 'Unknown',
    description: dump.description,
    creationDate: new Date(),
    attrs: dump.attrs,
    setCount: dump.sets.length,
    load: () => {
      const elems = decompressElems(dump.elements, dump.attrs);
      const sets = dump.sets.map((set) => asSet({ ...set, elems: fromIndicesArray(set.elems, elems) }));
      return Promise.resolve({
        elems: elems,
        sets: sets,
        props: dump.props,
        combinations: dump.combinationOptions,
        queries: dump.queries,
      });
    },
  };
}

export function fromJSON(arr: ReadonlyArray<{ name: string; sets: string[] }>, id: string): IDataSet {
  const elems: (IElem & { sets: string[] })[] = arr.map((e, i) =>
    Object.assign({}, { name: i.toString(), attrs: {} }, e)
  );
  const sets = extractSets(elems);
  return {
    id,
    name: id,
    author: 'Unknown',
    description: '',
    creationDate: new Date(),
    attrs: [],
    setCount: sets.length,
    load: () => {
      return Promise.resolve({
        elems,
        sets,
        props: {},
        combinations: {},
        queries: [],
      });
    },
  };
}

export function importJSON(file: File | string): Promise<IDataSet> {
  if (typeof file === 'string') {
    return loadJSON<any>(file).then((dump) => {
      const name = file.includes('/') ? file.slice(file.lastIndexOf('/') + 1) : file;
      if (dump.$schema === 'https://upset.js.org/schema.1.0.0.json') {
        return fromDump(dump, name);
      }
      return fromJSON(dump, name);
    });
  }
  return loadFile<any>(file).then((dump) => {
    if (dump.$schema === 'https://upset.js.org/schema.1.0.0.json') {
      return fromDump(dump, file.name);
    }
    return fromJSON(dump, file.name);
  });
}
