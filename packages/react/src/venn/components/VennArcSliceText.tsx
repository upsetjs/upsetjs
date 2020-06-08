/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombination } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { IArcSlice } from '../layout/interfaces';

export default function VennArcSliceText<T>({
  slice,
  d,
  style,
  data,
}: PropsWithChildren<{
  slice: IArcSlice;
  d: ISetCombination<T>;
  style: VennDiagramStyleInfo;
  data: VennDiagramDataInfo<T>;
}>) {
  return (
    <text x={slice.cx} y={slice.cy} className={`setTextStyle-${style.id}`}>
      {data.format(d.cardinality)}
    </text>
  );
}
