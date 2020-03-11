import { ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';

const SetChart = React.memo(function SetChart<T>({
  sets,
  scales,
  onMouseEnter,
  onMouseLeave,
  onClick,
  color,
  labelStyle,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
    color: string;
    labelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const width = scales.sets.x.range()[0];
  const height = scales.sets.y.bandwidth();
  const lStyle: React.CSSProperties = {
    textAnchor: 'end',
    dominantBaseline: 'central',
    fontSize: 10,
    ...(labelStyle ?? {}),
  };
  return (
    <g>
      {sets.map(d => {
        const x = scales.sets.x(d.cardinality);
        return (
          <g
            key={d.name}
            transform={`translate(0, ${scales.sets.y(d.name)})`}
            onMouseEnter={onMouseEnter(d)}
            onMouseLeave={onMouseLeave(d)}
            onClick={onClick(d)}
          >
            <title>
              {d.name}: {d.cardinality}
            </title>
            <rect x={x} width={width - x} height={height} style={{ fill: color }} />
            <text x={x} dx={-1} y={height / 2} style={lStyle}>
              {d.cardinality}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export default SetChart;
