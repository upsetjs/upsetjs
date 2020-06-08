/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombination, ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { clsx } from '../../utils';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { IArcSlice } from '../layout/interfaces';
import { generateArcSlicePath } from './utils';
import { SelectionPattern } from './VennCircleSelection';
import { UpSetSelection } from '../../components/interfaces';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';

function sliceRotate(slice: IArcSlice) {
  return slice.cx === slice.x1 ? 0 : slice.cx < slice.x1 ? 60 : -60;
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
}: PropsWithChildren<
  {
    slice: IArcSlice;
    i: number;
    d: ISetCombination<T>;
    elemOverlap: null | ((s: ISetLike<T>) => number);
    selectionName?: string;
    style: VennDiagramStyleInfo;
    data: VennDiagramDataInfo<T>;
  } & UpSetSelection
>) {
  const p = generateArcSlicePath(slice);
  const o = elemOverlap ? elemOverlap(d) : 0;
  const className = clsx(
    o === 0 && `fillPrimary-${style.id}`,
    o === d.cardinality && `fillSelection-${style.id}`,
    style.classNames.set
  );
  const id = `upset-${style.id}-cs${i}`;
  return (
    <>
      <SelectionPattern
        id={id}
        v={o / d.cardinality}
        style={style}
        suffix={`Selection-${style.id}`}
        rotate={sliceRotate(slice)}
      />
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
            ? `${d.name} ∩ ${selectionName}: ${data.cs.format(o)}/${data.cs.format(d.cardinality)}`
            : `${d.name}: ${data.cs.format(d.cardinality)}`}
        </title>
      </path>
    </>
  );
}
