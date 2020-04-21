import { GenerateSetCombinationsOptions, asSet, asCombination, generateCombinations } from './data';
import { ISets, ISetCombinations, ISetLike, ISet } from './model';
import { UpSetElemQuery, UpSetSetQuery, isSetQuery, isElemQuery } from './queries';
import { toIndicesArray, fromIndicesArray } from './array';

export interface IUpSetDumpRef {
  type: 'set' | 'composite' | 'intersection' | 'union';
  name: string;
}

export declare type UpSetCompressedIndices = ReadonlyArray<number> | string;

export interface IUpSetDump {
  sets: ReadonlyArray<{ name: string; elems: UpSetCompressedIndices }>;
  combinations?: ReadonlyArray<{
    name: string;
    type: 'composite' | 'intersection' | 'union';
    sets: ReadonlyArray<number>;
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

export interface IUpSetDumpConfig {
  compress: 'no' | 'yes' | 'auto';
}

export function toDump<T>(data: IUpSetDumpData<T>, config: IUpSetDumpConfig): IUpSetDump {
  const indicesOptions = { sortAble: true, ...config };
  const toSetRef = (s: ISetLike<T>) => {
    return {
      type: s.type,
      name: s.name,
    };
  };
  return {
    sets: data.sets.map((set) => ({
      name: set.name,
      elems: toIndicesArray(set.elems, data.toElemIndex, indicesOptions),
    })),
    combinations:
      config.compress === 'no'
        ? data.combinations.map((c) => ({
            name: c.name,
            type: c.type,
            sets: data.sets
              .map((s, i) => [s, i] as [ISet<T>, number])
              .filter((si) => c.sets.has(si[0]))
              .map((si) => si[1]),
            elems: toIndicesArray(c.elems, data.toElemIndex, indicesOptions),
          }))
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

export function fromDump<T>(dump: IUpSetDump, elems: ReadonlyArray<T>) {
  const sets: ISets<T> = dump.sets.map((set) => asSet({ ...set, elems: fromIndicesArray(set.elems, elems) }));
  const combinations: ISetCombinations<T> = dump.combinations
    ? dump.combinations.map((c) =>
        asCombination({ ...c, elems: fromIndicesArray(c.elems, elems) }, c.type, (v) => v.sets.map((i) => sets[i]))
      )
    : generateCombinations(sets, dump.combinationOptions);

  function fromSetRef(ref: IUpSetDumpRef): ISetLike<T> | undefined {
    if (ref.type === 'set') {
      return sets.find((d) => d.name === ref.name);
    }
    return combinations.find((d) => d.name === ref.name);
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
