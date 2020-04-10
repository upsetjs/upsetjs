import { ISetCombination } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import { UpSetSelection } from './interfaces';
import UpSetDot from './UpSetDot';
import { addonPositionGenerator, clsx } from './utils';

const CombinationChart = React.memo(function CombinationChart<T>({
  d,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  data,
  size,
  style,
  children,
}: PropsWithChildren<
  {
    d: ISetCombination<T>;
    size: UpSetSizeInfo;
    style: UpSetStyleInfo;
    data: UpSetDataInfo<T>;
    className?: string;
  } & UpSetSelection
>) {
  const y = data.combinations.y(d.cardinality);
  const genPosition = addonPositionGenerator(size.combinations.h + size.sets.h);
  return (
    <g
      key={d.name}
      transform={`translate(${data.combinations.x(d.name)}, 0)`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(d)}
      className={className}
    >
      <title>
        {d.name}: {d.cardinality}
      </title>
      <rect
        y={-size.combinations.before}
        width={data.combinations.bandWidth}
        height={size.sets.h + size.combinations.h + size.combinations.before + size.combinations.after}
        className={`hoverBar-${style.id}`}
      />
      <rect
        y={y}
        height={size.combinations.h - y}
        width={data.combinations.bandWidth}
        className={clsx(`fillPrimary-${style.id}`, style.classNames.bar)}
        style={style.styles.bar}
      />
      <text
        y={y - style.barLabelOffset}
        x={data.combinations.bandWidth / 2}
        style={style.styles.barLabel}
        className={clsx(`cBarTextStyle-${style.id}`, style.classNames.barLabel)}
      >
        {d.cardinality}
      </text>
      <text
        y={-style.barLabelOffset - size.combinations.before}
        x={data.combinations.bandWidth / 2}
        style={style.styles.barLabel}
        className={clsx(`hoverBarTextStyle-${style.id}`, style.classNames.barLabel)}
      >
        {d.name}
      </text>
      {data.sets.v.map((s) => (
        <UpSetDot
          key={s.name}
          r={data.r}
          cx={data.combinations.cx}
          cy={data.sets.y(s.name)! + data.sets.cy}
          name={d.sets.has(s) ? s.name : d.name}
          style={style.styles.dot}
          className={clsx(
            d.sets.has(s) ? `fillPrimary-${style.id}` : `fillNotMember-${style.id}`,
            style.classNames.dot
          )}
        />
      ))}
      {d.sets.size > 1 && (
        <line
          x1={data.combinations.cx}
          y1={data.sets.y(data.sets.v.find((p) => d.sets.has(p))!.name)! + data.sets.cy}
          x2={data.combinations.cx}
          y2={data.sets.y(data.sets.rv.find((p) => d.sets.has(p))!.name)! + data.sets.cy}
          className={`upsetLine-${data.id}`}
        />
      )}
      {size.combinations.addons.map((addon) => (
        <g key={addon.name} transform={`translate(0,${genPosition(addon)})`}>
          {addon.render({ set: d, width: data.combinations.bandWidth, height: addon.size })}
        </g>
      ))}
      {children}
    </g>
  );
});

export default CombinationChart;
