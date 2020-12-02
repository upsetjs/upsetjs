/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetDataInfo } from '../derive/deriveDataDependent';
import { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import { UpSetSelection } from './interfaces';
import { addonPositionGenerator, mergeColor } from './utils';
import { clsx } from '../utils';

const SetChart = /*!#__PURE__*/ React.memo(function SetChart<T>({
  d,
  i,
  h,
  className,
  size,
  data,
  style,
  children,
}: PropsWithChildren<{
  d: ISet<T>;
  i: number;
  className?: string;
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  h: UpSetSelection;
}>) {
  const x = data.sets.x(d.cardinality);
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
      <rect
        x={x}
        width={size.sets.w - x}
        height={data.sets.bandWidth}
        className={clsx(`fillPrimary-${style.id}`, style.classNames.bar)}
        style={mergeColor(style.styles.bar, d.color)}
      />
      <text
        x={x}
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

export default SetChart;
