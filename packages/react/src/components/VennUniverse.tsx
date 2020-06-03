/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { UpSetSelection } from './interfaces';
import { clsx } from './utils';

export default React.memo(function VennUniverse<T>({
  style,
  data,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: PropsWithChildren<
  {
    style: VennDiagramStyleInfo;
    data: VennDiagramDataInfo<T>;
  } & UpSetSelection
>) {
  const { width: w, height: h, x1, y1 } = data.universe.l;
  const arcs = data.universe.l.arcs
    .map(
      (arc) =>
        `A ${arc.rx} ${arc.ry} ${arc.rotation} ${arc.largeArcFlag ? 1 : 0} ${arc.sweepFlag ? 1 : 0} ${arc.x2} ${arc.y2}`
    )
    .join(' ');
  const p =
    y1 < h / 2
      ? `M 0 0 L ${x1} 0 L ${x1} ${y1} ${arcs} L ${x1} 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`
      : `M ${w} ${h} L ${x1} ${h} L ${x1} ${y1} ${arcs} L ${x1} ${h} L 0 ${h} L 0 0 L ${w} 0 Z`;
  return (
    <path
      onMouseEnter={onMouseEnter(data.universe.v)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(data.universe.v)}
      onContextMenu={onContextMenu(data.universe.v)}
      d={p}
      className={clsx(`fillTransparent-${style.id}`, style.classNames.set)}
      style={style.styles.set}
    >
      <title>
        {data.universe.v.name}: {data.universe.format(data.universe.v.cardinality)}
      </title>
    </path>
  );
});
