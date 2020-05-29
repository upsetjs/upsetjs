/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { loadFile, loadDump } from '../dump';
import Store from '../store/Store';
import { toEmbeddedDump, toEmbeddedStaticDump } from './shareEmbedded';
import { IDataSet } from './interfaces';
import { loadJSON, decompressElems } from '../dump';
import { IUpSetJSDump } from '../../../bundle/dist';

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
      const infos = loadDump(dump, elems, {});
      return Promise.resolve({
        elems: elems,
        sets: infos.sets,
        props: dump.props,
        combinations: dump.combinationOptions,
        queries: dump.queries,
      });
    },
  };
}

export function importJSON(file: File | string): Promise<IDataSet> {
  if (typeof file === 'string') {
    return loadJSON(file).then((dump) =>
      fromDump(dump, file.includes('/') ? file.slice(file.lastIndexOf('/') + 1) : file)
    );
  }
  return loadFile(file).then((dump) => fromDump(dump, file.name));
}
