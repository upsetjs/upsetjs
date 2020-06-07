/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren } from 'react';
import { VennDiagramDataInfo } from '../derive/deriveVennDataDependent';
import { VennDiagramStyleInfo } from '../derive/deriveVennStyleDependent';
import { UpSetSelection } from '../../components/interfaces';
import { clsx } from '../../utils';
import { generateUniverseSetPath } from '../layout/vennDiagramLayout';

export default React.memo(function VennUniverse<T>({
  style,
  data,
  selected,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onContextMenu,
}: PropsWithChildren<
  {
    style: VennDiagramStyleInfo;
    selected?: boolean;
    data: VennDiagramDataInfo<T>;
  } & UpSetSelection
>) {
  return (
    <path
      onMouseEnter={onMouseEnter(data.universe.v)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(data.universe.v)}
      onContextMenu={onContextMenu(data.universe.v)}
      d={generateUniverseSetPath(data.universe.l)}
      className={clsx(`fillTransparent-${style.id}`, selected && `fillSelection-${style.id}`, style.classNames.set)}
      style={style.styles.set}
    >
      <title>
        {data.universe.v.name}: {data.universe.format(data.universe.v.cardinality)}
      </title>
    </path>
  );
});
