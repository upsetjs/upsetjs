/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { IEmbeddedDumpSchema, loadFile, loadDump, IEmbeddedStaticDumpSchema } from '../dump';
import Store from '../store/Store';
import { toEmbeddedDump, toEmbeddedStaticdump } from './shareEmbedded';
import { ICustomizeOptions, IDataSet } from './interfaces';
import { loadJSON, uncompressElems } from '../dump';

export interface IDumpSchema extends IEmbeddedDumpSchema {
  $schema: string;
  props: ICustomizeOptions;
}

export function exportJSON(store: Store) {
  const r: IDumpSchema = Object.assign(
    {
      $schema: 'https://upset.js.org/schema.1.0.0.json',
    },
    toEmbeddedDump(store, { compress: 'no' })
  );
  return JSON.stringify(r, null, 2);
}

export interface IStaticDumpSchema extends IEmbeddedStaticDumpSchema {
  $schema: string;
  props: ICustomizeOptions;
}

export function exportStaticJSON(store: Store) {
  const r: IStaticDumpSchema = Object.assign(
    {
      $schema: 'https://upset.js.org/schema-static.1.0.0.json',
    },
    toEmbeddedStaticdump(store, { compress: 'no' })
  );
  return JSON.stringify(r, null, 2);
}

export function fromDump(dump: IEmbeddedDumpSchema, id: string): IDataSet {
  return {
    id,
    name: dump.name,
    author: dump.author,
    description: dump.description,
    creationDate: new Date(),
    attrs: dump.attrs,
    setCount: dump.sets.length,
    load: () => {
      const elems = uncompressElems(dump.elements, dump.attrs);
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
