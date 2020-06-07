/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet, ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { clsx } from '../../utils';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { generatePieSlice, ICircle } from '../layout/vennDiagramLayout';

export default function VennCircleSelection<T>({
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
