import { ISet, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { clsx } from './utils';

function SetSelectionChart<T>({
  sets,
  scales,
  elemOverlap,
  suffix,
  triangleSize,
  secondary,
  tooltip,
  barClassName,
  barStyle,
}: PropsWithChildren<{
  sets: ISets<T>;
  scales: UpSetScales;
  suffix: string;
  elemOverlap: (s: ISet<any>) => number;
  triangleSize: number;
  secondary?: boolean;
  tooltip?: string;
  barClassName?: string;
  barStyle?: React.CSSProperties;
}>) {
  const width = scales.sets.x.range()[0];
  const height = scales.sets.y.bandwidth();
  const clazz = clsx(`fill${suffix}`, !tooltip && ' pnone', barClassName);
  return (
    <g>
      {sets.map((d) => {
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const x = scales.sets.x(o);
        const y = scales.sets.y(d.name)!;
        const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;
        if (secondary) {
          return (
            <path
              key={d.name}
              transform={`translate(${x}, ${y + height})`}
              d={`M1,0 l0,${-height} l-2,0 l0,${height} L-${triangleSize},${triangleSize} L${triangleSize},${triangleSize} Z`}
              className={clazz}
            >
              {title}
            </path>
          );
        }
        return (
          <rect key={d.name} x={x} y={y} width={width - x} height={height} className={clazz} style={barStyle}>
            {title}
          </rect>
        );
      })}
    </g>
  );
}

export default SetSelectionChart;
