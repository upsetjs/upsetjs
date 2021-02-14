/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetCombination, ISetCombinations, ISets, ISet, SetCombinationType, ISetLike } from '../model';
import { isSetLike } from '../validators';
import { postprocessCombinations, PostprocessCombinationsOptions } from './asCombinations';
import { SET_JOINERS } from './constants';
import { mergeColors as mergeDefaultColors } from '../colors';

export interface GenerateSetCombinationsOptions<T = any> extends PostprocessCombinationsOptions {
  /**
   * type of set combination
   * @default intersection
   */
  type?: SetCombinationType;
  /**
   * minimum number of intersecting sets
   * @default 0
   */
  min?: number;
  /**
   * maximum number of intersecting sets
   * @default Infinity
   */
  max?: number;
  /**
   * include empty intersections
   * @default false
   */
  empty?: boolean;
  /**
   * list of all elements used to compute the elements which aren't part of any given set
   */
  elems?: readonly T[];
  /**
   * alternative to `.elems` by directly specifying the elements that are not part of any set
   * just makes sense with min=0
   */
  notPartOfAnySet?: readonly T[] | number;
  /**
   * optional elem key function
   * @param v
   */
  toElemKey?(v: T): string;

  /**
   * optional color merger
   **/
  mergeColors?: (colors: readonly (string | undefined)[]) => string | undefined;
}

/**
 * @internal
 */
export function generateName<T>(combo: ReadonlySet<ISet<T>>, setIndex: ReadonlyMap<ISet<T>, number>, joiner: string) {
  const sorted = Array.from(combo).sort((a, b) => setIndex.get(a)! - setIndex.get(b)!);
  return sorted.length === 1 ? sorted[0].name : `(${sorted.map((d) => d.name).join(joiner)})`;
}

/**
 * @internal
 */
export function generateSet<T>(
  type: SetCombinationType,
  name: string,
  combo: ReadonlySet<ISet<T>>,
  elems: readonly T[],
  mergeColors: (colors: readonly (string | undefined)[]) => string | undefined
) {
  return {
    type: combo.size === 0 ? 'composite' : type,
    elems,
    color: mergeColors(Array.from(combo).map((s) => s.color)),
    sets: combo,
    name,
    cardinality: elems.length,
    degree: combo.size,
  };
}

/**
 * @internal
 */
export function mergeIntersection<T, B>(
  a: ISetCombination<T>,
  b: ISetCombination<T>,
  lookup: Map<ISetLike<T>, ReadonlySet<B>>,
  toKey: (v: T) => B,
  setIndex: ReadonlyMap<ISet<T>, number>,
  type: SetCombinationType,
  mergeColors: (colors: readonly (string | undefined)[]) => string | undefined
) {
  const merged = new Set<ISet<T>>(a.sets);
  b.sets.forEach((s) => merged.add(s));
  const name = generateName(merged, setIndex, SET_JOINERS[type]);

  if (a.cardinality === 0 || b.cardinality === 0) {
    return generateSet(type, name, merged, [], mergeColors);
  }
  let small = a;
  let big = b;
  if (a.cardinality > b.cardinality) {
    small = b;
    big = a;
  }

  const keySet = new Set<B>();
  const bigLookup: ReadonlySet<B> = lookup.get(big)!;
  const elems: T[] = [];
  const l = small.elems.length;
  for (let i = 0; i < l; i++) {
    const e = small.elems[i];
    const key = toKey(e);
    if (!bigLookup.has(key)) {
      continue;
    }
    keySet.add(key);
    elems.push(e);
  }
  const r = generateSet(type, name, merged, elems, mergeColors);
  lookup.set(r, keySet);
  return r;
}

/**
 * @internal
 */
export function mergeUnion<T, B>(
  a: ISetCombination<T>,
  b: ISetCombination<T>,
  lookup: Map<ISetLike<T>, ReadonlySet<B>>,
  toKey: (v: T) => B,
  setIndex: ReadonlyMap<ISet<T>, number>,
  type: SetCombinationType,
  mergeColors: (colors: readonly (string | undefined)[]) => string | undefined
) {
  const merged = new Set<ISet<T>>(a.sets);
  b.sets.forEach((s) => merged.add(s));
  const name = generateName(merged, setIndex, SET_JOINERS[type]);

  if (a.cardinality === 0) {
    const r = generateSet(type, name, merged, b.elems, mergeColors);
    lookup.set(r, lookup.get(b)!);
    return r;
  }
  if (b.cardinality === 0) {
    const r = generateSet(type, name, merged, a.elems, mergeColors);
    lookup.set(r, lookup.get(a)!);
    return r;
  }

  let small = a;
  let big = b;
  if (a.cardinality > b.cardinality) {
    small = b;
    big = a;
  }

  const keySet = new Set(lookup.get(big)!);
  const bigLookup: ReadonlySet<B> = lookup.get(big)!;
  const elems = big.elems.slice();
  small.elems.forEach((e) => {
    const key = toKey(e);
    if (bigLookup.has(key)) {
      return;
    }
    keySet.add(key);
    elems.push(e);
  });
  const r = generateSet(type, name, merged, elems, mergeColors);
  lookup.set(r, keySet);
  return r;
}

export function generateEmptySet<T, B>(
  type: SetCombinationType,
  notPartOfAnySet: readonly T[] | number | undefined,
  allElements: readonly T[],
  lookup: Map<ISetLike<T>, ReadonlySet<B>>,
  toKey: (v: T) => B,
  mergeColors: (colors: readonly (string | undefined)[]) => string | undefined
): ISetCombination<T> {
  if (typeof notPartOfAnySet === 'number') {
    return {
      type: 'composite',
      elems: [],
      color: mergeColors ? mergeColors([]) : undefined,
      sets: new Set(),
      name: '()',
      cardinality: notPartOfAnySet,
      overlap(s) {
        return s === this || (isSetLike(s) && s.name === this.name && s.cardinality === this.cardinality)
          ? this.cardinality
          : 0;
      },
      degree: 0,
    };
  }
  if (Array.isArray(notPartOfAnySet)) {
    return generateSet(type, '()', new Set(), notPartOfAnySet, mergeColors);
  }
  const lookupArr = Array.from(lookup!.values());
  const elems = allElements.filter((e) => {
    const k = toKey(e);
    return lookupArr.every((s) => !s.has(k));
  });
  return generateSet(type, '()', new Set(), elems, mergeColors);
}
/**
 * generate set intersection/unions for a given list of sets
 * @param sets the sets with their elements
 * @param options additional customization options
 */
export default function generateCombinations<T = any>(
  sets: ISets<T>,
  options: GenerateSetCombinationsOptions<T> = {}
): ISetCombinations<T> {
  const {
    type = 'intersection',
    min = 0,
    max = Infinity,
    empty = false,
    elems: allElements = [],
    notPartOfAnySet,
    toElemKey,
    mergeColors = mergeDefaultColors,
  } = options;
  // const joiner = SET_JOINERS[type] ?? SET_JOINERS.intersection;
  const combinations: ISetCombination<T>[] = [];

  const setIndex = new Map(sets.map((s, i) => [s, i]));
  const setElems = new Map(
    sets.map((s) => [s as ISetLike<T>, toElemKey ? new Set(s.elems.map(toElemKey!)) : new Set(s.elems)])
  );
  const setDirectElems = toElemKey ? null : (setElems as Map<ISetLike<T>, ReadonlySet<T>>);
  const setKeyElems = toElemKey ? (setElems as Map<ISetLike<T>, ReadonlySet<string>>) : null;

  const calc = type === 'union' ? mergeUnion : mergeIntersection;

  function push(s: ISetCombination<T>) {
    if (s.degree < min || s.degree > max || (s.cardinality === 0 && !empty)) {
      return;
    }
    if (type !== 'distinctIntersection') {
      combinations.push(s);
      return;
    }

    // need to filter out common elements in other sets
    const others = sets.filter((d) => !s.sets.has(d));
    let elems: T[] = [];
    if (toElemKey) {
      const othersSets = others.map((o) => setKeyElems!.get(o)!);
      elems = s.elems.filter((e) => {
        const key = toElemKey(e);
        return othersSets.every((o) => !o.has(key));
      });
    } else {
      const othersSets = others.map((o) => setDirectElems!.get(o)!);
      elems = s.elems.filter((e) => othersSets.every((o) => !o.has(e)));
    }

    if (elems.length === s.cardinality) {
      combinations.push(s);
      return;
    }
    const sDistinct = generateSet(type, s.name, s.sets, elems, mergeColors);

    if (sDistinct.cardinality === 0 && !empty) {
      return;
    }
    combinations.push(sDistinct);
  }

  function generateLevel<B>(
    arr: ISetCombinations<T>,
    degree: number,
    lookup: Map<ISetLike<T>, ReadonlySet<B>>,
    toKey: (v: T) => B
  ) {
    if (degree > max) {
      return;
    }
    const l = arr.length;
    for (let i = 0; i < l; i++) {
      const a = arr[i];
      const sub: ISetCombination<T>[] = [];
      for (let j = i + 1; j < l; j++) {
        const b = arr[j];
        const ab = calc(a, b, lookup, toKey, setIndex, type, mergeColors);
        push(ab);
        if (type === 'union' || ab.cardinality > 0 || empty) {
          sub.push(ab);
        }
      }
      if (sub.length > 1) {
        generateLevel(sub, degree + 1, lookup, toKey);
      }
    }
  }

  if (min <= 0) {
    if (toElemKey) {
      push(generateEmptySet(type, notPartOfAnySet, allElements, setKeyElems!, toElemKey, mergeColors));
    } else {
      push(generateEmptySet(type, notPartOfAnySet, allElements, setDirectElems!, (v) => v, mergeColors));
    }
  }

  const degree1 = sets.map((s) => {
    const r = generateSet(type, s.name, new Set([s]), s.elems, mergeColors);
    setElems.set(r, setElems.get(s)!);
    push(r);
    return r;
  });
  if (toElemKey) {
    generateLevel(degree1, 2, setKeyElems!, toElemKey);
  } else {
    generateLevel(degree1, 2, setDirectElems!, (v) => v);
  }
  return postprocessCombinations(sets, combinations, options);
}
