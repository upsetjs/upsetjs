/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetDataInfo } from '../derive/deriveDataDependent';
import { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import UpSetDot from './UpSetDot';
import { clsx } from './utils';

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
      {data.sets.v
        .filter((s) => data.cs.has(d, s))
        .map((s) => (
          <UpSetDot
            key={data.toKey(s)}
            r={r * 1.1}
            cx={cx}
            cy={data.sets.y(s)! + cy}
            name={s.name}
            className={clsx(`fillSelection-${style.id}`, `pnone-${style.id}`, style.classNames.dot)}
            style={style.styles.dot}
          />
        ))}
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={data.sets.y(data.sets.v.find((p) => data.cs.has(d, p))!)! + cy}
          x2={cx}
          y2={data.sets.y(data.sets.rv.find((p) => data.cs.has(d, p))!)! + cy}
          className={`upsetSelectionLine-${data.id}`}
        />
      )}
    </g>
  );
}

export default UpSetSelectionChart;
