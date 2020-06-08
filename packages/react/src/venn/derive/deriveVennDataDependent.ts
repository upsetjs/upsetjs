/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { generateCombinations, ISetCombinations, ISetLike, ISets } from '@upsetjs/model';
import { generateId } from '../../utils';
import { IArcSlice, ICircle } from '../layout/interfaces';
import vennDiagramLayout from '../layout/vennDiagramLayout';
import { VennDiagramSizeInfo } from './deriveVennSizeDependent';

export declare type VennDiagramDataInfo<T> = {
  id: string;
  format(v: number): string;
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
  const cs = generateCombinations(sets, {
    min: 2,
    empty: true,
    order: ['degree:asc', 'group:asc'],
    toElemKey,
  });

  const csKeys = cs.map(toKey);
  const setKeys = sets.map(toKey);

  const layout = vennDiagramLayout(sets.length, size.area);

  return {
    id: id ? id : generateId(),
    sets: {
      v: sets,
      l: layout.sets,
      keys: setKeys,
      format: valueFormat,
    },
    format: valueFormat,
    cs: {
      v: cs,
      l: layout.intersections,
      keys: csKeys,
    },
    toKey,
    toElemKey,
  };
}
