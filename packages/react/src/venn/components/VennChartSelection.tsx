/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
// import { VennArcSliceSelection } from './VennArcSlice';
import { VennCircleSelection } from './VennCircle';
import { ISetLike } from '@upsetjs/model';
import { UpSetSelection } from '../../interfaces';
import { generateSelectionOverlap } from '../../components/UpSetSelection';

export default function VennChartSelection<T>({
  style,
  data,
  selection,
  onHover,
}: PropsWithChildren<{
  style: VennDiagramStyleInfo;
  data: VennDiagramDataInfo<T>;
  onHover?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  selection?: UpSetSelection<T>;
}>) {
  const selectionOverlap = generateSelectionOverlap(selection, data.toElemKey);
  const selectionName = Array.isArray(selection)
    ? `Array(${selection.length})`
    : typeof selection === 'function'
    ? '?'
    : (selection as ISetLike<T>)?.name;

  return (
    <g className={onHover ? `pnone-${style.id}` : undefined}>
      {/* <VennUniverse data={dataInfo} style={styleInfo} selected={dataInfo.universe.key === selectionKey} /> */}
      {data.sets.l.map((l, i) => (
        <VennCircleSelection
          d={data.sets.v[i]}
          key={data.sets.keys[i]}
          circle={l}
          style={style}
          tooltip={onHover ? undefined : selectionName}
          suffix={`Selection-${style.id}`}
          elemOverlap={selectionOverlap}
        />
      ))}
      {/* {data.cs.l
        .filter((_, i) => data.cs.keys[i] === selectionKey)
        .map((l, i) => (
          <VennArcSliceSelection key={data.cs.keys[i]} slice={l} style={style} />
        ))} */}
    </g>
  );
}
