/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, ISetCombination, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import CombinationChart from './CombinationChart';
import { UpSetDataInfo } from '../derive/deriveDataDependent';
import { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import SetChart from './SetChart';
import { wrap } from './utils';
import { UpSetAddonHandlerInfos } from '../interfaces';

declare type Props<T> = {
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  onHover?(selection: ISetLike<T> | null, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos): void;
  onClick?(selection: ISetLike<T> | null, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos): void;
  onContextMenu?(selection: ISetLike<T> | null, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos): void;
  onMouseMove?(selection: ISetLike<T>, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos): void;
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
  onMouseMove,
  setChildrenFactory,
  combinationChildrenFactory,
}: PropsWithChildren<Props<T>>) {
  const [onClickImpl, onMouseEnterImpl, onContextMenuImpl, onMouseLeaveImpl, onMouseMoveImpl] = React.useMemo(
    () => [
      wrap<T>(onClick),
      wrap<T>(onHover),
      wrap<T>(onContextMenu),
      onHover ? (evt: React.MouseEvent) => onHover(null, evt.nativeEvent, []) : undefined,
      wrap<T>(onMouseMove),
    ],
    [onClick, onHover, onContextMenu, onMouseMove]
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
            onMouseMove={onMouseMoveImpl}
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
            onMouseMove={onMouseMoveImpl}
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
