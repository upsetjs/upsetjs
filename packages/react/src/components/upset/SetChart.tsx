import { ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSelection } from './interfaces';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { clsx, addonPositionGenerator } from './utils';
import { UpSetAddons } from '../config';
import { UpSetStyleInfo } from './deriveStyleDependent';

const SetChart = React.memo(function SetChart<T>({
  d,
  i,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
  size,
  data,
  style,
  children,
}: PropsWithChildren<
  {
    d: ISet<T>;
    i: number;
    className?: string;
    size: UpSetSizeInfo;
    style: UpSetStyleInfo;
    data: UpSetDataInfo<T>;
  } & UpSetSelection
>) {
  const x = data.sets.x(d.cardinality);
  const genPosition = addonPositionGenerator(size.sets.w + size.labels.w + size.combinations.w);
  return (
    <g
      transform={`translate(0, ${data.sets.y(d.name)})`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(d)}
      className={className}
    >
      <title>
        {d.name}: {d.cardinality}
      </title>
      <rect
        x={-size.sets.before}
        width={size.sets.w + size.labels.w + size.combinations.w + size.sets.after}
        height={data.sets.bandWidth}
        className={`hoverBar-${style.id}`}
      />
      {i % 2 === 1 && (
        <rect
          x={size.sets.w}
          width={size.labels.w + size.combinations.w + size.sets.after}
          height={data.sets.bandWidth}
          className={`fillAlternating-${style.id}`}
        />
      )}
      <rect
        x={x}
        width={size.sets.w - x}
        height={data.sets.bandWidth}
        className={clsx(`fillPrimary-${style.id}`, style.classNames.bar)}
        style={style.styles.bar}
      />
      <text
        x={x}
        dx={-style.barLabelOffset}
        y={data.sets.bandWidth / 2}
        style={style.styles.barLabel}
        className={clsx(`sBarTextStyle-${style.id}`, style.classNames.barLabel)}
      >
        {d.cardinality}
      </text>
      <text
        x={size.sets.w + size.labels.w / 2}
        y={data.sets.bandWidth / 2}
        className={clsx(`setTextStyle-${style.id}`, style.classNames.setLabel)}
        style={style.styles.setLabel}
        clipPath={`url(#clip-${size.id})`}
      >
        {d.name}
      </text>
      {size.sets.addons.map((addon) => (
        <g key={addon.name} transform={`translate(${genPosition(addon)},0)`}>
          {addon.render({ set: d, width: addon.size, height: data.sets.bandWidth })}
        </g>
      ))}
      {children}
    </g>
  );
});

export default SetChart;
