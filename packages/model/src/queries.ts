/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike } from './model';
import {
  setOverlapFactory,
  SetOverlap,
  setElemOverlapFactory,
  SetElemOverlap,
  setElemIntersectionFactory,
} from './data/setOverlap';

export interface UpSetElemQuery<T = any> {
  /**
   * name of this query for the tooltip
   */
  readonly name: string;
  /**
   * color for highlighting
   */
  readonly color: string;
  /**
   * elements within this query
   */
  readonly elems: readonly T[] | Set<T>;
}

export interface UpSetSetQuery<T = any> {
  /**
   * name of this query for the tooltip
   */
  readonly name: string;
  /**
   * color for highlighting
   */
  readonly color: string;
  /**
   * set to highlight
   */
  readonly set: ISetLike<T>;
}

export interface UpSetCalcQuery<T = any> {
  /**
   * name of this query for the tooltip
   */
  readonly name: string;
  /**
   * color for highlighting
   */
  readonly color: string;
  /**
   * computes the overlap of the given set to this query
   * @param s the current set to evaluate
   * @return at most `s.cardinality`
   */
  overlap(s: ISetLike<T> | readonly T[]): number;
}

export type UpSetQuery<T = any> = UpSetElemQuery<T> | UpSetCalcQuery<T> | UpSetSetQuery<T>;
export type UpSetQueries<T = any> = readonly UpSetQuery<T>[];

export function isElemQuery<T>(q: UpSetQuery<T>): q is UpSetElemQuery<T> {
  return Array.isArray((q as UpSetElemQuery<T>).elems);
}

export function isCalcQuery<T>(q: UpSetQuery<T>): q is UpSetCalcQuery<T> {
  return typeof (q as UpSetCalcQuery<T>).overlap === 'function';
}

export function isSetQuery<T>(q: UpSetQuery<T>): q is UpSetSetQuery<T> {
  return (q as UpSetSetQuery<T>).set != null;
}

/**
 * helper method to create an overlap function for a given query
 * @param query the query
 * @param what type of overlap
 * @param toElemKey optional key function
 */
export function queryOverlap<T>(query: UpSetQuery<T>, what: keyof SetOverlap, toElemKey?: (e: T) => string) {
  if (isCalcQuery(query)) {
    return query.overlap;
  }
  if (isSetQuery(query) && query.set.overlap) {
    return query.set.overlap;
  }
  const f = setOverlapFactory(isElemQuery(query) ? query.elems : query.set.elems, toElemKey);
  return (s: ISetLike<T>) => {
    if (s.overlap && isElemQuery(query) && Array.isArray(query.elems)) {
      return s.overlap(query.elems);
    }
    if (s.overlap && isSetQuery(query)) {
      return s.overlap(query.set);
    }
    return f(s.elems)[what];
  };
}

/**
 * helper method to create an overlap function of elements for a given query
 * @param query the query
 * @param what type of overlap
 * @param toElemKey optional key function
 */
export function queryElemOverlap<T>(
  query: UpSetQuery<T>,
  what: keyof SetElemOverlap<T>,
  toElemKey?: (e: T) => string
): (s: ISetLike<T>) => readonly T[] | null {
  if (isCalcQuery(query)) {
    return () => null;
  }
  if (what === 'intersection') {
    const f = setElemIntersectionFactory(isElemQuery(query) ? query.elems : query.set.elems, toElemKey);
    return (s: ISetLike<T>) => f(s.elems);
  }
  const f = setElemOverlapFactory(isElemQuery(query) ? query.elems : query.set.elems, toElemKey);
  return (s: ISetLike<T>) => {
    return f(s.elems)[what];
  };
}
