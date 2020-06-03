/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { ICircle } from '../layout/vennDiagramLayout';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { clsx } from './utils';
import { UpSetSelection } from './interfaces';
import { ISet } from '@upsetjs/model';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';

export default React.memo(function VennCircle<T>({
  circle,
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
    circle: ICircle;
    d: ISet<T>;
    selected?: boolean;
    style: VennDiagramStyleInfo;
    data: VennDiagramDataInfo<T>;
  } & UpSetSelection
>) {
  return (
    <g onMouseEnter={onMouseEnter(d)} onMouseLeave={onMouseLeave} onClick={onClick(d)} onContextMenu={onContextMenu(d)}>
      <title>
        {d.name}: {data.sets.format(d.cardinality)}
      </title>
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.r}
        className={clsx(`circle-${style.id}`, selected && `fillSelection-${style.id}`, style.classNames.set)}
        style={style.styles.set}
      ></circle>
      <text
        x={circle.x}
        y={circle.y}
        className={clsx(
          `setTextStyle-${style.id}`
          // circle.align === 'left' && `startText-${style.id}`,
          // circle.align === 'right' && `endText-${style.id}`
        )}
      >
        <tspan dy="-0.6em">{d.name}</tspan>
        <tspan x={circle.x} dy="1.2em">
          {data.sets.format(d.cardinality)}
        </tspan>
      </text>
    </g>
  );
});
