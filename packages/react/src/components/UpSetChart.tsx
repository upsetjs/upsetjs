/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, ISetCombination, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import CombinationChart from './CombinationChart';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import SetChart from './SetChart';
import { wrap } from './utils';

declare type Props<T> = {
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  onHover?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  onClick?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  onContextMenu?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  setChildrenFactory?: (set: ISet<T>) => React.ReactNode;
  combinationChildrenFactory?: (combination: ISetCombination<T>) => React.ReactNode;
};

const UpSetChart = React.memo(function UpSetChart<T>({
  data,
  size,
  style,
  onHover,
  onClick,
  onContextMenu,
  setChildrenFactory,
  combinationChildrenFactory,
}: PropsWithChildren<Props<T>>) {
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
    <g className={onClick ? `clickAble-${style.id}` : undefined}>
      <g transform={`translate(${size.sets.x},${size.sets.y})`} data-upset="sets">
        {data.sets.v.map((d, i) => (
          <SetChart
            key={data.sets.keys[i]}
            d={d}
            i={i}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            onContextMenu={onContextMenuImpl}
            className={onClick || onHover ? `interactive-${style.id}` : undefined}
            data={data}
            style={style}
            size={size}
          >
            {setChildrenFactory && setChildrenFactory(d)}
          </SetChart>
        ))}
      </g>

      <g transform={`translate(${size.cs.x},${size.cs.y})`} data-upset="cs">
        {data.cs.v.map((d, i) => (
          <CombinationChart
            key={data.cs.keys[i]}
            d={d}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            onContextMenu={onContextMenuImpl}
            className={onClick || onHover ? `interactive-${style.id}` : undefined}
            data={data}
            style={style}
            size={size}
          >
            {combinationChildrenFactory && combinationChildrenFactory(d)}
          </CombinationChart>
        ))}
      </g>
    </g>
  );
});

export default UpSetChart as <T>(props: PropsWithChildren<Props<T>>) => JSX.Element;
