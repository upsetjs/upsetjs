import simpsons from './simpsons';
export { listUpSet2Datasets as listRemote } from './upset2';
export { listDatasets as listLocal } from './db';

export * from './interfaces';

export function listStatic() {
  return [simpsons];
}
