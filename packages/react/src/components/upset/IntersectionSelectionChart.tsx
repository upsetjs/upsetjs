import type { IIntersectionSet, IIntersectionSets, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import type { UpSetScales } from './generateScales';

function IntersectionSelectionChart<T>({
  intersections,
  scales,
  elemOverlap,
  color,
  triangleSize,
  secondary,
  tooltip,
}: PropsWithChildren<{
  intersections: IIntersectionSets<T>;
  scales: UpSetScales;
  elemOverlap: (s: ISet<any> | IIntersectionSet<T>) => number;
  color: string;
  triangleSize: number;
  secondary?: boolean;
  tooltip?: string;
}>) {
  const width = scales.intersections.x.bandwidth();
  const height = scales.intersections.y.range()[0];
  const style: React.CSSProperties = { fill: color, pointerEvents: tooltip ? undefined : 'none' };
  return (
    <g>
      {intersections.map(d => {
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const y = scales.intersections.y(o);
        const x = scales.intersections.x(d.name)!;

        const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;
        if (secondary) {
          return (
            <polygon
              key={d.name}
              transform={`translate(${x}, ${y})`}
              points={`0,0 -${triangleSize},-${triangleSize} -${triangleSize},${triangleSize}`}
              style={style}
            >
              {title}
            </polygon>
          );
        }
        return (
          <rect key={d.name} x={x} y={y} height={height - y} width={width} style={style}>
            {title}
          </rect>
        );
      })}
    </g>
  );
}

export default IntersectionSelectionChart;
