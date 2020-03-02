import type { ISetCombinations } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import type { UpSetSelection } from './interfaces';

const CombinationChart = React.memo(function CombinationChart<T>({
  combinations,
  scales,
  onClick,
  onMouseEnter,
  onMouseLeave,
  labelStyle,
  color,
}: PropsWithChildren<
  {
    combinations: ISetCombinations<T>;
    scales: UpSetScales;
    color: string;
    labelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const width = scales.combinations.x.bandwidth();
  const height = scales.combinations.y.range()[0];
  const lStyle: React.CSSProperties = { textAnchor: 'middle', fontSize: 10, ...(labelStyle ?? {}) };
  return (
    <g>
      {combinations.map(d => {
        const y = scales.combinations.y(d.cardinality);
        return (
          <g
            key={d.name}
            transform={`translate(${scales.combinations.x(d.name)}, 0)`}
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

export default CombinationChart;
