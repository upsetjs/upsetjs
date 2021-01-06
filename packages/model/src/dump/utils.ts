/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export function withColor<T>(v: T, s: { color?: string }): T & { color?: string } {
  if (s.color) {
    (v as T & { color?: string }).color = s.color;
  }
  return v;
}
