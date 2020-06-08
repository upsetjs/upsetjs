/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetSelection } from '../../components/interfaces';
import { clsx } from '../../utils';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { ICircle } from '../layout/interfaces';

export default React.memo(function VennCircle<T>({
  circle,
  d,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: PropsWithChildren<
  {
    circle: ICircle;
    d: ISet<T>;
    style: VennDiagramStyleInfo;
  } & UpSetSelection
>) {
  return (
    <circle
      cx={circle.x}
      cy={circle.y}
      r={circle.r}
      className={clsx(`fillPrimary-${style.id}`, style.classNames.set)}
      style={style.styles.set}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(d)}
      onContextMenu={onContextMenu(d)}
    />
  );
});
