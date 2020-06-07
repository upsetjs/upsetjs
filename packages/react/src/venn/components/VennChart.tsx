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
import VennArcSlice from './VennArcSlice';
import VennCircle from './VennCircle';
import VennUniverse from './VennUniverse';

export default React.memo(function VennChart<T>({
  style,
  data,
  onHover,
  onClick,
  onContextMenu,
}: PropsWithChildren<{
  style: VennDiagramStyleInfo;
  data: VennDiagramDataInfo<T>;
  onHover?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  onClick?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  onContextMenu?(selection: ISetLike<T> | null, evt: MouseEvent): void;
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

  return (
    <g className={clsx(onClick && `clickAble-${style.id}`)}>
      <VennUniverse
        data={data}
        style={style}
        onClick={onClickImpl}
        onMouseEnter={onMouseEnterImpl}
        onMouseLeave={onMouseLeaveImpl}
        onContextMenu={onContextMenuImpl}
      />
      {data.sets.l.map((l, i) => (
        <VennCircle
          key={data.sets.keys[i]}
          d={data.sets.v[i]}
          circle={l}
          style={style}
          onClick={onClickImpl}
          onMouseEnter={onMouseEnterImpl}
          onMouseLeave={onMouseLeaveImpl}
          onContextMenu={onContextMenuImpl}
        />
      ))}
      {data.cs.l.map((l, i) => (
        <VennArcSlice
          key={data.cs.keys[i]}
          d={data.cs.v[i]}
          slice={l}
          style={style}
          data={data}
          onClick={onClickImpl}
          onMouseEnter={onMouseEnterImpl}
          onMouseLeave={onMouseLeaveImpl}
          onContextMenu={onContextMenuImpl}
        />
      ))}
    </g>
  );
});
