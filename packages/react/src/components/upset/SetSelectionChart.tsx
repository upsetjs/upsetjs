import { ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetAddons } from '../config';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import { addonPositionGenerator, clsx } from './utils';

function SetSelectionChart<T>({
  data,
  size,
  style,
  elemOverlap,
  suffix,
  secondary,
  tooltip,
  setAddons,
}: PropsWithChildren<{
  data: UpSetDataInfo<T>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  suffix: string;
  elemOverlap: (s: ISet<any>) => number;
  secondary?: boolean;
  tooltip?: string;
  setAddons: UpSetAddons<ISet<T>, T>;
}>) {
  const width = size.sets.w;
  const totalWidth = size.sets.w + size.labels.w + size.combinations.w;
  const height = data.sets.bandWidth;
  const className = clsx(`fill${suffix}`, !tooltip && ` pnone-${style.id}`, style.classNames.bar);
  return (
    <g>
      {data.sets.v.map((d) => {
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const x = data.sets.x(o);
        const y = data.sets.y(d.name)!;
        const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;

        const content = secondary ? (
          <path
            key={d.name}
            transform={`translate(${x}, ${y + height})`}
            d={`M1,0 l0,${-height} l-2,0 l0,${height} L-${data.triangleSize},${data.triangleSize} L${
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
            width={width - x}
            height={height}
            className={className}
            style={style.styles.bar}
          >
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
