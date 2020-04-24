import { GenerateSetCombinationsOptions, asSet, asCombination, generateCombinations, setOverlapFactory } from './data';
import { ISets, ISetCombinations, ISetLike, toKey as toDefaultKey, ISetCombination } from './model';
import { UpSetElemQuery, UpSetSetQuery, isSetQuery, isElemQuery, UpSetCalcQuery } from './queries';
import { toIndicesArray, fromIndicesArray } from './array';
import { generateOverlapLookup, generateOverlapLookupFunction } from './data/generateOverlapLookup';
import { SET_JOINERS } from './data/constants';

export interface IUpSetDumpRef {
  type: 'set' | 'composite' | 'intersection' | 'union';
  index: number;
}

export declare type UpSetCompressedIndices = ReadonlyArray<number> | string;

export interface IUpSetDump {
  sets: ReadonlyArray<{ name: string; cardinality: number; elems: UpSetCompressedIndices }>;
  combinations?: ReadonlyArray<{
    name: string;
    type: 'composite' | 'intersection' | 'union';
    sets: ReadonlyArray<number>;
    degree: number;
    cardinality: number;
    elems: UpSetCompressedIndices;
  }>;
  combinationOptions?: Omit<GenerateSetCombinationsOptions, 'elems'>;
  selection?: IUpSetDumpRef;
  queries: ReadonlyArray<{ name: string; color: string; set?: IUpSetDumpRef; elems?: UpSetCompressedIndices }>;
}

export interface IUpSetDumpData<T> {
  toElemIndex(v: T): number;
  sets: ISets<T>;
  combinations: ISetCombinations<T>;
  combinationOptions?: GenerateSetCombinationsOptions<T>;
  selection?: ISetLike<T>;
  queries: ReadonlyArray<UpSetElemQuery<T> | UpSetSetQuery<T>>;
}

export interface IUpSetToDumpConfig<T> {
  compress?: 'no' | 'yes' | 'auto';
  toKey?(set: ISetLike<T>): string;
}

export interface IUpSetFromDumpConfig<T> {
  toElemKey?(set: T): string;
}

export function toDump<T>(data: IUpSetDumpData<T>, config: IUpSetToDumpConfig<T> = {}): IUpSetDump {
  const indicesOptions = { sortAble: true, ...config };
  const toKey = config.toKey ?? toDefaultKey;
  const bySetKey = new Map(data.sets.map((s, i) => [toKey(s), i]));
  const byCombinationKey = new Map(data.combinations.map((s, i) => [toKey(s), i]));
  const toSetRef = (s: ISetLike<T>): IUpSetDumpRef => {
    return {
      type: s.type,
      index: s.type === 'set' ? bySetKey.get(toKey(s))! : byCombinationKey.get(toKey(s))!,
    };
  };
  const setLookup = data.sets.map((s, i) => ({
    key: toKey(s),
    i,
  }));
  return {
    sets: data.sets.map((set) => ({
      name: set.name,
      cardinality: set.cardinality,
      elems: toIndicesArray(set.elems, data.toElemIndex, indicesOptions),
    })),
    combinations:
      config.compress === 'no'
        ? data.combinations.map((c) => {
            const setKeys = new Set(Array.from(c.sets).map(toKey));
            return {
              name: c.name,
              type: c.type,
              cardinality: c.cardinality,
              degree: c.degree,
              sets: setLookup.filter(({ key }) => setKeys.has(key)).map(({ i }) => i),
              elems: toIndicesArray(c.elems, data.toElemIndex, indicesOptions),
            };
          })
        : undefined,
    combinationOptions: data.combinationOptions,
    selection: data.selection ? toSetRef(data.selection) : undefined,
    queries: data.queries.map((query) => ({
      name: query.name,
      color: query.color,
      set: isSetQuery(query) ? toSetRef(query.set) : undefined,
      elems: isElemQuery(query) ? toIndicesArray(Array.from(query.elems), data.toElemIndex, indicesOptions) : undefined,
    })),
  };
}

export function fromDump<T>(
  dump: IUpSetDump,
  elems: ReadonlyArray<T>,
  options: IUpSetFromDumpConfig<T> = {}
): {
  sets: ISets<T>;
  combinations: ISetCombinations<T>;
  selection?: ISetLike<T>;
  queries: ReadonlyArray<UpSetElemQuery<T> | UpSetSetQuery<T>>;
} {
  const sets: ISets<T> = dump.sets.map((set) => asSet({ ...set, elems: fromIndicesArray(set.elems, elems) }));
  const gen = () =>
    generateCombinations(
      sets,
      Object.assign(
        { type: 'intersection' as 'intersection', elems, toElemKey: options.toElemKey },
        dump.combinationOptions ?? {}
      )
    );
  const combinations: ISetCombinations<T> = dump.combinations
    ? dump.combinations.map((c) =>
        asCombination({ ...c, elems: fromIndicesArray(c.elems, elems) }, c.type, (v) => v.sets.map((i) => sets[i]))
      )
    : gen();

  function fromSetRef(ref: IUpSetDumpRef): ISetLike<T> | undefined {
    if (ref.type === 'set') {
      return sets[ref.index];
    }
    return combinations[ref.index];
  }
  return {
    sets,
    combinations,
    selection: dump.selection ? fromSetRef(dump.selection) : undefined,
    queries: dump.queries.map((query) => {
      if (query.set) {
        return {
          name: query.name,
          color: query.color,
          set: fromSetRef(query.set),
        } as UpSetSetQuery<T>;
      }
      return {
        name: query.name,
        color: query.color,
        elems: fromIndicesArray(query.elems!, elems),
      } as UpSetElemQuery<T>;
    }),
  };
}

declare type UpSetFromStaticDumpFullCombination = {
  name: string;
  type: 'composite' | 'intersection' | 'union';
  sets: ReadonlyArray<number>;
  cardinality: number;
};

declare type UpSetFromStaticDumpCompressedCombination = {
  // if missing can be derived
  n?: string;
  c: number;
  // default: i
  type?: 'c' | 'i' | 'u';
  // bit index
  s: number;
};

export interface IUpSetStaticDump {
  sets: ReadonlyArray<{ name: string; cardinality: number } | { n: string; c: number }>;
  combinations: ReadonlyArray<UpSetFromStaticDumpFullCombination | UpSetFromStaticDumpCompressedCombination>;
  selection?: IUpSetDumpRef;
  queries: ReadonlyArray<{ name: string; color: string; set?: IUpSetDumpRef; overlaps?: ReadonlyArray<number> }>;
  overlaps: ReadonlyArray<ReadonlyArray<number>> | string;
}

export interface IUpSetStaticDumpData<T> {
  sets: ISets<T>;
  combinations: ISetCombinations<T>;
  selection?: ISetLike<T>;
  queries: ReadonlyArray<UpSetElemQuery<T> | UpSetSetQuery<T>>;
}

export interface IUpSetToStaticDumpConfig<T> {
  compress?: 'no' | 'yes' | 'auto';
  toKey?(set: ISetLike<T>): string;
  toElemKey?(set: T): string;
}

function generateName(sets: ISets<any>, type: 'intersection' | 'union' | 'composite') {
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
  const toSetRef = (s: ISetLike<T>): IUpSetDumpRef => {
    return {
      type: s.type,
      index: s.type === 'set' ? bySetKey.get(toKey(s))! : byCombinationKey.get(toKey(s))!,
    };
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
      c: number;
      s: number;
      type?: 'c' | 'i' | 'u';
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
      r.type = set.type[0] as 'i' | 'c' | 'u';
    }
    return r;
  };

  return {
    sets: shortNames
      ? data.sets.map((set) => ({ n: set.name, c: set.cardinality }))
      : data.sets.map((set) => ({ name: set.name, cardinality: set.cardinality })),
    combinations: shortNames
      ? data.combinations.map(compressCombination)
      : data.combinations.map((set) => ({
          name: set.name,
          cardinality: set.cardinality,
          type: set.type,
          sets: Array.from(set.sets)
            .map((s) => setIndex.get(toKey(s))!)
            .sort((a, b) => a - b),
        })),
    overlaps,
    selection: data.selection ? toSetRef(data.selection) : undefined,
    queries: data.queries.map((query) => {
      if (isSetQuery(query)) {
        return {
          name: query.name,
          color: query.color,
          set: toSetRef(query.set),
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
  selection?: ISetLike<never>;
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
      elems: [],
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
    };
    const type = lookup[(set.type ?? 'i')[0] as 'i' | 'u' | 'c'];
    return withOverlap({
      name: isCompressed(set) ? set.n ?? generateName(partOf, type) : set.name,
      cardinality: isCompressed(set) ? set.c : set.cardinality,
      type,
      degree: partOf.length,
      sets: new Set(partOf),
      elems: [],
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
  return {
    sets,
    combinations,
    selection: dump.selection ? fromSetRef(dump.selection) : undefined,
    queries: dump.queries.map((query) => {
      if (query.set) {
        return {
          name: query.name,
          color: query.color,
          set: fromSetRef(query.set),
        } as UpSetSetQuery<never>;
      }
      const lookup = query.overlaps!;
      const queryOverlap = (v: ISetLike<never>) => {
        const key = toKey(v);
        const index = setIndex.has(key) ? setIndex.get(key)! : combinationIndex.get(key)!;
        return index == null || index < 0 || index >= lookup.length ? 0 : lookup[index];
      };
      return {
        name: query.name,
        color: query.color,
        overlap: queryOverlap,
      } as UpSetCalcQuery<never>;
    }),
  };
}
