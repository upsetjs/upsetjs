/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { ICircle, generatePieSlice } from '../layout/vennDiagramLayout';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { clsx } from '../../utils';
import { UpSetSelection } from '../../components/interfaces';
import { ISet, ISetLike } from '@upsetjs/model';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';

export default React.memo(function VennCircle<T>({
  circle,
  d,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: PropsWithChildren<
  {
    circle: ICircle;
    d: ISet<T>;
    style: VennDiagramStyleInfo;
  } & UpSetSelection
>) {
  return (
    <circle
      cx={circle.x}
      cy={circle.y}
      r={circle.r}
      className={clsx(`fillPrimary-${style.id}`, style.classNames.set)}
      style={style.styles.set}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(d)}
      onContextMenu={onContextMenu(d)}
    />
  );
});

export function VennCircleSelection<T>({
  circle,
  d,
  style,
  suffix,
  secondary,
  elemOverlap,
  tooltip,
}: PropsWithChildren<{
  circle: ICircle;
  suffix: string;
  d: ISet<T>;
  elemOverlap: (s: ISetLike<T>) => number;
  secondary?: boolean;
  tooltip?: string;
  style: VennDiagramStyleInfo;
}>) {
  const className = clsx(`fill${suffix}`, !tooltip && `pnone-${style.id}`, style.classNames.set);
  const o = elemOverlap(d);
  if (o === 0) {
    return null;
  }
  const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;

  return (
    <path d={generatePieSlice(circle, o / d.cardinality, secondary)} data-cardinality={o} className={className}>
      {title}
    </path>
  );
}

export function VennCircleText<T>({
  circle,
  d,
  style,
  data,
}: PropsWithChildren<{
  circle: ICircle;
  d: ISet<T>;
  style: VennDiagramStyleInfo;
  data: VennDiagramDataInfo<T>;
}>) {
  return (
    <g>
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.r}
        className={clsx(`stroke-circle-${style.id}`, style.classNames.set)}
        style={style.styles.set}
      />
      <text
        x={circle.x}
        y={circle.y}
        className={clsx(
          `setTextStyle-${style.id}`
          // circle.align === 'left' && `startText-${style.id}`,
          // circle.align === 'right' && `endText-${style.id}`
        )}
      >
        <tspan dy="-0.6em">{d.name}</tspan>
        <tspan x={circle.x} dy="1.2em">
          {data.sets.format(d.cardinality)}
        </tspan>
      </text>
    </g>
  );
}
