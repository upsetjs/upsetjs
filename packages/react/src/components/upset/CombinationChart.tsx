import { ISetCombinations } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';

const CombinationChart = React.memo(function CombinationChart<T>({
  combinations,
  scales,
  onClick,
  onMouseEnter,
  onMouseLeave,
  labelStyle,
  transform,
}: PropsWithChildren<
  {
    transform: string;
    combinations: ISetCombinations<T>;
    scales: UpSetScales;
    labelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const width = scales.combinations.x.bandwidth();
  const height = scales.combinations.y.range()[0];
  return (
    <g transform={transform}>
      {combinations.map((d) => {
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
            <rect y={y} height={height - y} width={width} className="fillPrimary" />
            <text y={y} dy={-1} x={width / 2} style={labelStyle} className="labelStyle middleText">
              {d.cardinality}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export default CombinationChart;
