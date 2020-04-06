import { ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';
import { UpSetStyles } from './defineStyle';
import { clsx, addonPositionGenerator } from './utils';
import { UpSetAddons } from '../config';

const SetChart = React.memo(function SetChart<T>({
  d,
  i,
  scales,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
  styles,
  clipId,
  setBarHeight,
  barClassName,
  barLabelClassName,
  barLabelStyle,
  barLabelOffset,
  barStyle,
  setClassName,
  setStyle,
  children,
  setAddons,
}: PropsWithChildren<
  {
    d: ISet<T>;
    i: number;
    scales: UpSetScales;
    className?: string;
    styles: UpSetStyles;
    clipId: string;
    barLabelOffset: number;
    setBarHeight: number;
    barClassName?: string;
    barStyle?: React.CSSProperties;
    barLabelClassName?: string;
    barLabelStyle?: React.CSSProperties;
    setClassName?: string;
    setStyle?: React.CSSProperties;
    setAddons: UpSetAddons<ISet<T>, T>;
  } & UpSetSelection
>) {
  const x = scales.sets.x(d.cardinality);
  const genPosition = addonPositionGenerator(styles.sets.w + styles.labels.w + styles.combinations.w);
  return (
    <g
      transform={`translate(0, ${scales.sets.y(d.name)})`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave}
      onClick={onClick(d)}
      className={className}
    >
      <title>
        {d.name}: {d.cardinality}
      </title>
      <rect
        x={-styles.sets.before}
        width={styles.sets.w + styles.labels.w + styles.combinations.w + styles.sets.after}
        height={scales.sets.y.bandwidth()}
        className="fillTransparent hoverBar"
      />
      {i % 2 === 1 && (
        <rect
          x={styles.sets.w}
          width={styles.labels.w + styles.combinations.w + styles.sets.after}
          height={scales.sets.y.bandwidth()}
          className="fillAlternating"
        />
      )}
      <rect
        x={x}
        width={styles.sets.w - x}
        height={setBarHeight}
        className={clsx('fillPrimary', barClassName)}
        style={barStyle}
      />
      <text
        x={x}
        dx={-barLabelOffset}
        y={setBarHeight / 2}
        style={barLabelStyle}
        className={clsx('textStyle', 'barTextStyle', 'endText', 'centralText', barLabelClassName)}
      >
        {d.cardinality}
      </text>
      <text
        x={styles.sets.w + styles.labels.w / 2}
        y={scales.sets.y.bandwidth() / 2}
        className={clsx('textStyle', 'setTextStyle', 'middleText', 'centralText', setClassName)}
        style={setStyle}
        clipPath={`url(#${clipId})`}
      >
        {d.name}
      </text>
      {setAddons.map((addon) => (
        <g key={addon.name} transform={`translate(${genPosition(addon)},0)`}>
          {addon.render({ set: d, width: addon.size, height: setBarHeight })}
        </g>
      ))}
      {children}
    </g>
  );
});

export default SetChart;
