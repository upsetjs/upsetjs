export declare type BandScaleLike = {
  (v: string): number | undefined;
  bandwidth(): number;
};

export declare type TickOptions = {
  orientation: 'horizontal' | 'vertical';
  fontSizeHint: number;
};

export declare type NumericScaleTick = { value: number; label?: string };

export declare type NumericScaleLike = {
  (v: number): number;
  // api to be compatible with d3-scale
  ticks(count?: number): ReadonlyArray<NumericScaleTick | number>;
};

export declare type NumericScaleFactory = {
  (max: number, range: [number, number], options: TickOptions): NumericScaleLike;
};
export declare type BandScaleFactory = {
  (domain: string[], size: number, padding: number): BandScaleLike;
};

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

export function niceLogFactors(max: number, maxCount: number = 11) {
  // TODO
  const digits = Math.max(0, Math.floor(Math.log10(max) - 0.5));
  const factor = Math.pow(10, digits);
  const factors = [2, 5, 10];

  const r = factors.map((f) => f * factor);
  if (digits > 0) {
    r.unshift(factors[factors.length - 1] * Math.pow(10, digits - 1));
  }
  r.push(factors[0] * Math.pow(10, digits + 1));
  const lower = Math.max(2, Math.ceil(max / maxCount));
  return r.filter((d) => d >= lower && d <= max);
}

function range(max: number, inc: number, logScale = false) {
  const values: number[] = [];
  for (let v = 0; v <= max; logScale ? (v *= inc) : (v += inc)) {
    values.push(v);
  }
  return values;
}

/** @internal */
export function genTicks(max: number, inc: number, stride = 1) {
  const r: NumericScaleTick[] = [];
  for (let v = 0, i = 0; v <= max; v += inc, i++) {
    const tick: NumericScaleTick = { value: v };
    if (stride === 1 || i % stride === 0) {
      tick.label = v.toLocaleString();
    }
    r.push(tick);
  }
  return r;
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

function distributeTicks(
  max: number,
  maxCount: number,
  scale: (v: number) => number,
  heightPerTick: (v: number) => number,
  logScale = false
): NumericScaleTick[] {
  if (maxCount <= 0) {
    return [];
  }
  const factors = logScale ? niceLogFactors(max, maxCount) : niceFactors(max, maxCount);

  const ensureLast = (ticks: NumericScaleTick[]) => {
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
  };
  // try out all factors
  for (const factor of factors) {
    const values = range(max, factor, logScale);
    const positions = values.map((v) => scale(v));
    const heights = values.map((v) => heightPerTick(v));

    // check if any overlaps
    if (!hasOverlap(positions, heights)) {
      // we can use all
      return ensureLast(genTicks(max, factor));
    }
    if (!hasOverlap(positions, heights, 2)) {
      // every other at least
      return ensureLast(genTicks(max, factor, 2));
    }
  }
  // first and last only
  return genTicks(max, max);
}

export const linearScale: NumericScaleFactory = (max: number, range: [number, number], options: TickOptions) => {
  const size = range[1] - range[0];
  const domain = max;

  const scale = (v: number) => {
    const n = v / domain;
    return range[0] + n * size;
  };
  scale.ticks = (count = 10) => {
    if (options.orientation === 'vertical') {
      const heightPerTick = Math.ceil(options.fontSizeHint * 1.4);
      return distributeTicks(max, count + 1, scale, () => heightPerTick);
    }
    const widthPerChar = options.fontSizeHint / 1.4;
    return distributeTicks(max, count + 1, scale, (v) => Math.ceil(v.toLocaleString().length * widthPerChar));
  };

  return scale;
};

export const logScale: NumericScaleFactory = (max: number, range: [number, number], options: TickOptions) => {
  const size = range[1] - range[0];
  const domain = max < 1 ? 1 : Math.log(max);

  const scale = (v: number) => {
    const n = v <= 1 ? 0 : Math.log(v) / domain;
    return range[0] + n * size;
  };
  scale.ticks = (count = 10) => {
    if (options.orientation === 'vertical') {
      const heightPerTick = Math.ceil(options.fontSizeHint * 1.4);
      return distributeTicks(max, count + 1, scale, () => heightPerTick, true);
    }
    const widthPerChar = options.fontSizeHint / 1.4;
    return distributeTicks(max, count + 1, scale, (v) => Math.ceil(v.toLocaleString().length * widthPerChar), true);
  };

  return scale;
};

export const bandScale: BandScaleFactory = (domain: string[], size: number, padding: number) => {
  const r = size;
  // number of blocks
  const blocks = domain.length * (1 + padding) + padding;
  const step = r / Math.max(1, blocks);
  const start = r - step * domain.length * (1 + padding);
  const lookup = new Map(domain.map((d, i) => [d, i]));
  const bandwidth = step / (1 + padding);

  const scale = (v: string) => {
    const index = lookup.get(v);
    if (index == null) {
      return undefined;
    }
    return start + step * index;
  };
  scale.bandwidth = () => bandwidth;

  return scale;
};
