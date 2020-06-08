/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet, ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetSelection } from '../../components/interfaces';
import { clsx } from '../../utils';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { ICircle } from '../layout/interfaces';

export function SelectionPattern({
  id,
  suffix,
  v,
  style,
  rotate = 0,
}: {
  id: string;
  suffix: string;
  v: number;
  rotate?: number;
  style: VennDiagramStyleInfo;
}) {
  if (v >= 1 || v <= 0) {
    return null;
  }
  const ratio = Math.round(v * 10.0) / 100;
  return (
    <defs>
      <pattern
        id={id}
        width="1"
        height="0.1"
        patternContentUnits="objectBoundingBox"
        patternTransform={`rotate(${rotate})`}
      >
        <rect x="0" y="0" width="1" height="0.1" className={`fillPrimary-${style.id}`} />
        <rect x="0" y="0" width="1" height={ratio} className={`fill${suffix}`} />
      </pattern>
    </defs>
  );
}

export default function VennCircleSelection<T>({
  circle,
  d,
  i,
  data,
  style,
  elemOverlap,
  selectionName,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: PropsWithChildren<
  {
    circle: ICircle;
    i: number;
    d: ISet<T>;
    elemOverlap: null | ((s: ISetLike<T>) => number);
    selectionName?: string;
    style: VennDiagramStyleInfo;
    data: VennDiagramDataInfo<T>;
  } & UpSetSelection
>) {
  const o = elemOverlap ? elemOverlap(d) : 0;
  const className = clsx(
    o === 0 && `fillPrimary-${style.id}`,
    o === d.cardinality && `fillSelection-${style.id}`,
    style.classNames.set
  );
  const id = `upset-${style.id}-s${i}`;
  return (
    <>
      <SelectionPattern
        id={id}
        v={o / d.cardinality}
        style={style}
        suffix={`Selection-${style.id}`}
        rotate={circle.angle}
      />
      <circle
        onMouseEnter={onMouseEnter(d)}
        onMouseLeave={onMouseLeave}
        onClick={onClick(d)}
        onContextMenu={onContextMenu(d)}
        cx={circle.x}
        cy={circle.y}
        r={circle.r}
        fill={o > 0 && o < d.cardinality ? `url(#${id})` : undefined}
        className={className}
      >
        <title>
          {elemOverlap
            ? `${d.name} ∩ ${selectionName}: ${data.cs.format(o)}/${data.cs.format(d.cardinality)}`
            : `${d.name}: ${data.cs.format(d.cardinality)}`}
        </title>
      </circle>
    </>
  );
}
