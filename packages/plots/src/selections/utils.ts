/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export function sameArray<T>(a: ReadonlyArray<T>, b: ReadonlyArray<T>) {
  if (a.length !== b.length) {
    return false;
  }
  const bs = new Set(b);
  return a.every((ai) => bs.has(ai));
}
