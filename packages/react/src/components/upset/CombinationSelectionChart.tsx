import { ISetCombination, ISetCombinations, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';

function CombinationSelectionChart<T>({
  combinations,
  scales,
  elemOverlap,
  color,
  triangleSize,
  secondary,
  tooltip,
}: PropsWithChildren<{
  combinations: ISetCombinations<T>;
  scales: UpSetScales;
  elemOverlap: (s: ISet<any> | ISetCombination<T>) => number;
  color: string;
  triangleSize: number;
  secondary?: boolean;
  tooltip?: string;
}>) {
  const width = scales.combinations.x.bandwidth();
  const height = scales.combinations.y.range()[0];
  const style: React.CSSProperties = { fill: color, pointerEvents: tooltip ? undefined : 'none' };
  return (
    <g>
      {combinations.map(d => {
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const y = scales.combinations.y(o);
        const x = scales.combinations.x(d.name)!;

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

export default CombinationSelectionChart;
