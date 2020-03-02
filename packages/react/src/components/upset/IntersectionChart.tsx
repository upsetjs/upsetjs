import type { IIntersectionSets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import type { UpSetSelection } from './interfaces';

const IntersectionChart = React.memo(function IntersectionChart<T>({
  intersections,
  scales,
  onClick,
  onMouseEnter,
  onMouseLeave,
  labelStyle,
  color,
}: PropsWithChildren<
  {
    intersections: IIntersectionSets<T>;
    scales: UpSetScales;
    color: string;
    labelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const width = scales.intersections.x.bandwidth();
  const height = scales.intersections.y.range()[0];
  const lStyle: React.CSSProperties = { textAnchor: 'middle', fontSize: 10, ...(labelStyle ?? {}) };
  return (
    <g>
      {intersections.map(d => {
        const y = scales.intersections.y(d.cardinality);
        return (
          <g
            key={d.name}
            transform={`translate(${scales.intersections.x(d.name)}, 0)`}
            onMouseEnter={onMouseEnter(d)}
            onMouseLeave={onMouseLeave(d)}
            onClick={onClick(d)}
          >
            <title>
              {d.name}: {d.cardinality}
            </title>
            <rect y={y} height={height - y} width={width} style={{ fill: color }} />
            <text y={y} dy={-1} x={width / 2} style={lStyle}>
              {d.cardinality}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export default IntersectionChart;
