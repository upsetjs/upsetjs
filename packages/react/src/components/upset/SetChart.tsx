import { ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';
import { UpSetStyles } from './defineStyle';
import { clsx } from './utils';

const SetChart = React.memo(function SetChart<T>({
  d,
  i,
  scales,
  onMouseEnter,
  onMouseLeave,
  onClick,
  className,
  styles,
  setBarWidth,
  setBarHeight,
  barClassName,
  barLabelClassName,
  barLabelStyle,
  barStyle,
  setClassName,
  setStyle,
  children,
}: PropsWithChildren<
  {
    d: ISet<T>;
    i: number;
    scales: UpSetScales;
    className?: string;
    styles: UpSetStyles;
    setBarWidth: number;
    setBarHeight: number;
    barClassName?: string;
    barStyle?: React.CSSProperties;
    barLabelClassName?: string;
    barLabelStyle?: React.CSSProperties;
    setClassName?: string;
    setStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const x = scales.sets.x(d.cardinality);
  return (
    <g
      transform={`translate(0, ${scales.sets.y(d.name)})`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave(d)}
      onClick={onClick(d)}
      className={className}
    >
      <title>
        {d.name}: {d.cardinality}
      </title>
      <rect
        width={setBarWidth + styles.labels.w + styles.combinations.w}
        height={scales.sets.y.bandwidth()}
        className="fillTransparent"
      />
      {i % 2 === 1 && (
        <rect
          x={setBarWidth}
          width={styles.labels.w + styles.combinations.w}
          height={scales.sets.y.bandwidth()}
          className="fillAlternating"
        />
      )}
      <rect
        x={x}
        width={setBarWidth - x}
        height={setBarHeight}
        className={clsx('fillPrimary', barClassName)}
        style={barStyle}
      />
      <text
        x={x}
        dx={-1}
        y={setBarHeight / 2}
        style={barLabelStyle}
        className={clsx('barTextStyle', 'endText', 'centralText', barLabelClassName)}
      >
        {d.cardinality}
      </text>
      <text
        x={setBarWidth + styles.labels.w / 2}
        y={scales.sets.y.bandwidth() / 2}
        className={clsx('setTextStyle', 'middleText', 'centralText', setClassName)}
        style={setStyle}
      >
        {d.name}
      </text>
      {children}
    </g>
  );
});

export default SetChart;
