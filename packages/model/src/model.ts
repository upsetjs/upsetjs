/**
 * represents an internal set
 */
export interface ISetBase<T> {
  /**
   * name of the set
   */
  readonly name: string;
  /**
   * elements in this set
   */
  readonly elems: ReadonlyArray<T>;

  readonly cardinality: number;
}

export interface ISet<T> extends ISetBase<T> {
  readonly type: 'set';
}

export interface IIntersectionSet<T> extends ISetBase<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'intersection';
  /**
   * sets this
   */
  readonly sets: ReadonlySet<ISet<T>>;
  readonly degree: number;
}

export declare type ISets<T> = ReadonlyArray<ISet<T>>;
export declare type IIntersectionSets<T> = ReadonlyArray<IIntersectionSet<T>>;
