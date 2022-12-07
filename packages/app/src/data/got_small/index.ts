/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import { extractSets } from '@upsetjs/model';
import type { IDataSet, IElem } from '../interfaces';
import data from './data.json';

const elems: (IElem & { sets: string[] })[] = data.map((d) => ({
  name: d.name,
  sets: d.sets,
  attrs: {},
}));
const sets = extractSets(elems);

const got: IDataSet = {
  id: 'got_small',
  name: 'Game of Thrones Characters (small)',
  description: 'Game of Thrones characters data from https://github.com/ jeffreylancaster/game-of-thrones',
  author: 'Samuel Gratzl',
  attrs: [],
  setCount: sets.length,
  load: () => {
    return Promise.resolve({
      sets,
      elems,
    });
  },
};

export default got;
