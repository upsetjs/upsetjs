/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export interface BandScaleLike {
  (v: string): number | undefined;
  bandwidth(): number;
}

export interface BandScaleFactory {
  (domain: string[], size: number, padding: number): BandScaleLike;
}

export const bandScale: BandScaleFactory = (domain: string[], size: number, padding: number) => {
  // number of blocks
  const blocks = domain.length + padding;
  const step = size / Math.max(1, blocks);
  const start = size - step * domain.length;
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
