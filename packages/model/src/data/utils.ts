/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export function byName<T extends { name: string }>(a: T, b: T) {
  return a.name.localeCompare(b.name);
}

export function byCardinality<T extends { cardinality: number }>(a: T, b: T) {
  // decreasing
  return b.cardinality - a.cardinality;
}

export function byDegree<T extends { degree: number }>(a: T, b: T) {
  // increasing
  return a.degree - b.degree;
}

export function byComposite<T>(func: ((a: T, b: T) => number)[]) {
  return (a: T, b: T) => {
    return func.reduce((acc, f) => (acc === 0 ? f(a, b) : acc), 0);
  };
}

export function negate<T>(func: (a: T, b: T) => number) {
  return (a: T, b: T) => -func(a, b);
}

export function byGroup<E, S extends { sets: ReadonlySet<E> }>(sets: readonly E[]) {
  return (a: S, b: S) => {
    const fixNotFound = (v: number) => (v < 0 ? Number.POSITIVE_INFINITY : v);
    const aIndex = fixNotFound(sets.findIndex((s) => a.sets.has(s)));
    const bIndex = fixNotFound(sets.findIndex((s) => b.sets.has(s)));
    return aIndex - bIndex;
  };
}
