/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet, ISetCombination, ISetCombinations, ISetLike, ISets, SetCombinationType } from '../model';
import { isSetLike } from '../validators';
import { postprocessCombinations } from './asCombinations';
import { SET_JOINERS } from './constants';
import { GenerateSetCombinationsOptions } from './generateCombinations';

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
  elems: ReadonlyArray<T>
) {
  return {
    type: combo.size === 0 ? 'composite' : type,
    elems,
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
  type: SetCombinationType
) {
  const merged = new Set<ISet<T>>(a.sets);
  b.sets.forEach((s) => merged.add(s));
  const name = generateName(merged, setIndex, SET_JOINERS[type]);

  if (a.cardinality === 0 || b.cardinality === 0) {
    return generateSet(type, name, merged, []);
  }
  let small = a;
  let big = b;
  if (a.cardinality > b.cardinality) {
    small = b;
    big = a;
  }

  const keySet = new Set(lookup.get(small)!);
  const bigLookup: ReadonlySet<B> = lookup.get(big)!;
  const elems = small.elems.filter((e) => {
    const key = toKey(e);
    if (!bigLookup.has(key)) {
      keySet.delete(key);
      return false;
    }
    return true;
  });
  const r = generateSet(type, name, merged, elems);
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
  setIndex: ReadonlyMap<ISet<T>, number>
) {
  const merged = new Set<ISet<T>>(a.sets);
  b.sets.forEach((s) => merged.add(s));
  const name = generateName(merged, setIndex, SET_JOINERS.union);

  if (a.cardinality === 0) {
    const r = generateSet('union', name, merged, b.elems);
    lookup.set(r, new Set(lookup.get(b)!));
    return r;
  }
  if (b.cardinality === 0) {
    const r = generateSet('union', name, merged, a.elems);
    lookup.set(r, new Set(lookup.get(a)!));
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
  const r = generateSet('union', name, merged, elems);
  lookup.set(r, keySet);
  return r;
}

export function generateEmptySet<T, B>(
  type: SetCombinationType,
  notPartOfAnySet: ReadonlyArray<T> | number | undefined,
  allElements: ReadonlyArray<T>,
  lookup: Map<ISetLike<T>, ReadonlySet<B>>,
  toKey: (v: T) => B
): ISetCombination<T> {
  if (typeof notPartOfAnySet === 'number') {
    return {
      type: 'composite',
      elems: [],
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
    return generateSet(type, '()', new Set(), notPartOfAnySet);
  }
  const lookupArr = Array.from(lookup!.values());
  const elems = allElements.filter((e) => {
    const k = toKey(e);
    return lookupArr.every((s) => !s.has(k));
  });
  return generateSet(type, '()', new Set(), elems);
}

/**
 * generate set intersection/unions for a given list of sets
 * @param sets the sets with their elements
 * @param options additional customization options
 */
export default function generateCombinations<T = any>(
  sets: ISets<T>,
  {
    type = 'intersection',
    min = 0,
    max = Infinity,
    empty = false,
    elems: allElements = [],
    notPartOfAnySet,
    toElemKey,
    ...postprocess
  }: GenerateSetCombinationsOptions<T> = {}
): ISetCombinations<T> {
  // const joiner = SET_JOINERS[type] ?? SET_JOINERS.intersection;
  const combinations: ISetCombination<T>[] = [];

  const setIndex = new Map(sets.map((s, i) => [s, i]));
  const setElems = new Map(
    sets.map((s) => [s as ISetLike<T>, toElemKey ? new Set(s.elems.map(toElemKey!)) : new Set(s.elems)])
  );
  const setDirectElems = toElemKey ? null : (setElems as Map<ISetLike<T>, ReadonlySet<T>>);
  const setKeyElems = toElemKey ? (setElems as Map<ISetLike<T>, ReadonlySet<string>>) : null;

  function push(s: ISetCombination<T>) {
    if (s.degree < min || s.degree > max || (s.cardinality === 0 && !empty)) {
      return;
    }
    if (type !== 'distinctIntersection') {
      combinations.push(s);
      return;
    }

    const others = sets.filter((d) => !s.sets.has(d));
    const elems = toElemKey
      ? s.elems.filter((e) => {
          const key = toElemKey(e);
          return others.every((o) => !setKeyElems!.get(o)!.has(key));
        })
      : s.elems.filter((e) => others.every((o) => !setDirectElems!.get(o)!.has(e)));
    if (elems.length === s.cardinality) {
      combinations.push(s);
      return;
    }
    const sDistinct = generateSet(type, s.name, s.sets, elems);

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
        const ab =
          type === 'union'
            ? mergeUnion(a, b, lookup, toKey, setIndex)
            : mergeIntersection(a, b, lookup, toKey, setIndex, type);
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
      push(generateEmptySet(type, notPartOfAnySet, allElements, setKeyElems!, toElemKey));
    } else {
      push(generateEmptySet(type, notPartOfAnySet, allElements, setDirectElems!, (v) => v));
    }
  }

  const degree1 = sets.map((s) => {
    const r = generateSet(type, s.name, new Set([s]), s.elems);
    setElems.set(r, setElems.get(s)!);
    push(r);
    return r;
  });
  if (toElemKey) {
    generateLevel(degree1, 2, setKeyElems!, toElemKey);
  } else {
    generateLevel(degree1, 2, setDirectElems!, (v) => v);
  }
  return postprocessCombinations(sets, combinations, postprocess);
}
