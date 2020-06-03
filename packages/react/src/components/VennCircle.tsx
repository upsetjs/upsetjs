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
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: PropsWithChildren<
  {
    circle: ICircle;
    d: ISet<T>;
    style: VennDiagramStyleInfo;
    data: VennDiagramDataInfo<T>;
  } & UpSetSelection
>) {
  return (
    <circle
      cx={circle.x}
      cy={circle.y}
      r={circle.r}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(d)}
      onContextMenu={onContextMenu(d)}
      className={clsx(`circle-${style.id}`, style.classNames.set)}
      style={style.styles.set}
    >
      <title>
        {d.name}: {data.sets.format(d.cardinality)}
      </title>
    </circle>
  );
});
