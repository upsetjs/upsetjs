import { GenerateSetCombinationsOptions, asSet, asCombination, generateCombinations } from './data';
import { ISets, ISetCombinations, ISetLike, toKey as toDefaultKey } from './model';
import { UpSetElemQuery, UpSetSetQuery, isSetQuery, isElemQuery } from './queries';
import { toIndicesArray, fromIndicesArray } from './array';

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
  compress: 'no' | 'yes' | 'auto';
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

export function fromDump<T>(dump: IUpSetDump, elems: ReadonlyArray<T>, options: IUpSetFromDumpConfig<T> = {}) {
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
