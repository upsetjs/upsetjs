/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import VennArcSliceSelection from './VennArcSliceSelection';
import VennCircleSelection from './VennCircleSelection';
import { ISetLike } from '@upsetjs/model';
import { UpSetSelection } from '../../interfaces';
import { generateSelectionOverlap, generateSelectionName } from '../../utils';

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
  const selectionName = generateSelectionName(selection);

  return (
    <g className={onHover ? `pnone-${style.id}` : undefined}>
      {/* <VennUniverse data={dataInfo} style={styleInfo} selected={dataInfo.universe.key === selectionKey} /> */}
      {data.sets.l.map((l, i) => (
        <VennCircleSelection
          d={data.sets.v[i]}
          key={data.sets.keys[i]}
          circle={l}
          i={i}
          style={style}
          tooltip={onHover ? undefined : selectionName}
          suffix={`Selection-${style.id}`}
          elemOverlap={selectionOverlap}
        />
      ))}
      {data.cs.l.map((l, i) => (
        <VennArcSliceSelection
          d={data.cs.v[i]}
          key={data.cs.keys[i]}
          slice={l}
          i={i}
          style={style}
          tooltip={onHover ? undefined : selectionName}
          suffix={`Selection-${style.id}`}
          elemOverlap={selectionOverlap}
        />
      ))}
    </g>
  );
}
