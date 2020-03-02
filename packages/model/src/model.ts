/**
 * represents an internal set
 */
export interface IBaseSet<T> {
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

export interface ISet<T> extends IBaseSet<T> {
  readonly type: 'set';
}

export interface ISetIntersection<T> extends IBaseSet<T> {
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

export interface ISetUnion<T> extends IBaseSet<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'union';
  /**
   * sets this
   */
  readonly sets: ReadonlySet<ISet<T>>;
  readonly degree: number;
}

export interface ISetComposite<T> extends IBaseSet<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'composite';
  /**
   * sets this
   */
  readonly sets: ReadonlySet<ISetLike<T>>;
  readonly degree: number;
}

export declare type ISetCombination<T> = ISetIntersection<T> | ISetUnion<T> | ISetComposite<T>;
export declare type ISetLike<T> = ISet<T> | ISetCombination<T>;

export declare type ISets<T> = ReadonlyArray<ISet<T>>;
export declare type ISetCombinations<T> = ReadonlyArray<ISetCombination<T>>;
export declare type ISetLikes<T> = ReadonlyArray<ISetLike<T>>;
