/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import simpsons from './simpsons';
export { listUpSet2Datasets as listRemote } from './upset2';
export { listLocal, saveLocal, deleteLocal } from './db';

export * from './interfaces';

export function listStatic() {
  return [simpsons];
}
