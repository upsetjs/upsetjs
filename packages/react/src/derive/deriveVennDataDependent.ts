/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { generateCombinations, ISetCombinations, ISetLike, ISets } from '@upsetjs/model';
import { generateId } from './utils';
import { VennDiagramSizeInfo } from './deriveVennSizeDependent';
import vennDiagramLayout, { ICircle, IArcSlice } from '../layout/vennDiagramLayout';

export declare type VennDiagramDataInfo<T> = {
  id: string;
  sets: {
    v: ISets<T>;
    l: ReadonlyArray<ICircle>;
    keys: ReadonlyArray<string>;
    format(v: number): string;
  };
  cs: {
    v: ISetCombinations<T>;
    l: ReadonlyArray<IArcSlice>;
    keys: ReadonlyArray<string>;
    format(v: number): string;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
};

export default function deriveVennDataDependent<T>(
  sets: ISets<T>,
  size: VennDiagramSizeInfo,
  valueFormat: (v: number) => string,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string
): VennDiagramDataInfo<T> {
  // TODO options regarding empty set?
  const cs = generateCombinations(sets, {
    min: 2,
    order: ['degree:asc', 'group:asc'],
  });

  const csKeys = cs.map(toKey);
  const setKeys = sets.map(toKey);

  const layout = vennDiagramLayout(sets, cs, size.area);

  return {
    id: id ? id : generateId(),
    sets: {
      v: sets,
      l: layout.sets,
      keys: setKeys,
      format: valueFormat,
    },
    cs: {
      v: cs,
      l: layout.intersections,
      keys: csKeys,
      format: valueFormat,
    },
    toKey,
    toElemKey,
  };
}
