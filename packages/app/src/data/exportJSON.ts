// eslint-disable-next-line import/no-webpack-loader-syntax
import '!file-loader?name=schema.1.0.0.json!./schema.jsonc';
import { IEmbeddedDumpSchema } from '../embed/interfaces';
import Store from '../store/Store';
import { toEmbeddedDump } from './shareEmbedded';
import { ICustomizeOptions } from './interfaces';

export interface IDumpSchema extends IEmbeddedDumpSchema {
  $schema: string;
  props: ICustomizeOptions;
}

export default function exportJSON(store: Store) {
  const r: IDumpSchema = Object.assign(
    {
      $schema: 'https://upsetjs.netlify.com/schema.1.0.0.json',
    },
    toEmbeddedDump(store)
  );
  return JSON.stringify(r, null, 2);
}
