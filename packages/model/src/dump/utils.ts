/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

export function withColor<T>(v: T, s: { color?: string }): T & { color?: string } {
  if (s.color) {
    (v as T & { color?: string }).color = s.color;
  }
  return v as T & { color?: string };
}
