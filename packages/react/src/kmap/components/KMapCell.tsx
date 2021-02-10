/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetCombination } from '@upsetjs/model';
import React, { PropsWithChildren, ReactElement } from 'react';
import { mergeColor } from '../../components/utils';
import { clsx } from '../../utils';
import type { KMapDataInfo } from '../derive/deriveDataDependent';
import type { KMapStyleInfo } from '../derive/deriveStyleDependent';
import type { UpSetSelection } from '../../components/interfaces';

export type KMapCellProps<T> = PropsWithChildren<{
  d: ISetCombination<T>;
  i: number;
  style: KMapStyleInfo;
  data: KMapDataInfo<T>;
  className?: string;
  h: UpSetSelection;
}>;

const KMapCell = /*!#__PURE__*/ React.memo(function KMapCell<T>({ d, i, h, className, data, style }: KMapCellProps<T>) {
  const l = data.cs.l[i];
  const y = data.cs.scale(d.cardinality);
  const x = (data.cell - data.cs.bandWidth) / 2;
  return (
    <g
      transform={`translate(${l.x}, ${l.y})`}
      onMouseEnter={h.onMouseEnter(d, [])}
      onMouseLeave={h.onMouseLeave}
      onClick={h.onClick(d, [])}
      onContextMenu={h.onContextMenu(d, [])}
      onMouseMove={h.onMouseMove(d, [])}
      className={className}
      data-cardinality={d.cardinality}
    >
      {style.tooltips && (
        <title>
          {d.name}: {data.sets.format(d.cardinality)}
        </title>
      )}
      <rect width={data.cell} height={data.cell} className={`fillTransparent-${style.id}`} />
      <rect
        x={x}
        y={y}
        height={data.cell - y}
        width={data.cs.bandWidth}
        className={clsx(`fillPrimary-${style.id}`, style.classNames.bar)}
        style={mergeColor(style.styles.bar, d.color)}
      />
      <text
        y={y - style.barLabelOffset}
        x={data.cell / 2}
        style={style.styles.barLabel}
        className={clsx(`barTextStyle-${style.id}`, style.classNames.barLabel)}
      >
        {data.sets.format(d.cardinality)}
      </text>
    </g>
  );
});

export default KMapCell as <T>(props: KMapCellProps<T>) => ReactElement;
