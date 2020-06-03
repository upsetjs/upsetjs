/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { IArcSlice, generateArcSlicePath } from '../layout/vennDiagramLayout';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { clsx } from './utils';
import { UpSetSelection } from './interfaces';
import { ISetCombination } from '@upsetjs/model';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';

export default React.memo(function VennArcSlice<T>({
  slice,
  d,
  style,
  data,
  selected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: PropsWithChildren<
  {
    slice: IArcSlice;
    selected?: boolean;
    d: ISetCombination<T>;
    style: VennDiagramStyleInfo;
    data: VennDiagramDataInfo<T>;
  } & UpSetSelection
>) {
  const p = generateArcSlicePath(slice);
  return (
    <g>
      <path
        onMouseEnter={onMouseEnter(d)}
        onMouseLeave={onMouseLeave}
        onClick={onClick(d)}
        onContextMenu={onContextMenu(d)}
        d={p}
        className={clsx(`circle-${style.id}`, selected && `fillSelection-${style.id}`, style.classNames.set)}
        style={style.styles.set}
      >
        <title>
          {d.name}: {data.cs.format(d.cardinality)}
        </title>
      </path>
      <text x={slice.cx} y={slice.cy} className={`setTextStyle-${style.id}`}>
        {data.cs.format(d.cardinality)}
      </text>
    </g>
  );
});
