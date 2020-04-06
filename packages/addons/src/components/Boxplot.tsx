import React, { PropsWithChildren } from 'react';
import { UpSetAddon, ISetLike } from '@upsetjs/react';

const Boxplot = React.memo(function Boxplot({
  values,
  width,
  height,
}: PropsWithChildren<{
  values: number[];
  width: number;
  height: number;
}>) {
  // TODO
  return (
    <g>
      <rect width={width} height={height}>
        <title>{values}</title>
      </rect>
    </g>
  );
});

export default Boxplot;

export function boxplotAddon<T>(
  prop: keyof T | ((v: T) => number),
  { size = 40, position }: { size?: number; position?: 'before' | 'after' } = {}
): UpSetAddon<ISetLike<T>, T> {
  return {
    position,
    size,
    render: ({ width, height, set }) => {
      const values = set.elems.map(
        typeof prop === 'function' ? prop : (v) => (v[prop as keyof T] as unknown) as number
      );
      return <Boxplot values={values} width={width} height={height} />;
    },
  };
}
