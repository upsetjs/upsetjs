import simpsons from './simpsons';
export { listUpSet2Datasets as listRemote } from './upset2';
export { listLocal, saveLocal, deleteLocal } from './db';

export * from './interfaces';

export function listStatic() {
  return [simpsons];
}
