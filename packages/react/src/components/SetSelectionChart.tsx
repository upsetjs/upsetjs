/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetAddons } from '../interfaces';
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
  empty,
  tooltip,
  setAddons,
  transform,
}: PropsWithChildren<{
  data: UpSetDataInfo<T>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  suffix: string;
  empty?: boolean;
  elemOverlap: (s: ISetLike<T>) => number;
  secondary?: boolean;
  tooltip?: string;
  transform?: string;
  setAddons: UpSetAddons<ISet<T>, T>;
}>) {
  const width = size.sets.w;
  const totalWidth = size.sets.w + size.labels.w + size.cs.w;
  const height = data.sets.bandWidth;
  const className = clsx(`fill${suffix}`, !tooltip && ` pnone-${style.id}`, style.classNames.bar);
  return (
    <g transform={transform} data-upset={secondary ? 'sets-q' : 'sets-s'}>
      {data.sets.v.map((d, i) => {
        const y = data.sets.y(d)!;
        const key = data.sets.keys[i];
        if (empty && !secondary) {
          return (
            <rect key={key} x={width} y={y} width={0} height={height} className={className} style={style.styles.bar}>
              {tooltip && <title></title>}
            </rect>
          );
        }
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const x = data.sets.x(o);
        const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;

        const content = secondary ? (
          <path
            key={key}
            transform={`translate(${x}, ${y + height})`}
            d={`M1,0 l0,${-height} l-2,0 l0,${height} L-${data.triangleSize},${data.triangleSize} L${
              data.triangleSize
            },${data.triangleSize} Z`}
            data-i={i}
            data-cardinality={o}
            className={className}
          >
            {title}
          </path>
        ) : (
          <rect
            key={key}
            data-i={i}
            data-cardinality={o}
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
            const content = addon.render({ set: d, width: addon.size, height, theme: style.theme });
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
          <g key={key}>
            {content}
            {addons}
          </g>
        );
      })}
    </g>
  );
}

export default SetSelectionChart;
