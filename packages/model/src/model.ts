/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export interface IBaseSet<T = any> {
  /**
   * name of the set
   */
  readonly name: string;
  /**
   * elements in this set
   */
  readonly elems: ReadonlyArray<T>;
  /**
   * number of elements in the set
   */
  readonly cardinality: number;
  /**
   * custom overlap computation function
   * @param o to compare with
   */
  overlap?(o: ISetLike<T> | ReadonlyArray<T>): number;
}

export interface ISet<T = any> extends IBaseSet<T> {
  /**
   * a fixed set type to separate between sets and set combinations
   */
  readonly type: 'set';
}

export interface ISetIntersection<T = any> extends IBaseSet<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'intersection';
  /**
   * sets this set intersection is composed of
   */
  readonly sets: ReadonlySet<ISet<T>>;
  /**
   * number of set in this set intersection
   */
  readonly degree: number;
}

export interface ISetUnion<T = any> extends IBaseSet<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'union';
  /**
   * sets this set intersection is composed of
   */
  readonly sets: ReadonlySet<ISet<T>>;
  /**
   * number of set in this set intersection
   */
  readonly degree: number;
}

export interface ISetComposite<T = any> extends IBaseSet<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'composite';
  /**
   * sets this set intersection is composed of
   */
  readonly sets: ReadonlySet<ISet<T>>;
  /**
   * number of set in this set intersection
   */
  readonly degree: number;
}

/**
 * union of all set combination types
 */
export declare type ISetCombination<T = any> = ISetIntersection<T> | ISetUnion<T> | ISetComposite<T>;
/**
 * union of a set or a set combination
 */
export declare type ISetLike<T = any> = ISet<T> | ISetCombination<T>;

/**
 * readonly array of sets
 */
export declare type ISets<T = any> = ReadonlyArray<ISet<T>>;
/**
 * readonly array of set combinations
 */
export declare type ISetCombinations<T = any> = ReadonlyArray<ISetCombination<T>>;
/**
 * readonly array of set like objects
 */
export declare type ISetLikes<T = any> = ReadonlyArray<ISetLike<T>>;

/**
 * helper method to generate a key for a given set
 * @param s the set to compute the key for
 */
export function toKey(s: ISetLike<any>) {
  return `${s.name}:${s.type}#${s.cardinality}`;
}
