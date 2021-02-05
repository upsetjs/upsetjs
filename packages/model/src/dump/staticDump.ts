/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { setOverlapFactory } from '../data';
import { SET_JOINERS } from '../data/constants';
import { generateOverlapLookup, generateOverlapLookupFunction } from '../data/generateOverlapLookup';
import {
  ISetCombination,
  ISetCombinations,
  ISetLike,
  ISets,
  toKey as toDefaultKey,
  SetCombinationType,
} from '../model';
import { isSetQuery, UpSetElemQuery, UpSetSetQuery, UpSetCalcQuery } from '../queries';
import type { IUpSetDumpRef } from './interfaces';
import { isSetLike } from '../validators';
import { withColor } from './utils';

export interface UpSetFromStaticDumpFullCombination {
  name: string;
  type: SetCombinationType;
  sets: readonly number[];
  cardinality: number;
}

export interface UpSetFromStaticDumpCompressedCombination {
  // if missing can be derived
  n?: string;
  // cc ... color
  cc?: string;
  c: number;
  // default: i
  type?: 'c' | 'i' | 'u' | 'd';
  // bit index
  s: number;
}

export interface IUpSetStaticDump {
  sets: ReadonlyArray<{ name: string; color?: string; cardinality: number } | { n: string; cc?: string; c: number }>;
  combinations: ReadonlyArray<UpSetFromStaticDumpFullCombination | UpSetFromStaticDumpCompressedCombination>;
  selection?: IUpSetDumpRef | readonly number[];
  queries: ReadonlyArray<{ name: string; color: string; set?: IUpSetDumpRef; overlaps?: readonly number[] }>;
  overlaps: readonly (readonly number[])[] | string;
}

export interface IUpSetStaticDumpData<T> {
  sets: ISets<T>;
  combinations: ISetCombinations<T>;
  selection?: ISetLike<T> | readonly T[];
  queries: ReadonlyArray<UpSetElemQuery<T> | UpSetSetQuery<T>>;
}

export interface IUpSetToStaticDumpConfig<T> {
  compress?: 'no' | 'yes' | 'auto';
  toKey?(set: ISetLike<T>): string;
  toElemKey?(set: T): string;
}

function generateName(sets: ISets<any>, type: SetCombinationType) {
  if (sets.length === 1) {
    return sets[0].name;
  }
  return `(${sets.map((set) => set.name).join(SET_JOINERS[type])})`;
}

export function toStaticDump<T>(
  data: IUpSetStaticDumpData<T>,
  config: IUpSetToStaticDumpConfig<T> = {}
): IUpSetStaticDump {
  const toKey = config.toKey ?? toDefaultKey;
  const bySetKey = new Map(data.sets.map((s, i) => [toKey(s), i]));
  const byCombinationKey = new Map(data.combinations.map((s, i) => [toKey(s), i]));
  const toSelectionSetRef = (s: ISetLike<T> | readonly T[]) => {
    if (isSetLike(s)) {
      if (s.type === 'set') {
        return {
          type: s.type,
          index: bySetKey.get(toKey(s))!,
        };
      }
      const index = byCombinationKey.get(toKey(s));
      if (index != null && index >= 0) {
        return {
          type: s.type,
          index,
        };
      }
    }
    const overlapF = setOverlapFactory(isSetLike(s) ? s.elems : s);
    return data.sets
      .map((set) => overlapF(set.elems).intersection)
      .concat(data.combinations.map((set) => overlapF(set.elems).intersection));
  };
  const setIndex = new Map(data.sets.map((set, i) => [toKey(set), i]));

  const overlaps = generateOverlapLookup(data.sets, data.combinations, config);

  const shortNames = config.compress === 'yes';

  const compressCombination = (set: ISetCombination<T>) => {
    const partOf = Array.from(set.sets)
      .map((s) => setIndex.get(toKey(s))!)
      .sort((a, b) => a - b);
    const r: {
      n?: string;
      cc?: string;
      c: number;
      s: number;
      type?: 'c' | 'i' | 'u' | 'd';
    } = {
      c: set.cardinality,
      s: partOf.reduce((acc, i) => acc + Math.pow(2, i), 0),
    };
    if (
      set.name !==
      generateName(
        partOf.map((i) => data.sets[i]),
        set.type
      )
    ) {
      r.n = set.name;
    }
    if (set.type !== 'intersection') {
      r.type = set.type[0] as 'i' | 'c' | 'u' | 'd';
    }
    if (set.color) {
      r.cc = set.color;
    }
    return r;
  };

  return {
    sets: shortNames
      ? data.sets.map((set) => ({ n: set.name, cc: set.color, c: set.cardinality }))
      : data.sets.map((set) => withColor({ name: set.name, cardinality: set.cardinality }, set)),
    combinations: shortNames
      ? data.combinations.map(compressCombination)
      : data.combinations.map((set) =>
          withColor(
            {
              name: set.name,
              cardinality: set.cardinality,
              type: set.type,
              sets: Array.from(set.sets)
                .map((s) => setIndex.get(toKey(s))!)
                .sort((a, b) => a - b),
            },
            set
          )
        ),
    overlaps,
    selection: data.selection ? toSelectionSetRef(data.selection) : undefined,
    queries: data.queries.map((query) => {
      if (isSetQuery(query)) {
        const ref = toSelectionSetRef(query.set);
        if (Array.isArray(ref)) {
          return {
            name: query.name,
            color: query.color,
            overlaps: ref,
          };
        }
        return {
          name: query.name,
          color: query.color,
          set: ref,
        };
      }
      const overlapF = setOverlapFactory(query.elems);
      const overlaps = data.sets
        .map((set) => overlapF(set.elems).intersection)
        .concat(data.combinations.map((set) => overlapF(set.elems).intersection));
      return {
        name: query.name,
        color: query.color,
        overlaps,
      };
    }),
  };
}

export interface IUpSetFromStaticDumpConfig<T> {
  toKey?(set: ISetLike<T>): string;
}

function isCompressed(
  s: UpSetFromStaticDumpCompressedCombination | UpSetFromStaticDumpFullCombination
): s is UpSetFromStaticDumpCompressedCombination {
  return typeof (s as UpSetFromStaticDumpCompressedCombination).c === 'number';
}
function isCompressedSet(
  s: { name: string; cardinality: number } | { n?: string; c: number }
): s is { n?: string; c: number } {
  return typeof (s as { n?: string; c: number }).c === 'number';
}

export function fromStaticDump(
  dump: IUpSetStaticDump,
  config: IUpSetFromStaticDumpConfig<never> = {}
): {
  sets: ISets<never>;
  combinations: ISetCombinations<never>;
  selection?: ISetLike<never> | ((v: ISetLike<never>) => number);
  queries: ReadonlyArray<UpSetCalcQuery<never> | UpSetSetQuery<never>>;
} {
  const toKey = config.toKey ?? toDefaultKey;
  let computeF: (a: ISetLike<never>, b: ISetLike<never>) => number = () => 0;

  function withOverlap<T extends ISetLike<never>>(s: T) {
    s.overlap = (b: ISetLike<never>) => computeF(s, b);
    return s;
  }

  const sets: ISets<never> = dump.sets.map((set) =>
    withOverlap({
      name: isCompressedSet(set) ? set.n : set.name,
      cardinality: isCompressedSet(set) ? set.c : set.cardinality,
      type: 'set',
      elems: [] as never[],
    })
  );
  const fromBit = (v: number) => {
    return sets.filter((_, i) => {
      const position = Math.pow(2, i);
      return (v & position) === position;
    });
  };
  const combinations: ISetCombinations<never> = dump.combinations.map((set) => {
    const partOf = isCompressed(set) ? fromBit(set.s) : set.sets.map((i) => sets[i]);
    const lookup = {
      i: 'intersection' as 'intersection',
      u: 'union' as 'union',
      c: 'composite' as 'composite',
      d: 'distinctIntersection' as 'distinctIntersection',
    };
    const type = lookup[(set.type ?? 'i')[0] as 'i' | 'u' | 'c' | 'd'];
    return withOverlap({
      name: isCompressed(set) ? set.n ?? generateName(partOf, type) : set.name,
      cardinality: isCompressed(set) ? set.c : set.cardinality,
      type,
      degree: partOf.length,
      sets: new Set(partOf),
      elems: [] as never[],
    });
  });

  const { setIndex, combinationIndex, compute } = generateOverlapLookupFunction(
    dump.overlaps,
    sets,
    combinations,
    toKey
  );
  computeF = compute;

  function fromSetRef(ref: IUpSetDumpRef): ISetLike<never> | undefined {
    if (ref.type === 'set') {
      return sets[ref.index];
    }
    return combinations[ref.index];
  }

  function generateOverlap(lookup: readonly number[]) {
    return (v: ISetLike<never>) => {
      const key = toKey(v);
      const index = setIndex.has(key) ? setIndex.get(key)! : combinationIndex.get(key)!;
      return index == null || index < 0 || index >= lookup.length ? 0 : lookup[index];
    };
  }

  return {
    sets,
    combinations,
    selection: dump.selection
      ? Array.isArray(dump.selection)
        ? generateOverlap(dump.selection)
        : fromSetRef(dump.selection as IUpSetDumpRef)
      : undefined,
    queries: dump.queries.map((query) => {
      if (query.set) {
        return {
          name: query.name,
          color: query.color,
          set: fromSetRef(query.set),
        } as UpSetSetQuery<never>;
      }
      return {
        name: query.name,
        color: query.color,
        overlap: generateOverlap(query.overlaps!),
      } as UpSetCalcQuery<never>;
    }),
  };
}
