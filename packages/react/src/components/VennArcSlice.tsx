/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { IArcSlice } from '../layout/vennDiagramLayout';
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
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: PropsWithChildren<
  {
    slice: IArcSlice;
    d: ISetCombination<T>;
    style: VennDiagramStyleInfo;
    data: VennDiagramDataInfo<T>;
  } & UpSetSelection
>) {
  const p = `M ${slice.x1},${slice.y1} ${slice.arcs
    .map(
      (arc) =>
        `A ${arc.rx} ${arc.ry} ${arc.rotation} ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${arc.x2} ${arc.y2}`
    )
    .join(' ')}`;
  return (
    <path
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(d)}
      onContextMenu={onContextMenu(d)}
      d={p}
      className={clsx(`circle-${style.id}`, style.classNames.set)}
      style={style.styles.set}
    >
      <title>
        {d.name}: {data.cs.format(d.cardinality)}
      </title>
    </path>
  );
});
