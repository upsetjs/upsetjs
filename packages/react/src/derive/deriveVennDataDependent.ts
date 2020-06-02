/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { generateCombinations, ISetCombinations, ISetLike, ISets } from '@upsetjs/model';
import { generateId } from './utils';

export declare type VennDiagramDataInfo<T> = {
  id: string;
  sets: {
    v: ISets<T>;
    keys: ReadonlyArray<string>;
    format(v: number): string;
  };
  cs: {
    v: ISetCombinations<T>;
    keys: ReadonlyArray<string>;
    format(v: number): string;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
};

export default function deriveVennDataDependent<T>(
  sets: ISets<T>,
  valueFormat: (v: number) => string,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string
): VennDiagramDataInfo<T> {
  const cs = generateCombinations(sets, {});

  const csKeys = cs.map(toKey);
  const setKeys = sets.map(toKey);

  return {
    id: id ? id : generateId(),
    sets: {
      v: sets,
      keys: setKeys,
      format: valueFormat,
    },
    cs: {
      v: cs,
      keys: csKeys,
      format: valueFormat,
    },
    toKey,
    toElemKey,
  };
}
