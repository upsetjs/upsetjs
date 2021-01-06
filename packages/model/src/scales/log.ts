/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { NumericScaleFactory, NumericScaleTick, genTicks, TickOptions, checkValues, ensureLast } from './numeric';

/** @internal */
export function toStr(v: number) {
  const orders = ['', 'k', 'M', 'G'];
  const order = Math.max(0, Math.min(Math.floor(Math.log10(v) / 3), orders.length - 1));

  const vi = Math.round(v / Math.pow(10, order * 3 - 1)) / 10;
  return `${vi.toLocaleString()}${orders[order]}`;
}

/** @internal */
export function range(max: number, factor: number) {
  const values: number[] = [];
  const inc = Math.pow(10, factor);
  for (let v = 1; v <= max; v *= inc) {
    values.push(v);
  }
  return values;
}

function generateInnerTicks(max: number, factor: number) {
  const values: NumericScaleTick[] = [];
  const inc = 10;
  for (let v = 1, i = 0; v <= max; v *= inc, i++) {
    values.push({
      value: v,
      label: factor === 1 || i % factor === 0 ? toStr(v) : undefined,
    });
    for (let vv = v + v; vv < v * inc && vv < max; vv += v * factor) {
      values.push({ value: vv });
    }
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

  for (const factor of [1, 2, 5]) {
    const values = range(max, factor);
    const r = checkValues(values, scale, heightPerTick, max, toStr);
    if (r) {
      // generate new but with hidden ticks
      return ensureLast(generateInnerTicks(max, factor), max, scale, heightPerTick, toStr);
    }
  }
  return genTicks([0, max], toStr);
}

export const logScale: NumericScaleFactory = (max: number, range: [number, number], options: TickOptions) => {
  const size = range[1] - range[0];
  const domain = max < 1 ? 1 : Math.log10(max);

  const scale = (v: number) => {
    const cv = Math.max(0, Math.min(v, domain));
    const n = cv <= 1 ? 0 : Math.log10(cv) / domain;
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
