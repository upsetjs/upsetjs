/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export interface IBaseSet<T = any> {
  /**
   * name of the set
   */
  readonly name: string;
  /**
   * optional set color
   */
  readonly color?: string;
  /**
   * elements in this set
   */
  readonly elems: readonly T[];
  /**
   * number of elements in the set
   */
  readonly cardinality: number;
  /**
   * custom overlap computation function
   * @param o to compare with
   */
  overlap?(o: ISetLike<T> | readonly T[]): number;
}

export interface ISet<T = any> extends IBaseSet<T> {
  /**
   * a fixed set type to separate between sets and set combinations
   */
  readonly type: 'set';
}

export interface IBaseSetCombination<T> extends IBaseSet<T> {
  /**
   * sets this set intersection is composed of
   */
  readonly sets: ReadonlySet<ISet<T>>;
  /**
   * number of set in this set intersection
   */
  readonly degree: number;
}

export interface ISetIntersection<T = any> extends IBaseSetCombination<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'intersection';
}

export interface IDistinctSetIntersection<T = any> extends IBaseSetCombination<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'distinctIntersection';
}

export interface ISetUnion<T = any> extends IBaseSetCombination<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'union';
}

export interface ISetComposite<T = any> extends IBaseSetCombination<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'composite';
}

/**
 * union of all set combination types
 */
export type ISetCombination<T = any> =
  | ISetIntersection<T>
  | ISetUnion<T>
  | ISetComposite<T>
  | IDistinctSetIntersection<T>;

export type SetCombinationType = 'intersection' | 'union' | 'composite' | 'distinctIntersection';
/**
 * union of a set or a set combination
 */
export type ISetLike<T = any> = ISet<T> | ISetCombination<T>;

/**
 * readonly array of sets
 */
export type ISets<T = any> = readonly ISet<T>[];
/**
 * readonly array of set combinations
 */
export type ISetCombinations<T = any> = readonly ISetCombination<T>[];
/**
 * readonly array of set like objects
 */
export type ISetLikes<T = any> = readonly ISetLike<T>[];

/**
 * helper method to generate a key for a given set
 * @param s the set to compute the key for
 */
export function toKey(s: ISetLike<any>) {
  return `${s.name}:${s.type}#${s.cardinality}`;
}
