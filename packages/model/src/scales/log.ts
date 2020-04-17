import { NumericScaleFactory, NumericScaleTick, ensureLast, hasOverlap, TickOptions } from './numeric';

export function niceFactors(max: number, maxCount: number = 11) {
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

function range(max: number, factor: number) {
  const values: number[] = [];
  let inc = factor;
  for (let v = 0, i = 0; v <= max; v += inc, inc *= 10) {
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
  for (const factor of factors) {
    const values = range(max, factor);
    const positions = values.map((v) => scale(v));
    const heights = values.map((v) => heightPerTick(v));

    // check if any overlaps
    if (!hasOverlap(positions, heights)) {
      // we can use all
      return ensureLast(genTicks(max, factor), max, scale, heightPerTick);
    }
    if (!hasOverlap(positions, heights, 2)) {
      // every other at least
      return ensureLast(genTicks(max, factor, 2), max, scale, heightPerTick);
    }
  }
  // first and last only
  return genTicks(max, max);
}

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
      return distributeTicks(max, count + 1, scale, () => heightPerTick);
    }
    const widthPerChar = options.fontSizeHint / 1.4;
    return distributeTicks(max, count + 1, scale, (v) => Math.ceil(v.toLocaleString().length * widthPerChar));
  };

  return scale;
};
