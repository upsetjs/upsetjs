/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike, ISetCombination } from '@upsetjs/model';
import React, { PropsWithChildren, ReactNode } from 'react';
import type { UpSetAddons } from '../interfaces';
import type { UpSetDataInfo } from '../derive/deriveDataDependent';
import type { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import type { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import { addonPositionGenerator, mergeColor } from './utils';
import { clsx } from '../utils';
import { computeOverflowValues } from './CombinationChart';
import { OVERFLOW_PADDING_FACTOR } from '../defaults';

function CombinationSelectionChart<T>({
  data,
  size,
  style,
  elemOverlap,
  secondary,
  tooltip,
  suffix,
  transform,
  empty,
  combinationAddons,
}: PropsWithChildren<{
  transform?: string;
  data: UpSetDataInfo<T>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  suffix: string;
  empty?: boolean;
  elemOverlap: (s: ISetLike<T>) => number;
  secondary?: boolean;
  tooltip?: string;
  combinationAddons: UpSetAddons<ISetCombination<T>, T, ReactNode>;
}>) {
  const width = data.cs.bandWidth;
  const totalHeight = size.cs.h + size.sets.h;
  const height = size.cs.h;
  const className = clsx(`fill${suffix}`, !tooltip && `pnone-${style.id}`, style.classNames.bar);
  return (
    <g transform={transform} data-upset={secondary ? 'cs-q' : 'cs-s'}>
      {data.cs.v.map((d, i) => {
        const x = data.cs.x(d)!;
        const key = data.cs.keys[i];
        if (empty && !secondary) {
          return (
            <rect
              key={key}
              x={x}
              y={height}
              height={0}
              width={width}
              className={className}
              style={mergeColor(style.styles.bar, !style.selectionColor ? d.color : undefined)}
            >
              {tooltip && <title></title>}
            </rect>
          );
        }
        const o = elemOverlap(d);
        if (o === 0) {
          return null;
        }
        const yValues = computeOverflowValues(o, data.cs.max, data.cs.y);

        const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;
        const content = secondary ? (
          <path
            key={key}
            transform={`translate(${x}, ${yValues[0]})`}
            d={`M0,-1 l${width},0 l0,2 l${-width},0 L-${data.triangleSize},-${data.triangleSize} L-${
              data.triangleSize
            },${data.triangleSize} Z`}
            className={className}
            data-i={i}
            data-cardinality={o}
            style={mergeColor(undefined, !style.selectionColor ? d.color : undefined)}
          >
            {title}
          </path>
        ) : (
          yValues.map((y, j) => {
            const offset = j > 0 ? Math.floor(data.cs.bandWidth * OVERFLOW_PADDING_FACTOR[j - 1]) : 0;
            return (
              <rect
                key={j}
                x={x + offset}
                y={y}
                height={height - y}
                width={width - offset * 2}
                data-i={j > 0 ? null : i}
                data-cardinality={j > 0 ? null : o}
                className={clsx(
                  className,
                  j < yValues.length - 1 && `fillOverflow${yValues.length - 1 - j}-${style.id}`
                )}
                style={mergeColor(style.styles.bar, !style.selectionColor ? d.color : undefined)}
              >
                {title}
              </rect>
            );
          })
        );

        const genPosition = addonPositionGenerator(totalHeight, size.cs.addonPadding);
        const addons = combinationAddons
          .map((addon) => {
            const v = genPosition(addon);
            const content = addon.render({ set: d, width, height: addon.size, theme: style.theme });
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
          <g key={key}>
            {content}
            {addons}
          </g>
        );
      })}
    </g>
  );
}

export default CombinationSelectionChart;
