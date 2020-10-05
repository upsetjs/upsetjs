/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombination, ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import CombinationChart from './CombinationChart';
import { UpSetDataInfo } from '../derive/deriveDataDependent';
import { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import SetChart from './SetChart';
import { Handlers } from '../hooks/useHandler';

declare type Props<T> = {
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  h: Handlers;
  setChildrenFactory?: (set: ISet<T>) => React.ReactNode;
  combinationChildrenFactory?: (combination: ISetCombination<T>) => React.ReactNode;
};

const UpSetChart = /*!#__PURE__*/ React.memo(function UpSetChart<T>({
  data,
  size,
  style,
  h,
  setChildrenFactory,
  combinationChildrenFactory,
}: PropsWithChildren<Props<T>>) {
  return (
    <g className={h.hasClick ? `clickAble-${style.id}` : undefined}>
      <g transform={`translate(${size.sets.x},${size.sets.y})`} data-upset="sets">
        {data.sets.v.map((d, i) => (
          <SetChart
            key={data.sets.keys[i]}
            d={d}
            i={i}
            h={h}
            className={h.hasClick || h.hasHover ? `interactive-${style.id}` : undefined}
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
            h={h}
            className={h.hasClick || h.hasHover ? `interactive-${style.id}` : undefined}
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
