/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import type { UpSetDataInfo } from '../derive/deriveDataDependent';
import type { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import type { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import UpSetDot from './UpSetDot';
import { clsx } from '../utils';
import { mergeColor } from './utils';

function UpSetSelectionChart<T>({
  data,
  size,
  style,
  selection,
}: PropsWithChildren<{
  data: UpSetDataInfo<T>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  selection: ISetLike<T> | null;
}>) {
  const cy = data.sets.bandWidth / 2;
  const cx = data.cs.cx;
  const r = data.r;
  const height = size.sets.h + size.sets.after;
  const width = data.cs.bandWidth;

  if (!selection || selection.type === 'set' || !data.cs) {
    return null;
  }
  const d = selection;
  const index = data.cs.keys.indexOf(data.toKey(d));
  if (index < 0) {
    return null;
  }

  return (
    <g transform={`translate(${size.labels.w + data.cs.x(d)!}, 0)`} data-upset="cs-ss" data-i={index}>
      <rect width={width} height={height} className={`selectionHint-${style.id}`} />
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={data.sets.y(data.sets.v.find((p) => data.cs.has(d, p))!)! + cy - (data.r - 1)}
          x2={cx}
          y2={data.sets.y(data.sets.rv.find((p) => data.cs.has(d, p))!)! + cy + (data.r - 1)}
          className={`upsetSelectionLine-${data.id}`}
          style={mergeColor(undefined, !style.selectionColor ? d.color : undefined, 'stroke')}
        />
      )}
      {data.sets.v
        .filter((s) => data.cs.has(d, s))
        .map((s) => (
          <UpSetDot
            key={data.toKey(s)}
            r={r * 1.1}
            cx={cx}
            cy={data.sets.y(s)! + cy}
            name={style.tooltips ? s.name : ''}
            className={clsx(`fillSelection-${style.id}`, `pnone-${style.id}`, style.classNames.dot)}
            style={mergeColor(style.styles.dot, !style.selectionColor ? s.color : undefined)}
          />
        ))}
    </g>
  );
}

export default UpSetSelectionChart;
