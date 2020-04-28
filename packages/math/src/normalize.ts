/**
 * @upsetjs/math
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export function denormalize(range: [number, number]) {
  const delta = range[1] - range[0];
  return (v: number) => v * delta + range[0];
}

export default function normalize(domain: [number, number]) {
  const delta = domain[1] - domain[0];
  return (v: number) => (v - domain[0]) / delta;
}
