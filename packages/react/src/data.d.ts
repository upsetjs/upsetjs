/**
 * represents an internal set
 */
export interface ISetBase<T> {
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
export declare function extractSets<T extends {
    sets: string[];
}>(elements: ReadonlyArray<T>): ISets<T>;
export declare function generateSetIntersections<T>(sets: ISets<T>, { min, max, empty }?: {
    min?: number | undefined;
    max?: number | undefined;
    empty?: boolean | undefined;
}): IIntersectionSets<T>;
export declare function asSets<T, S extends {
    name: string;
    elems: ReadonlyArray<T>;
}>(sets: ReadonlyArray<S>): (S & ISet<T>)[];
