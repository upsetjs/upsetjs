/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISet, ISetCombination, ISetLike, IBaseSet } from './model';
import type { GenerateSetCombinationsOptions } from './data';
import { UpSetQuery, isElemQuery, isCalcQuery, isSetQuery } from './queries';

function isBaseSet(v: any): v is IBaseSet<any> {
  const vt: IBaseSet<any> = v;
  return v != null && typeof vt.cardinality === 'number' && typeof v.name === 'string' && Array.isArray(v.elems);
}

export function isSet(v: any): v is ISet<any> {
  return isBaseSet(v) && (v as ISet<any>).type === 'set';
}

export function isSetCombination(v: any): v is ISetCombination<any> {
  const vt: ISetCombination<any> = v;
  return (
    isBaseSet(v) &&
    ['composite', 'union', 'intersection', 'distinctIntersection'].includes(vt.type) &&
    vt.sets instanceof Set &&
    typeof vt.degree === 'number'
  );
}

export function isSetLike(v: any): v is ISetLike<any> {
  return isSet(v) || isSetCombination(v);
}

export function isGenerateSetCombinationOptions(v: any): v is GenerateSetCombinationsOptions<any> {
  const vt: GenerateSetCombinationsOptions<any> = v;
  return v != null && (vt.type == null || ['intersection', 'union'].includes(vt.type));
}

export function isUpSetQuery(v: any): v is UpSetQuery<any> {
  const vt: UpSetQuery<any> = v;
  return (
    v != null &&
    typeof vt.name === 'string' &&
    typeof vt.color === 'string' &&
    (isElemQuery(vt) || isSetQuery(vt) || isCalcQuery(vt))
  );
}
