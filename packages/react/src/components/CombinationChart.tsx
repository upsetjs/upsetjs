/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetCombination } from '@upsetjs/model';
import React, { PropsWithChildren, ReactElement } from 'react';
import type { UpSetDataInfo } from '../derive/deriveDataDependent';
import type { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import type { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import type { UpSetSelection } from './interfaces';
import UpSetDot from './UpSetDot';
import { addonPositionGenerator, mergeColor } from './utils';
import { clsx } from '../utils';
import { OVERFLOW_PADDING_FACTOR } from '../defaults';

export function computeOverflowValues(value: number, max: number, scale: (v: number) => number) {
  const scaled = [scale(value)];
  for (let i = 0; i < OVERFLOW_PADDING_FACTOR.length && value > max; i++) {
    value -= max;
    scaled.push(scale(value));
  }
  return scaled;
}

export type CombinationChartProps<T> = PropsWithChildren<{
  d: ISetCombination<T>;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  className?: string;
  h: UpSetSelection;
}>;

const CombinationChart = /*!#__PURE__*/ React.memo(function CombinationChart<T>({
  d,
  h,
  className,
  data,
  size,
  style,
  children,
}: CombinationChartProps<T>) {
  const yValues = computeOverflowValues(d.cardinality, data.cs.max, data.cs.y);

  const genPosition = addonPositionGenerator(size.cs.h + size.sets.h, size.cs.addonPadding);
  return (
    <g
      transform={`translate(${data.cs.x(d)}, 0)`}
      onMouseEnter={h.onMouseEnter(d, size.cs.addons)}
      onMouseLeave={h.onMouseLeave}
      onClick={h.onClick(d, size.cs.addons)}
      onContextMenu={h.onContextMenu(d, size.cs.addons)}
      onMouseMove={h.onMouseMove(d, size.cs.addons)}
      className={className}
      data-cardinality={d.cardinality}
    >
      {style.tooltips && (
        <title>
          {d.name}: {data.cs.format(d.cardinality)}
        </title>
      )}
      <rect
        y={-size.cs.before}
        width={data.cs.bandWidth}
        height={size.sets.h + size.cs.h + size.cs.before + size.cs.after}
        className={`hoverBar-${style.id}`}
      />
      {yValues.map((y, i) => {
        const offset = i > 0 ? Math.floor(data.cs.bandWidth * OVERFLOW_PADDING_FACTOR[i - 1]) : 0;
        return (
          <rect
            key={i}
            x={offset}
            y={y}
            height={size.cs.h - y}
            width={data.cs.bandWidth - offset * 2}
            className={clsx(
              `fillPrimary-${style.id}`,
              i < yValues.length - 1 && `fillOverflow${yValues.length - 1 - i}-${style.id}`,
              style.classNames.bar
            )}
            style={mergeColor(style.styles.bar, d.color)}
          />
        );
      })}
      <text
        y={yValues[0] - style.barLabelOffset}
        x={data.cs.bandWidth / 2}
        style={style.styles.barLabel}
        className={clsx(`cBarTextStyle-${style.id}`, style.classNames.barLabel)}
      >
        {data.cs.format(d.cardinality)}
      </text>
      <text
        y={-style.barLabelOffset - size.cs.before}
        x={data.cs.bandWidth / 2}
        style={style.styles.barLabel}
        className={clsx(`hoverBarTextStyle-${style.id}`, style.classNames.barLabel)}
      >
        {d.name}
      </text>
      {data.sets.v.map((s, i) => {
        if (data.cs.has(d, s)) {
          // only not
          return null;
        }
        return (
          <UpSetDot
            key={data.sets.keys[i]}
            r={data.r}
            cx={data.cs.cx}
            cy={data.sets.y(s)! + data.sets.cy}
            name={style.tooltips ? d.name : ''}
            style={style.styles.dot}
            fill={undefined}
            className={clsx(`fillNotMember-${style.id}`, style.classNames.dot)}
          />
        );
      })}
      {d.sets.size > 1 && (
        <line
          x1={data.cs.cx}
          y1={data.sets.y(data.sets.v.find((p) => data.cs.has(d, p))!)! + data.sets.cy - (data.r - 1)}
          x2={data.cs.cx}
          y2={data.sets.y(data.sets.rv.find((p) => data.cs.has(d, p))!)! + data.sets.cy + (data.r - 1)}
          style={d.color ? { stroke: d.color } : undefined}
          className={`upsetLine-${data.id}`}
        />
      )}
      {data.sets.v.map((s, i) => {
        if (!data.cs.has(d, s)) {
          // only has
          return null;
        }
        return (
          <UpSetDot
            key={data.sets.keys[i]}
            r={data.r}
            cx={data.cs.cx}
            cy={data.sets.y(s)! + data.sets.cy}
            name={style.tooltips ? s.name : ''}
            style={style.styles.dot}
            fill={s.color ?? d.color}
            className={clsx(`fillPrimary-${style.id}`, style.classNames.dot)}
          />
        );
      })}
      {size.cs.addons.map((addon) => (
        <g key={addon.name} transform={`translate(0,${genPosition(addon)})`}>
          {addon.render({ set: d, width: data.cs.bandWidth, height: addon.size, theme: style.theme })}
        </g>
      ))}
      {children}
    </g>
  );
});

export default CombinationChart as <T>(props: CombinationChartProps<T>) => ReactElement;
