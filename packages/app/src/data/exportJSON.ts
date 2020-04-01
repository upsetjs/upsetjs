// eslint-disable-next-line import/no-webpack-loader-syntax
import '!file-loader?name=schema.1.0.0.json!./schema.jsonc';
import { IEmbeddedDumpSchema, loadFile, loadDump } from '../dump';
import Store from '../store/Store';
import { toEmbeddedDump } from './shareEmbedded';
import { ICustomizeOptions, IDataSet } from './interfaces';
import { UpSetProps, generateCombinations } from '@upsetjs/react';

export interface IDumpSchema extends IEmbeddedDumpSchema {
  $schema: string;
  props: ICustomizeOptions;
}

export function exportJSON(store: Store) {
  const r: IDumpSchema = Object.assign(
    {
      $schema: 'https://upsetjs.netlify.com/schema.1.0.0.json',
    },
    toEmbeddedDump(store)
  );
  return JSON.stringify(r, null, 2);
}

export function importJSON(file: File): Promise<IDataSet> {
  return loadFile(file).then((dump) => ({
    id: file.name,
    name: dump.name,
    author: dump.author,
    description: dump.description,
    creationDate: new Date(),
    load: () => {
      const r = loadDump<UpSetProps<any>>(dump, generateCombinations);
      return Promise.resolve({
        elems: dump.elements,
        sets: r.sets,
        props: dump.props,
        combinations: dump.combinations,
      });
    },
  }));
}
