/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export interface TickOptions {
  orientation: 'horizontal' | 'vertical';
  fontSizeHint: number;
}

export type NumericScaleTick = { value: number; label?: string };

export interface NumericScaleLike {
  (v: number): number;
  // api to be compatible with d3-scale
  ticks(count?: number): readonly (NumericScaleTick | number)[];
  tickFormat(): (v: number) => string;
}

export interface NumericScaleFactory {
  (max: number, range: [number, number], options: TickOptions): NumericScaleLike;
}

function hasOverlap(positions: number[], heights: number[], stride = 1) {
  for (let i = 0; i < positions.length - stride; i += stride) {
    const pos_i = positions[i];
    const pos_n = positions[i + 1];
    if (pos_i < pos_n) {
      const right = pos_i + heights[i] / 2;
      const left = pos_n - heights[i + 1] / 2;
      if (right > left) {
        return true;
      }
    } else {
      const left = pos_i - heights[i] / 2;
      const right = pos_n + heights[i + 1] / 2;
      if (right > left) {
        return true;
      }
    }
  }
  return false;
}

/** @internal */
export function ensureLast(
  ticks: NumericScaleTick[],
  max: number,
  scale: (v: number) => number,
  heightPerTick: (v: number) => number,
  toStr: (v: number) => string
) {
  let last = ticks[ticks.length - 1];
  if (!last.label) {
    for (let j = ticks.length - 2; j > 0; --j) {
      if (ticks[j].label) {
        last = ticks[j];
        break;
      }
    }
  }
  if (last.value < max) {
    // check if we can squeeze it in
    const pos_l = scale(last.value);
    const pos_max = scale(max);
    if (pos_l < pos_max) {
      const right = pos_l + heightPerTick(last.value) / 2;
      const left = pos_max - heightPerTick(max) / 2;
      if (right < left) {
        ticks.push({ value: max, label: toStr(max) });
      }
    } else {
      const left = pos_l - heightPerTick(last.value) / 2;
      const right = pos_max + heightPerTick(max) / 2;
      if (right < left) {
        ticks.push({ value: max, label: toStr(max) });
      }
    }
  }
  return ticks;
}

/** @internal */
export function genTicks(values: number[], toStr: (v: number) => string = String, stride = 1) {
  return values.map((v, i) => ({
    value: v,
    label: stride === 1 || i % stride === 0 ? toStr(v) : undefined,
  }));
}

export function checkValues(
  values: number[],
  scale: (v: number) => number,
  heightPerTick: (v: number) => number,
  max: number,
  toStr: (v: number) => string
) {
  const positions = values.map((v) => scale(v));
  const heights = values.map((v) => heightPerTick(v));

  // check if any overlaps
  if (!hasOverlap(positions, heights)) {
    // we can use all
    return ensureLast(genTicks(values, toStr), max, scale, heightPerTick, toStr);
  }
  if (!hasOverlap(positions, heights, 2)) {
    // every other at least
    return ensureLast(genTicks(values, toStr), max, scale, heightPerTick, toStr);
  }
  return null;
}
