import { ISet } from '../model';
import { byCardinality, byName, byComposite } from './utils';

export function asSet<T, S extends { name: string; elems: ReadonlyArray<T> }>(set: S): S & ISet<T> {
  return Object.assign(
    {
      type: 'set' as 'set',
      cardinality: set.elems.length,
    },
    set
  );
}

export declare type PostprocessSetOptions = {
  order?: 'cardinality' | 'name';
  limit?: number;
};

/**
 * @internal
 */
export function postprocessSets<T, S extends ISet<T>>(sets: ReadonlyArray<S>, options: PostprocessSetOptions = {}) {
  let r = sets as S[];
  if (options.order) {
    r = r.slice().sort(options.order === 'cardinality' ? byComposite([byCardinality, byName]) : byName);
  }
  if (options.limit != null) {
    return r.slice(0, options.limit);
  }
  return r;
}

/**
 * helper to create a proper data structures for UpSet sets
 * @param sets set like structures
 */
export default function asSets<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  sets: ReadonlyArray<S>,
  options: PostprocessSetOptions = {}
): (S & ISet<T>)[] {
  return postprocessSets(sets.map(asSet), options);
}
