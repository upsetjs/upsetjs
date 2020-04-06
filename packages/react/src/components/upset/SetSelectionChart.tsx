import { ISet, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { clsx, addonPositionGenerator } from './utils';
import { UpSetAddons } from '../config';

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
  totalWidth,
  setAddons,
}: PropsWithChildren<{
  sets: ISets<T>;
  totalWidth: number;
  scales: UpSetScales;
  suffix: string;
  elemOverlap: (s: ISet<any>) => number;
  triangleSize: number;
  secondary?: boolean;
  tooltip?: string;
  barClassName?: string;
  barStyle?: React.CSSProperties;
  setAddons: UpSetAddons<ISet<T>, T>;
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

        const content = secondary ? (
          <path
            key={d.name}
            transform={`translate(${x}, ${y + height})`}
            d={`M1,0 l0,${-height} l-2,0 l0,${height} L-${triangleSize},${triangleSize} L${triangleSize},${triangleSize} Z`}
            className={clazz}
          >
            {title}
          </path>
        ) : (
          <rect key={d.name} x={x} y={y} width={width - x} height={height} className={clazz} style={barStyle}>
            {title}
          </rect>
        );

        const genPosition = addonPositionGenerator(totalWidth);
        const addons = setAddons
          .map((addon) => {
            const v = genPosition(addon);
            const content = addon.render({ set: d, width: addon.size, height });
            if (!content) {
              return null;
            }
            return (
              <g key={addon.name} transform={`translate(${v},${y})`}>
                {content}
              </g>
            );
          })
          .filter(Boolean);

        if (addons.length === 0) {
          return content;
        }
        return (
          <g key={d.name}>
            {content}
            {addons}
          </g>
        );
      })}
    </g>
  );
}

export default SetSelectionChart;
