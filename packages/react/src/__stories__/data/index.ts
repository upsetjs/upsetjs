/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import got from './got.json';
import { extractSets, UpSetQueries } from '@upsetjs/model';
import { getDefaultTheme } from '../../fillDefaults';

export { mergeColors } from '@upsetjs/model';

export const style = {};
export const elems = got;
export const sets = extractSets(elems, {
  order: 'cardinality',
});

export const queries: UpSetQueries<{ name: string; sets: string[] }> = [
  { name: 'Q1', color: 'steelblue', elems: elems.filter(() => Math.random() > 0.7) },
  { name: 'Q2', color: 'red', elems: elems.filter(() => Math.random() > 0.8) },
];

export const common = { sets, width: 1200, height: 500, style };

export const darkBackgroundColor = getDefaultTheme('dark').backgroundColor;

export const colors = ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494'];
