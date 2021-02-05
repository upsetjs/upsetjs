/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { mergeColor } from '../../components/utils';
import { clsx } from '../../utils';
import type { KMapDataInfo } from '../derive/deriveDataDependent';
import type { KMapStyleInfo } from '../derive/deriveStyleDependent';

function KMapQueries<T>({
  data,
  style,
  elemOverlap,
  secondary,
  tooltip,
  suffix,
  empty,
}: PropsWithChildren<{
  data: KMapDataInfo<T>;
  style: KMapStyleInfo;
  suffix: string;
  empty?: boolean;
  elemOverlap: (s: ISetLike<T>) => number;
  secondary?: boolean;
  tooltip?: string;
}>) {
  const width = data.cs.bandWidth;
  const offset = (data.cell - width) / 2;
  const className = clsx(`fill${suffix}`, !tooltip && `pnone-${style.id}`, style.classNames.bar);
  return (
    <g data-upset={secondary ? 'cs-q' : 'cs-s'}>
      {data.cs.v.map((d, i) => {
        const l = data.cs.l[i];
        const key = data.cs.keys[i];
        if (empty && !secondary) {
          return (
            <rect
              key={key}
              x={l.x + offset}
              y={l.y + data.cell}
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
        const y = data.cs.scale(o);

        const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;
        return secondary ? (
          <path
            key={key}
            transform={`translate(${l.x + offset}, ${l.y + y})`}
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
          <rect
            key={key}
            x={l.x + offset}
            y={l.y + y}
            height={data.cell - y}
            data-i={i}
            data-cardinality={o}
            width={width}
            className={className}
            style={mergeColor(style.styles.bar, !style.selectionColor ? d.color : undefined)}
          >
            {title}
          </rect>
        );
      })}
    </g>
  );
}

export default KMapQueries;
