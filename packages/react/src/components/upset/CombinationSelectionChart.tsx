import { ISetCombination, ISetCombinations, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { clsx } from './utils';

function CombinationSelectionChart<T>({
  combinations,
  scales,
  elemOverlap,
  triangleSize,
  secondary,
  tooltip,
  suffix,
  barClassName,
  barStyle,
}: PropsWithChildren<{
  combinations: ISetCombinations<T>;
  scales: UpSetScales;
  suffix: string;
  elemOverlap: (s: ISet<any> | ISetCombination<T>) => number;
  triangleSize: number;
  secondary?: boolean;
  tooltip?: string;
  barClassName?: string;
  barStyle?: React.CSSProperties;
}>) {
  const width = scales.combinations.x.bandwidth();
  const height = scales.combinations.y.range()[0];
  const clazz = clsx(`fill${suffix}`, !tooltip && 'pnone', barClassName);
  return (
    <g>
      {combinations.map((d) => {
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const y = scales.combinations.y(o);
        const x = scales.combinations.x(d.name)!;

        const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;
        if (secondary) {
          return (
            <path
              key={d.name}
              transform={`translate(${x}, ${y})`}
              d={`M0,-1 l${width},0 l0,2 l${-width},0 L-${triangleSize},-${triangleSize} L-${triangleSize},${triangleSize} Z`}
              className={clazz}
            >
              {title}
            </path>
          );
        }
        return (
          <rect key={d.name} x={x} y={y} height={height - y} width={width} className={clazz} style={barStyle}>
            {title}
          </rect>
        );
      })}
    </g>
  );
}

export default CombinationSelectionChart;
