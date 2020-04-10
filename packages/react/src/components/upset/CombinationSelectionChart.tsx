import { ISet, ISetCombination } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetAddons } from '../config';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import { addonPositionGenerator, clsx } from './utils';

function CombinationSelectionChart<T>({
  data,
  size,
  style,
  elemOverlap,
  secondary,
  tooltip,
  suffix,
  combinationAddons,
}: PropsWithChildren<{
  data: UpSetDataInfo<T>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  suffix: string;
  elemOverlap: (s: ISet<any> | ISetCombination<T>) => number;
  secondary?: boolean;
  tooltip?: string;
  combinationAddons: UpSetAddons<ISetCombination<T>, T>;
}>) {
  const width = data.combinations.bandWidth;
  const totalHeight = size.combinations.h + size.sets.h;
  const height = size.combinations.h;
  const className = clsx(`fill${suffix}`, !tooltip && `pnone-${style.id}`, style.classNames.bar);
  return (
    <g>
      {data.combinations.v.map((d) => {
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const y = data.combinations.y(o);
        const x = data.combinations.x(d.name)!;

        const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;
        const content = secondary ? (
          <path
            key={d.name}
            transform={`translate(${x}, ${y})`}
            d={`M0,-1 l${width},0 l0,2 l${-width},0 L-${data.triangleSize},-${data.triangleSize} L-${
              data.triangleSize
            },${data.triangleSize} Z`}
            className={className}
          >
            {title}
          </path>
        ) : (
          <rect
            key={d.name}
            x={x}
            y={y}
            height={height - y}
            width={width}
            className={className}
            style={style.styles.bar}
          >
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
