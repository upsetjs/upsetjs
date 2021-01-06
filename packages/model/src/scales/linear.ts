/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { NumericScaleFactory, NumericScaleTick, TickOptions, genTicks, checkValues } from './numeric';

function toStr(v: number) {
  return v.toLocaleString();
}
/**
 * @internal
 */
export function niceFactors(max: number, maxCount: number = 11) {
  const digits = Math.max(0, Math.floor(Math.log10(max) - 0.5));
  const factor = Math.pow(10, digits);
  const factors = [1, 2, 5];

  const r = factors.map((f) => f * factor);
  if (digits > 0) {
    r.unshift(factors[factors.length - 1] * Math.pow(10, digits - 1));
  }
  r.push(factors[0] * Math.pow(10, digits + 1));
  const lower = Math.ceil(max / maxCount);
  return r.filter((d) => d >= lower && d <= max);
}

/** @internal */
export function range(max: number, inc = 1) {
  const values: number[] = [];
  for (let v = 0; v <= max; v += inc) {
    values.push(v);
  }
  return values;
}

function distributeTicks(
  max: number,
  maxCount: number,
  scale: (v: number) => number,
  heightPerTick: (v: number) => number
): NumericScaleTick[] {
  if (maxCount <= 0) {
    return [];
  }
  const factors = niceFactors(max, maxCount);

  // try out all factors
  for (let i = 0; i < factors.length; i++) {
    const values = range(max, factors[i]);
    const r = checkValues(values, scale, heightPerTick, max, toStr);
    if (r) {
      return r;
    }
  }
  // first and last only
  return genTicks([0, max], toStr);
}

export const linearScale: NumericScaleFactory = (max: number, range: [number, number], options: TickOptions) => {
  const size = range[1] - range[0];
  const domain = max;

  const scale = (v: number) => {
    const cv = Math.max(0, Math.min(v, domain));
    const n = cv / domain;
    return range[0] + n * size;
  };
  scale.ticks = (count = 10) => {
    if (options.orientation === 'vertical') {
      const heightPerTick = Math.ceil(options.fontSizeHint * 1.4);
      return distributeTicks(max, count + 1, scale, () => heightPerTick);
    }
    const widthPerChar = options.fontSizeHint / 1.4;
    return distributeTicks(max, count + 1, scale, (v) => Math.ceil(toStr(v).length * widthPerChar));
  };
  scale.tickFormat = () => toStr;

  return scale;
};
