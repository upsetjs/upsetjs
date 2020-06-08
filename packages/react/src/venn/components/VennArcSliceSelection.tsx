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
import { generateArcSlicePath, IArcSlice } from '../layout/vennDiagramLayout';
import { SelectionPattern } from './VennCircleSelection';

export default function VennArcSliceSelection<T>({
  slice,
  d,
  i,
  style,
  suffix,
  elemOverlap,
  tooltip,
}: PropsWithChildren<{
  slice: IArcSlice;
  suffix: string;
  i: number;
  d: ISetCombination<T>;
  elemOverlap: (s: ISetLike<T>) => number;
  secondary?: boolean;
  tooltip?: string;
  style: VennDiagramStyleInfo;
}>) {
  const o = elemOverlap(d);
  if (o === 0) {
    return null;
  }
  const p = generateArcSlicePath(slice);
  const className = clsx(o === d.cardinality && `fill${suffix}`, !tooltip && `pnone-${style.id}`, style.classNames.set);
  const title = tooltip && <title>{`${d.name} ∩ ${tooltip}: ${o}`}</title>;
  const id = `upset-${style.id}-cs${i}`;
  return (
    <>
      <SelectionPattern id={id} v={o / d.cardinality} style={style} suffix={suffix} />
      <path d={p} fill={o < d.cardinality ? `url(#${id})` : undefined} className={className}>
        {title}
      </path>
    </>
  );
}
