/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISet } from '@upsetjs/model';
import React, { PropsWithChildren, ReactElement } from 'react';
import type { UpSetDataInfo } from '../derive/deriveDataDependent';
import type { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import type { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import type { UpSetSelection } from './interfaces';
import { addonPositionGenerator, mergeColor } from './utils';
import { clsx } from '../utils';
import { OVERFLOW_PADDING_FACTOR } from '../defaults';
import { computeOverflowValues } from './CombinationChart';

export type SetChartProps<T> = PropsWithChildren<{
  d: ISet<T>;
  i: number;
  className?: string;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  h: UpSetSelection;
}>;

const SetChart = /*!#__PURE__*/ React.memo(function SetChart<T>({
  d,
  i,
  h,
  className,
  size,
  data,
  style,
  children,
}: SetChartProps<T>) {
  const xValues = computeOverflowValues(d.cardinality, data.sets.max, data.sets.x);
  const genPosition = addonPositionGenerator(size.sets.w + size.labels.w + size.cs.w, size.sets.addonPadding);
  const anchorOffset =
    style.setLabelAlignment === 'center'
      ? size.labels.w / 2
      : style.setLabelAlignment === 'left'
      ? 2
      : size.labels.w - 2;
  return (
    <g
      transform={`translate(0, ${data.sets.y(d)})`}
      onMouseEnter={h.onMouseEnter(d, size.sets.addons)}
      onMouseLeave={h.onMouseLeave}
      onClick={h.onClick(d, size.sets.addons)}
      onContextMenu={h.onContextMenu(d, size.sets.addons)}
      onMouseMove={h.onMouseMove(d, size.sets.addons)}
      className={className}
      data-cardinality={d.cardinality}
    >
      {style.tooltips && (
        <title>
          {d.name}: {data.sets.format(d.cardinality)}
        </title>
      )}
      <rect
        x={-size.sets.before}
        width={size.sets.w + size.labels.w + size.cs.w + size.sets.after}
        height={data.sets.bandWidth}
        className={`hoverBar-${style.id}`}
      />
      {i % 2 === 1 && (
        <rect
          x={size.sets.w}
          width={size.labels.w + size.cs.w + size.sets.after}
          height={data.sets.bandWidth}
          className={`fillAlternating-${style.id}`}
        />
      )}
      {xValues.map((x, i) => {
        const offset = i > 0 ? Math.floor(data.sets.bandWidth * OVERFLOW_PADDING_FACTOR[i - 1]) : 0;
        return (
          <rect
            key={i}
            x={x}
            y={offset}
            width={size.sets.w - x}
            height={data.sets.bandWidth - offset * 2}
            className={clsx(
              `fillPrimary-${style.id}`,
              i < xValues.length - 1 && `fillOverflow${xValues.length - 1 - i}-${style.id}`,
              style.classNames.bar
            )}
            style={mergeColor(style.styles.bar, d.color)}
          />
        );
      })}
      <text
        x={xValues[0]}
        dx={-style.barLabelOffset}
        y={data.sets.bandWidth / 2}
        style={style.styles.barLabel}
        className={clsx(`sBarTextStyle-${style.id}`, style.classNames.barLabel)}
      >
        {data.sets.format(d.cardinality)}
      </text>
      <text
        x={size.sets.w + anchorOffset}
        y={data.sets.bandWidth / 2}
        className={clsx(`setTextStyle-${style.id}`, style.classNames.setLabel)}
        style={style.styles.setLabel}
        clipPath={`url(#clip-${size.id})`}
      >
        {d.name}
      </text>
      {size.sets.addons.map((addon) => (
        <g key={addon.name} transform={`translate(${genPosition(addon)},0)`}>
          {addon.render({ set: d, width: addon.size, height: data.sets.bandWidth, theme: style.theme })}
        </g>
      ))}
      {children}
    </g>
  );
});

export default SetChart as <T>(props: SetChartProps<T>) => ReactElement;
