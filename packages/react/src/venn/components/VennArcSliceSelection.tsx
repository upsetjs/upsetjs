/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, UpSetQueries } from '@upsetjs/model';
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
  secondary,
  rotate = 0,
}: {
  id: string;
  suffix: string;
  v: number;
  rotate?: number;
  secondary?: boolean;
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
        {!secondary && <rect x="0" y="0" width="1" height="0.1" className={`fillPrimary-${style.id}`} />}
        <rect x="0" y="0" width="1" height={ratio} className={secondary ? `strokePattern${suffix}` : `fill${suffix}`} />
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

export function generateArcSlicePath(s: IArcSlice | ICircle, p = 0) {
  if (isCircle(s)) {
    const r = s.r - p;
    return `M ${s.cx - r} ${s.cy} a ${r} ${r} 0 1 0 ${2 * r} 0 a ${r} ${r} 0 1 0 ${-2 * r} 0`;
  }
  // TODO
  return `M ${s.x1 - p},${s.y1 - p} ${s.arcs
    .map(
      (arc) =>
        `A ${arc.rx - p} ${arc.ry - p} ${arc.rotation} ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${
          arc.x2 - p
        } ${arc.y2 - p}`
    )
    .join(' ')}`;
}

function generateTitle(
  d: ISetLike<any>,
  s: number,
  sName: string | undefined,
  qs: number[],
  _queries: UpSetQueries<any>,
  data: VennDiagramDataInfo<any>
) {
  const dc = data.format(d.cardinality);
  if (!sName && qs.length === 0) {
    return {
      tooltip: `${d.name}: ${dc}`,
      title: d.type === 'set' ? [d.name, dc] : [dc],
    };
  }
  // if (sName && qs.length === 0) {
  const sV = `${data.format(s)}/${dc}`;
  return {
    tooltip: `${d.name} ∩ ${sName}: ${sV}`,
    title: d.type === 'set' ? [d.name, sV] : [sV],
  };
  // }
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
  queries,
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
    queries: UpSetQueries<T>;
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
  const secondary = elemOverlap != null || onMouseLeave != null;
  const qsOverlaps = qs.map((q) => q(d));
  const qsPatterns = qsOverlaps.map((o, qi) =>
    o >= d.cardinality || o <= 0 ? null : (
      <SelectionPattern
        key={qi}
        id={`upset-Q${qi}-${data.id}-${i}`}
        v={o / d.cardinality}
        style={style}
        secondary={secondary || qi > 0}
        suffix={`Q${qi}-${data.id}`}
        rotate={rotate}
      />
    )
  );
  const someDef = selectionPattern != null || qsPatterns.some((d) => d != null);

  const { title, tooltip } = generateTitle(d, o, selectionName, qsOverlaps, queries, data);

  return (
    <g>
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
        <title>{tooltip}</title>
      </path>
      {qsOverlaps.map(
        (o, qi) =>
          o > 0 && (
            <path
              key={qi}
              d={secondary || qi > 0 ? generateArcSlicePath(slice, qi + 1) : p}
              fill={o > 0 && o < d.cardinality ? `url(#upset-Q${qi}-${data.id}-${i})` : undefined}
              className={clsx(
                o === d.cardinality && (secondary || qi > 0 ? `strokeQ${qi}-${data.id}` : `fillQ${qi}-${data.id}`),
                `query-circle-${style.id}`,
                `pnone-${style.id}`,
                style.classNames.set
              )}
            />
          )
      )}
      <text
        x={slice.cx}
        y={slice.cy}
        className={clsx(
          `setTextStyle-${style.id}`
          // circle.align === 'left' && `startText-${style.id}`,
          // circle.align === 'right' && `endText-${style.id}`
        )}
      >
        {title.length === 1 ? (
          title[0]
        ) : (
          <>
            <tspan dy="-0.6em">{title[0]}</tspan>
            {title.slice(1).map((t) => (
              <tspan x={slice.cx} dy="1.2em" key={t}>
                {t}
              </tspan>
            ))}
          </>
        )}
      </text>
    </g>
  );
}
