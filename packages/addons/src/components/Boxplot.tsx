import React, { PropsWithChildren } from 'react';
import { UpSetAddon, ISetLike } from '@upsetjs/react';
import { boxplot, IBoxplot, BoxplotStatsOptions, normalize, denormalize } from '@upsetjs/math';

const Boxplot = React.memo(function Boxplot({
  values,
  orient = 'horizonal',
  width,
  height,
  min,
  max,
  ...options
}: PropsWithChildren<{
  values: number[];
  orient?:'horizontal' | 'vertical',
  width: number;
  height: number;
  min: number;
  max: number;
} & BoxplotStatsOptions) {
  const b = boxplot(values, options);
  const n = normalize([min, max]);
  const dn = denormalize([0, orient === 'horizonal' ? width : height]);

  return (
    <g>
      <rect width={width} height={height} x={min} y={max}>
        <title>{values}</title>
      </rect>
    </g>
  );
});

export default Boxplot;

export function boxplotAddon<T>(
  elems: ReadonlyArray<T>,
  prop: keyof T | ((v: T) => number),
  { size = 40, position }: { size?: number; position?: 'before' | 'after' } = {}
): UpSetAddon<ISetLike<T>, T> {
  const acc = typeof prop === 'function' ? prop : (v: T) => (v[prop as keyof T] as unknown) as number;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  elems.forEach((elem) => {
    const v = acc(elem);
    if (v == null || Number.isNaN(v)) {
      return;
    }
    if (v < min) {
      min = v;
    }
    if (v > max) {
      max = v;
    }
  });
  return {
    position,
    size,
    render: ({ width, height, set }) => {
      const values = set.elems.map(acc);
      return <Boxplot values={values} width={width} height={height} min={min} max={max} />;
    },
  };
}
