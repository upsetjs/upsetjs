import { ISetLike } from './model';
import { setOverlapFactory, SetOverlap, setElemOverlapFactory, SetElemOverlap } from './data/setOverlap';

export type UpSetElemQuery<T = any> = {
  /**
   * name of this query for the tooltip
   */
  name: string;
  /**
   * color for highlighting
   */
  color: string;

  elems: ReadonlyArray<T> | Set<T>;
};

export type UpSetSetQuery<T = any> = {
  /**
   * name of this query for the tooltip
   */
  name: string;
  /**
   * color for highlighting
   */
  color: string;

  set: ISetLike<T>;
};

export type UpSetCalcQuery<T = any> = {
  /**
   * name of this query for the tooltip
   */
  name: string;
  /**
   * color for highlighting
   */
  color: string;

  /**
   * computes the overlap of the given set to this query
   * @param s the current set to evaluate
   * @return at most `s.cardinality`
   */
  overlap(s: ISetLike<T> | ReadonlyArray<T>): number;
};

export type UpSetQuery<T = any> = UpSetElemQuery<T> | UpSetCalcQuery<T> | UpSetSetQuery<T>;

export function isElemQuery<T>(q: UpSetQuery<T>): q is UpSetElemQuery<T> {
  return Array.isArray((q as UpSetElemQuery<T>).elems);
}

export function isCalcQuery<T>(q: UpSetQuery<T>): q is UpSetCalcQuery<T> {
  return typeof (q as UpSetCalcQuery<T>).overlap === 'function';
}

export function isSetQuery<T>(q: UpSetQuery<T>): q is UpSetSetQuery<T> {
  return (q as UpSetSetQuery<T>).set != null;
}

export function queryOverlap<T>(q: UpSetQuery<T>, what: keyof SetOverlap) {
  if (isCalcQuery(q)) {
    return q.overlap;
  }
  const f = setOverlapFactory(isElemQuery(q) ? q.elems : q.set.elems);
  return (s: ISetLike<T>) => {
    return f(s.elems)[what];
  };
}

export function queryElemOverlap<T>(
  q: UpSetQuery<T>,
  what: keyof SetElemOverlap<T>
): (s: ISetLike<T>) => ReadonlyArray<T> | null {
  if (isCalcQuery(q)) {
    return () => null;
  }
  const f = setElemOverlapFactory(isElemQuery(q) ? q.elems : q.set.elems);
  return (s: ISetLike<T>) => {
    return f(s.elems)[what];
  };
}
