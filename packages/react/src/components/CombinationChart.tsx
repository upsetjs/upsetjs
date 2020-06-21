/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombination } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetDataInfo } from '../derive/deriveDataDependent';
import { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import { UpSetSelection } from './interfaces';
import UpSetDot from './UpSetDot';
import { addonPositionGenerator, mergeColor } from './utils';
import { clsx } from '../utils';

const CombinationChart = React.memo(function CombinationChart<T>({
  d,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
  onMouseMove,
  className,
  data,
  size,
  style,
  children,
}: PropsWithChildren<
  {
    d: ISetCombination<T>;
    size: UpSetSizeInfo;
    style: UpSetStyleInfo;
    data: UpSetDataInfo<T>;
    className?: string;
  } & UpSetSelection
>) {
  const y = data.cs.y(d.cardinality);
  const genPosition = addonPositionGenerator(size.cs.h + size.sets.h);
  return (
    <g
      transform={`translate(${data.cs.x(d)}, 0)`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(d)}
      onContextMenu={onContextMenu(d)}
      onMouseMove={onMouseMove(d)}
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
      <rect
        y={y}
        height={size.cs.h - y}
        width={data.cs.bandWidth}
        className={clsx(`fillPrimary-${style.id}`, style.classNames.bar)}
        style={mergeColor(style.styles.bar, d.color)}
      />
      <text
        y={y - style.barLabelOffset}
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
        const has = data.cs.has(d, s);
        return (
          <UpSetDot
            key={data.sets.keys[i]}
            r={data.r}
            cx={data.cs.cx}
            cy={data.sets.y(s)! + data.sets.cy}
            name={style.tooltips ? (has ? s.name : d.name) : ''}
            style={style.styles.dot}
            fill={has ? d.color : undefined}
            className={clsx(has ? `fillPrimary-${style.id}` : `fillNotMember-${style.id}`, style.classNames.dot)}
          />
        );
      })}
      {d.sets.size > 1 && (
        <line
          x1={data.cs.cx}
          y1={data.sets.y(data.sets.v.find((p) => data.cs.has(d, p))!)! + data.sets.cy}
          x2={data.cs.cx}
          y2={data.sets.y(data.sets.rv.find((p) => data.cs.has(d, p))!)! + data.sets.cy}
          style={d.color ? { stroke: d.color } : undefined}
          className={`upsetLine-${data.id}`}
        />
      )}
      {size.cs.addons.map((addon) => (
        <g key={addon.name} transform={`translate(0,${genPosition(addon)})`}>
          {addon.render({ set: d, width: data.cs.bandWidth, height: addon.size, theme: style.theme })}
        </g>
      ))}
      {children}
    </g>
  );
});

export default CombinationChart;
