// eslint-disable-next-line import/no-webpack-loader-syntax
import '!file-loader?name=schema.1.0.0.json!./schema.jsonc';
import simpsons from './simpsons';
export { listUpSet2Datasets as listRemote } from './upset2';
export { listDatasets as listLocal } from './db';

export * from './interfaces';

export function listStatic() {
  return [simpsons];
}
