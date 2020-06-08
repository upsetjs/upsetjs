/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { wrap } from '../../components/utils';
import { clsx } from '../../utils';
import VennCircleSelection from './VennCircleSelection';
import VennArcSliceSelection from './VennArcSliceSelection';
import { UpSetSelection } from '../../interfaces';
import { generateSelectionOverlap, generateSelectionName } from '../../utils';

export default function VennChart<T>({
  style,
  data,
  onHover,
  onClick,
  onContextMenu,
  selection,
}: PropsWithChildren<{
  style: VennDiagramStyleInfo;
  data: VennDiagramDataInfo<T>;
  onHover?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  onClick?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  onContextMenu?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  selection?: UpSetSelection<T>;
}>) {
  const [onClickImpl, onMouseEnterImpl, onContextMenuImpl, onMouseLeaveImpl] = React.useMemo(
    () => [
      wrap(onClick),
      wrap(onHover),
      wrap(onContextMenu),
      onHover ? (evt: React.MouseEvent) => onHover(null, evt.nativeEvent) : undefined,
    ],
    [onClick, onHover, onContextMenu]
  );

  const selectionOverlap = selection == null ? null : generateSelectionOverlap(selection, data.toElemKey);
  const selectionName = generateSelectionName(selection);

  return (
    <g className={clsx(onClick && `clickAble-${style.id}`)}>
      {data.sets.l.map((l, i) => (
        <VennCircleSelection
          key={data.sets.keys[i]}
          d={data.sets.v[i]}
          i={i}
          circle={l}
          style={style}
          data={data}
          onClick={onClickImpl}
          onMouseEnter={onMouseEnterImpl}
          onMouseLeave={onMouseLeaveImpl}
          onContextMenu={onContextMenuImpl}
          selectionName={selectionName}
          elemOverlap={selectionOverlap}
        />
      ))}
      {data.cs.l.map((l, i) => (
        <VennArcSliceSelection
          key={data.cs.keys[i]}
          d={data.cs.v[i]}
          slice={l}
          i={i}
          style={style}
          data={data}
          onClick={onClickImpl}
          onMouseEnter={onMouseEnterImpl}
          onMouseLeave={onMouseLeaveImpl}
          onContextMenu={onContextMenuImpl}
          selectionName={selectionName}
          elemOverlap={selectionOverlap}
        />
      ))}
    </g>
  );
}
