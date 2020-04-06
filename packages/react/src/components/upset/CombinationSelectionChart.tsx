import { ISetCombination, ISetCombinations, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { clsx, addonPositionGenerator } from './utils';
import { UpSetAddons } from '../config';

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
  totalHeight,
  combinationAddons,
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
  totalHeight: number;
  combinationAddons: UpSetAddons<ISetCombination<T>, T>;
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
        const content = secondary ? (
          <path
            key={d.name}
            transform={`translate(${x}, ${y})`}
            d={`M0,-1 l${width},0 l0,2 l${-width},0 L-${triangleSize},-${triangleSize} L-${triangleSize},${triangleSize} Z`}
            className={clazz}
          >
            {title}
          </path>
        ) : (
          <rect key={d.name} x={x} y={y} height={height - y} width={width} className={clazz} style={barStyle}>
            {title}
          </rect>
        );

        const genPosition = addonPositionGenerator(totalHeight);
        const addons = combinationAddons
          .map((addon) => {
            const v = genPosition(addon);
            const content = addon.render({ set: d, width, height: addon.size });
            if (!content) {
              return null;
            }
            return (
              <g key={addon.name} transform={`translate(${x},${v})`}>
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

export default CombinationSelectionChart;
