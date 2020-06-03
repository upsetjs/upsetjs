/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { generateCombinations, ISetCombinations, ISetLike, ISets, ISetCombination } from '@upsetjs/model';
import { generateId } from './utils';
import { VennDiagramSizeInfo } from './deriveVennSizeDependent';
import vennDiagramLayout, { ICircle, IArcSlice, IUniverseSet } from '../layout/vennDiagramLayout';

export declare type VennDiagramDataInfo<T> = {
  id: string;
  sets: {
    v: ISets<T>;
    l: ReadonlyArray<ICircle>;
    keys: ReadonlyArray<string>;
    format(v: number): string;
  };
  universe: {
    v: ISetCombination<T>;
    l: IUniverseSet;
    key: string;
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
  const universe = generateCombinations(sets, { min: 0, max: 1, empty: true, toElemKey })[0];

  const cs = generateCombinations(sets, {
    min: 2,
    empty: true,
    order: ['degree:asc', 'group:asc'],
    toElemKey,
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
    universe: {
      key: toKey(universe),
      v: universe,
      l: layout.universe,
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
