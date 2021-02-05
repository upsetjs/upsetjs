/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import type { UpSetAddons } from '../interfaces';
import type { UpSetDataInfo } from '../derive/deriveDataDependent';
import type { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import type { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import { addonPositionGenerator, mergeColor } from './utils';
import { clsx } from '../utils';
import { computeOverflowValues } from './CombinationChart';
import { OVERFLOW_PADDING_FACTOR } from '../defaults';

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
  setAddons: UpSetAddons<ISet<T>, T, React.ReactNode>;
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
            <rect
              key={key}
              x={width}
              y={y}
              width={0}
              height={height}
              className={className}
              style={mergeColor(style.styles.bar, !style.selectionColor ? d.color : undefined)}
            >
              {style.tooltips && tooltip && <title></title>}
            </rect>
          );
        }
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const xValues = computeOverflowValues(o, data.sets.max, data.sets.x);
        const title = style.tooltips && tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;

        const content = secondary ? (
          <path
            key={key}
            transform={`translate(${xValues[0]}, ${y + height})`}
            d={`M1,0 l0,${-height} l-2,0 l0,${height} L-${data.triangleSize},${data.triangleSize} L${
              data.triangleSize
            },${data.triangleSize} Z`}
            data-i={i}
            data-cardinality={o}
            className={className}
            style={mergeColor(undefined, !style.selectionColor ? d.color : undefined)}
          >
            {title}
          </path>
        ) : (
          xValues.map((x, j) => {
            const offset = j > 0 ? Math.floor(data.sets.bandWidth * OVERFLOW_PADDING_FACTOR[j - 1]) : 0;
            return (
              <rect
                key={j}
                data-i={j > 0 ? null : i}
                data-cardinality={j > 0 ? null : o}
                x={x}
                y={y + offset}
                width={width - x}
                height={height - offset * 2}
                className={clsx(
                  className,
                  j < xValues.length - 1 && `fillOverflow${xValues.length - 1 - j}-${style.id}`
                )}
                style={mergeColor(style.styles.bar, !style.selectionColor ? d.color : undefined)}
              >
                {title}
              </rect>
            );
          })
        );

        const genPosition = addonPositionGenerator(totalWidth, size.sets.addonPadding);
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
