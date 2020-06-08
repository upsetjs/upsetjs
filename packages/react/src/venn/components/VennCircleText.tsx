/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { clsx } from '../../utils';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { ICircle } from '../layout/interfaces';

export default function VennCircleText<T>({
  circle,
  d,
  style,
  data,
}: PropsWithChildren<{
  circle: ICircle;
  d: ISet<T>;
  style: VennDiagramStyleInfo;
  data: VennDiagramDataInfo<T>;
}>) {
  return (
    <g>
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.r}
        className={clsx(`stroke-circle-${style.id}`, style.classNames.set)}
        style={style.styles.set}
      />
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
}
