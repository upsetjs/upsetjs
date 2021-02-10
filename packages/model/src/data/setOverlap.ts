/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike } from '../model';

export interface ISetOverlapFunction<T> {
  (a: ISetLike<T>, b: ISetLike<T>): number;
}

export interface SetOverlap {
  setA: number;
  setB: number;
  union: number;
  intersection: number;
}

export interface SetElemOverlap<T> {
  setA: readonly T[];
  setB: readonly T[];
  union: readonly T[];
  intersection: readonly T[];
}

function len<T>(a: Set<T> | readonly T[]) {
  return a instanceof Set ? a.size : a.length;
}

export function setOverlapFactory<T>(a: Set<T> | readonly T[], toElemKey?: (e: T) => string) {
  const elems = !toElemKey
    ? a instanceof Set
      ? a
      : new Set(a)
    : new Set((a instanceof Set ? Array.from(a) : a).map(toElemKey));
  const setA = elems.size;
  const same: SetOverlap = {
    setA,
    setB: setA,
    union: setA,
    intersection: setA,
  };

  return (b: Set<T> | readonly T[]): SetOverlap => {
    if (b === a) {
      return same;
    }
    let intersection = 0;
    b.forEach((e: T) => {
      if ((toElemKey && (elems as Set<string>).has(toElemKey(e))) || (!toElemKey && (elems as Set<T>).has(e))) {
        intersection++;
      }
    });
    const setB = len(b);
    return {
      setA,
      setB,
      intersection,
      union: setA + setB - intersection,
    };
  };
}

export default function setOverlap<T>(
  a: Set<T> | readonly T[],
  b: Set<T> | readonly T[],
  toElemKey?: (e: T) => string
) {
  if (len(a) < len(b) || a instanceof Set) {
    return setOverlapFactory(a, toElemKey)(b);
  }
  const r = setOverlapFactory(b, toElemKey)(a);
  // swap back
  return Object.assign({}, r, {
    setA: r.setB,
    setB: r.setA,
  });
}

export function setElemOverlapFactory<T>(a: Set<T> | readonly T[], toElemKey?: (e: T) => string) {
  const elems = !toElemKey
    ? a instanceof Set
      ? a
      : new Set(a)
    : new Set((a instanceof Set ? Array.from(a) : a).map(toElemKey));
  const setA: readonly T[] = Array.isArray(a) ? a : Array.from(a);
  const same: SetElemOverlap<T> = {
    setA,
    setB: setA,
    union: setA,
    intersection: setA,
  };

  return (b: Set<T> | readonly T[]): SetElemOverlap<T> => {
    if (b === a) {
      return same;
    }
    const intersection: T[] = [];
    const union: T[] = setA.slice();
    b.forEach((e: T) => {
      if ((toElemKey && (elems as Set<string>).has(toElemKey(e))) || (!toElemKey && (elems as Set<T>).has(e))) {
        intersection.push(e);
      } else {
        union.push(e);
      }
    });
    return {
      setA: setA,
      setB: Array.isArray(b) ? b : Array.from(b),
      intersection,
      union,
    };
  };
}

export function setElemOverlap<T>(a: Set<T> | readonly T[], b: Set<T> | readonly T[], toElemKey?: (e: T) => string) {
  if (len(a) < len(b) || a instanceof Set) {
    return setElemOverlapFactory(a, toElemKey)(b);
  }
  const r = setElemOverlapFactory(b, toElemKey)(a);
  // swap back
  return Object.assign({}, r, {
    setA: r.setB,
    setB: r.setA,
  });
}

export function setElemIntersectionFactory<T>(a: Set<T> | readonly T[], toElemKey?: (e: T) => string) {
  const arr = a instanceof Set ? Array.from(a) : a;
  const elems = !toElemKey ? (a instanceof Set ? a : new Set(a)) : new Set(arr.map(toElemKey));
  return (b: Set<T> | readonly T[]): readonly T[] => {
    if (b === a) {
      return arr;
    }
    const intersection: T[] = [];
    b.forEach((e: T) => {
      if ((toElemKey && (elems as Set<string>).has(toElemKey(e))) || (!toElemKey && (elems as Set<T>).has(e))) {
        intersection.push(e);
      }
    });
    return intersection;
  };
}
