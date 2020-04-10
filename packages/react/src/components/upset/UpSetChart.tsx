import { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetReactChildrens } from '../config';
import CombinationChart from './CombinationChart';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import SetChart from './SetChart';
import { wrap } from './utils';

export default React.memo(function UpSetChart<T>({
  data,
  size,
  style,
  onHover,
  onClick,
  childrens,
}: PropsWithChildren<{
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T> | null): void;
  childrens: UpSetReactChildrens<T>;
}>) {
  const [onClickImpl, onMouseEnterImpl, onMouseLeaveImpl] = React.useMemo(
    () => [wrap(onClick), wrap(onHover), onHover ? () => onHover(null) : undefined],
    [onClick, onHover]
  );

  return (
    <g className={onClick ? `clickAble-${style.id}` : undefined}>
      <g transform={`translate(${size.sets.x},${size.sets.y})`}>
        {data.sets.v.map((d, i) => (
          <SetChart
            key={d.name}
            d={d}
            i={i}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            className={onClick || onHover ? `interactive-${style.id}` : undefined}
            data={data}
            style={style}
            size={size}
          >
            {childrens.set && childrens.set(d)}
          </SetChart>
        ))}
      </g>

      <g transform={`translate(${size.cs.x},${size.cs.y})`}>
        {data.cs.v.map((d) => (
          <CombinationChart
            key={d.name}
            d={d}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            className={onClick || onHover ? `interactive-${style.id}` : undefined}
            data={data}
            style={style}
            size={size}
          >
            {childrens.combinations && childrens.combinations(d)}
          </CombinationChart>
        ))}
      </g>
    </g>
  );
});
