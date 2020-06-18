/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export function sameArray<T>(a: readonly T[], b: readonly T[], toKey?: (v: T) => string) {
  if (a.length !== b.length) {
    return false;
  }
  if (toKey) {
    const bs = new Set(b.map(toKey));
    return a.every((ai) => bs.has(toKey(ai)));
  }
  const bs = new Set(b);
  return a.every((ai) => bs.has(ai));
}
