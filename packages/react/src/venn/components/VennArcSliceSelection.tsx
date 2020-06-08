/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { clsx } from '../../utils';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { IArcSlice, ICircle } from '../layout/interfaces';
import { UpSetSelection } from '../../components/interfaces';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';

function SelectionPattern({
  id,
  suffix,
  v,
  style,
  transparent,
  rotate = 0,
}: {
  id: string;
  suffix: string;
  v: number;
  rotate?: number;
  transparent?: boolean;
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
        {!transparent && <rect x="0" y="0" width="1" height="0.1" className={`fillPrimary-${style.id}`} />}
        <rect x="0" y="0" width="1" height={ratio} className={`fill${suffix}`} />
      </pattern>
    </defs>
  );
}

function isCircle(slice: IArcSlice | ICircle): slice is ICircle {
  return typeof (slice as ICircle).r === 'number';
}

function sliceRotate(slice: IArcSlice | ICircle) {
  if (isCircle(slice)) {
    return slice.angle;
  }
  return slice.cx === slice.x1 ? 0 : slice.cx < slice.x1 ? 60 : -60;
}

export function generateArcSlicePath(s: IArcSlice | ICircle) {
  if (isCircle(s)) {
    return `M ${s.x - s.r} ${s.y} a ${s.r} ${s.r} 0 1 0 ${2 * s.r} 0 a ${s.r} ${s.r} 0 1 0 ${-2 * s.r} 0`;
  }
  return `M ${s.x1},${s.y1} ${s.arcs
    .map(
      (arc) =>
        `A ${arc.rx} ${arc.ry} ${arc.rotation} ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${arc.x2} ${arc.y2}`
    )
    .join(' ')}`;
}

export default function VennArcSliceSelection<T>({
  slice,
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
  qs,
}: PropsWithChildren<
  {
    slice: IArcSlice | ICircle;
    i: number;
    d: ISetLike<T>;
    elemOverlap: null | ((s: ISetLike<T>) => number);
    selectionName?: string;
    style: VennDiagramStyleInfo;
    data: VennDiagramDataInfo<T>;
    qs: ReadonlyArray<(s: ISetLike<T>) => number>;
  } & UpSetSelection
>) {
  const p = generateArcSlicePath(slice);
  const rotate = sliceRotate(slice);

  const o = elemOverlap ? elemOverlap(d) : 0;
  const className = clsx(
    o === 0 && `fillPrimary-${style.id}`,
    o === d.cardinality && `fillSelection-${style.id}`,
    style.classNames.set
  );
  const id = `upset-${style.id}-${i}`;
  const selectionPattern =
    o >= d.cardinality || o <= 0 ? null : (
      <SelectionPattern id={id} v={o / d.cardinality} style={style} suffix={`Selection-${style.id}`} rotate={rotate} />
    );
  const qsOverlaps = qs.map((q) => q(d));
  const qsPatterns = qsOverlaps.map((o, qi) =>
    o >= d.cardinality || o <= 0 ? null : (
      <SelectionPattern
        key={qi}
        id={`upset-Q${qi}-${data.id}-${i}`}
        v={o / d.cardinality}
        style={style}
        transparent
        suffix={`Q${qi}-${data.id}`}
        rotate={rotate + 30 * qi + 30}
      />
    )
  );
  const someDef = selectionPattern != null || qsPatterns.some((d) => d != null);

  return (
    <>
      {someDef && (
        <defs>
          {selectionPattern}
          {qsPatterns}
        </defs>
      )}
      <path
        onMouseEnter={onMouseEnter(d)}
        onMouseLeave={onMouseLeave}
        onClick={onClick(d)}
        onContextMenu={onContextMenu(d)}
        d={p}
        fill={o > 0 && o < d.cardinality ? `url(#${id})` : undefined}
        className={className}
        style={style.styles.set}
      >
        <title>
          {elemOverlap
            ? `${d.name} ∩ ${selectionName}: ${data.format(o)}/${data.format(d.cardinality)}`
            : `${d.name}: ${data.format(d.cardinality)}`}
        </title>
      </path>
      {qsOverlaps.map(
        (o, qi) =>
          o > 0 && (
            <path
              key={qi}
              d={p}
              fill={o > 0 && o < d.cardinality ? `url(#upset-Q${qi}-${data.id}-${i})` : undefined}
              className={clsx(
                o === d.cardinality && `fillQ${qi}-${data.id}`,
                `query-circle-${style.id}`,
                `pnone-${style.id}`,
                style.classNames.set
              )}
            />
          )
      )}
    </>
  );
}
