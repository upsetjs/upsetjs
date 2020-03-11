import { ISetLike } from '@upsetjs/model';

export type UpSetElemQuery<T> = {
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

export type UpSetSetQuery<T> = {
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

export type UpSetCalcQuery<T> = {
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
  overlap(s: ISetLike<T>): number;
};

export type UpSetQuery<T> = UpSetElemQuery<T> | UpSetCalcQuery<T> | UpSetSetQuery<T>;

export function isElemQuery<T>(q: UpSetQuery<T>): q is UpSetElemQuery<T> {
  return Array.isArray((q as UpSetElemQuery<T>).elems);
}

export function isSetQuery<T>(q: UpSetQuery<T>): q is UpSetSetQuery<T> {
  return (q as UpSetSetQuery<T>).set != null;
}
