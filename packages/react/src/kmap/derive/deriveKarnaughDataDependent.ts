/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  GenerateSetCombinationsOptions,
  ISet,
  ISetCombination,
  ISetCombinations,
  ISetLike,
  ISets,
} from '@upsetjs/model';
import { areCombinations } from '../../derive/deriveDataDependent';
import { generateId } from '../../utils';
import { VennDiagramSizeInfo } from '../../venn/derive/deriveVennSizeDependent';

export declare type KarnaughMapDataInfo<T> = {
  id: string;
  format(v: number): string;
  sets: {
    v: ISets<T>;
    format(v: number): string;
  };
  cs: {
    v: ISetCombinations<T>;
    has(v: ISetCombination<T>, s: ISet<T>): boolean;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
};

export default function deriveKarnaughDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  _size: VennDiagramSizeInfo,
  valueFormat: (v: number) => string,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string
): KarnaughMapDataInfo<T> {
  return {
    id: id ? id : generateId(),
    sets: {
      v: sets,
      format: valueFormat,
    },
    format: valueFormat,
    cs: {
      v: areCombinations(combinations) ? combinations : [],
      has: (v, s) => {
        const sk = toKey(s);
        return Array.from(v.sets).some((ss) => toKey(ss) === sk);
      },
    },
    toKey,
    toElemKey,
  };
}
