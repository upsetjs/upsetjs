export declare type BandScaleLike = {
  (v: string): number | undefined;
  bandwidth(): number;
};

export interface ITickOptions {
  orientation: 'horizontal' | 'vertical';
  fontSizeHint: number;
}

export declare type NumericScaleLike = {
  (v: number): number | undefined;
  // api to be compatible with d3-scale
  ticks(): ReadonlyArray<{ value: number; label?: string } | number>;
};

export declare type NumericScaleFactory = {
  (max: number, range: [number, number], options: ITickOptions): NumericScaleLike;
};
export declare type BandScaleFactory = {
  (domain: string[], size: number, padding: number): BandScaleLike;
};

export const linearScale: NumericScaleFactory = (max: number, range: [number, number], options: ITickOptions) => {
  const r = range[1] - range[0];
  const d = max;

  const scale = (v: number) => {
    const n = v / d;
    return range[0] + n * r;
  };
  scale.ticks = () => {
    if (options.orientation === 'vertical') {
      return [];
    }
    return [];
  };

  return scale;
};

// TODO
export const logScale: NumericScaleFactory = linearScale;

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
