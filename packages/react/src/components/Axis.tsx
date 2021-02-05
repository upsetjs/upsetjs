/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { NumericScaleLike } from '@upsetjs/model';
import React, { PropsWithChildren, CSSProperties } from 'react';
import { clsx } from '../utils';

export type AxisProps = {
  scale: NumericScaleLike;
  orient: 'top' | 'bottom' | 'left' | 'right';
  tickSizeInner?: number;
  tickSizeOuter?: number;
  tickPadding?: number;
  size: number;
  start: number;
  style: AxisStyle;
  transform?: string;
};

export type AxisStyle = {
  id: string;
  classNames: { axisTick?: string };
  styles: { axisTick?: CSSProperties };
};

declare type TickProps = {
  pos: number;
  spacing: number;
  tickSizeInner: number;
  orient: 'top' | 'bottom' | 'left' | 'right';
  name?: string;
  style: AxisStyle;
};

const HorizontalTick = /*!#__PURE__*/ React.memo(function HorizontalTick({
  pos,
  spacing,
  tickSizeInner,
  orient,
  name,
  style,
}: PropsWithChildren<TickProps>) {
  const k = orient === 'top' || orient === 'left' ? -1 : 1;
  return (
    <g transform={`translate(0, ${pos + 0.5})`}>
      {name && (
        <text
          x={k * spacing}
          dy={'0.32em'}
          className={clsx(
            `axisTextStyle-${style.id}`,
            orient === 'right' ? `startText-${style.id}` : `endText-${style.id}`,
            style.classNames.axisTick
          )}
          style={style.styles.axisTick}
        >
          {name}
        </text>
      )}
      <line x2={k * tickSizeInner} className={`axisLine-${style.id}`} />
    </g>
  );
});

const VerticalTick = /*!#__PURE__*/ React.memo(function VerticalTick({
  pos,
  name,
  spacing,
  orient,
  tickSizeInner,
  style,
}: PropsWithChildren<TickProps>) {
  const k = orient === 'top' || orient === 'left' ? -1 : 1;
  return (
    <g transform={`translate(${pos + 0.5}, 0)`}>
      {name && (
        <text
          y={k * spacing}
          dy={orient === 'top' ? '0em' : '0.71em'}
          className={clsx(`axisTextStyle-${style.id}`, style.classNames.axisTick)}
          style={style.styles.axisTick}
        >
          {name}
        </text>
      )}
      <line y2={k * tickSizeInner} className={`axisLine-${style.id}`} />
    </g>
  );
});

export default function Axis({
  scale,
  orient,
  tickSizeInner = 6,
  tickSizeOuter = 6,
  tickPadding = 3,
  size,
  start,
  style,
  transform,
}: PropsWithChildren<AxisProps>) {
  const spacing = Math.max(tickSizeInner, 0) + tickPadding;
  const range0 = start;
  const range1 = size;

  const k = orient === 'top' || orient === 'left' ? -1 : 1;
  const Tick = orient === 'left' || orient === 'right' ? HorizontalTick : VerticalTick;

  const values: readonly { value: number; label?: string }[] = scale
    .ticks()
    .map((d) => (typeof d === 'number' ? { value: d, label: String(d) } : d));

  return (
    <g transform={transform}>
      {values.map((d) => (
        <Tick
          key={d.value}
          pos={scale(d.value)}
          name={d.label}
          spacing={spacing}
          tickSizeInner={tickSizeInner}
          orient={orient}
          style={style}
        />
      ))}
      <path
        className={`axisLine-${style.id}`}
        d={
          orient === 'left' || orient === 'right'
            ? tickSizeOuter
              ? `M${k * tickSizeOuter},${range0}H0.5V${range1}H${k * tickSizeOuter}`
              : `M0.5,${range0}V${range1}`
            : tickSizeOuter
            ? `M${range0},${k * tickSizeOuter}V0.5H${range1}V${k * tickSizeOuter}`
            : `M${range0},0.5H${range1}`
        }
      />
    </g>
  );
}
