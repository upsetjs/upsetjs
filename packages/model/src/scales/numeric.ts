export declare type TickOptions = {
  orientation: 'horizontal' | 'vertical';
  fontSizeHint: number;
};

export declare type NumericScaleTick = { value: number; label?: string };

export declare type NumericScaleLike = {
  (v: number): number;
  // api to be compatible with d3-scale
  ticks(count?: number): ReadonlyArray<NumericScaleTick | number>;
  tickFormat(): (v: number) => string;
};

export declare type NumericScaleFactory = {
  (max: number, range: [number, number], options: TickOptions): NumericScaleLike;
};

/**
 * @internal
 */
export function hasOverlap(positions: number[], heights: number[], stride = 1) {
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

/**
 * @internal
 */
export function ensureLast(
  ticks: NumericScaleTick[],
  max: number,
  scale: (v: number) => number,
  heightPerTick: (v: number) => number
) {
  const last = ticks[ticks.length - 1];
  if (last.value < max) {
    // check if we can squeeze it in
    const pos_l = scale(last.value);
    const pos_max = scale(max);
    if (pos_l < pos_max) {
      const right = pos_l + heightPerTick(last.value) / 2;
      const left = pos_max - heightPerTick(max) / 2;
      if (right < left) {
        ticks.push({ value: max, label: max.toLocaleString() });
      }
    } else {
      const left = pos_l - heightPerTick(last.value) / 2;
      const right = pos_max + heightPerTick(max) / 2;
      if (right < left) {
        ticks.push({ value: max, label: max.toLocaleString() });
      }
    }
  }
  return ticks;
}
