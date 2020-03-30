import { ISetCombination, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';
import UpSetDot from './UpSetDot';
import { UpSetStyles } from './defineStyle';
import { clsx } from './utils';

const CombinationChart = React.memo(function CombinationChart<T>({
  d,
  scales,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  r,
  styles,
  sets,
  rsets,
  combinationBarWidth,
  combinationBarHeight,
  cx,
  cy,
  barClassName,
  barStyle,
  barLabelClassName,
  barLabelStyle,
  dotClassName,
  dotStyle,
}: PropsWithChildren<
  {
    d: ISetCombination<T>;
    scales: UpSetScales;
    styles: UpSetStyles;
    className?: string;
    r: number;
    sets: ISets<T>;
    rsets: ISets<T>;
    combinationBarWidth: number;
    combinationBarHeight: number;
    cx: number;
    cy: number;
    barClassName?: string;
    barStyle?: React.CSSProperties;
    barLabelClassName?: string;
    barLabelStyle?: React.CSSProperties;
    dotClassName?: string;
    dotStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const y = scales.combinations.y(d.cardinality);
  return (
    <g
      key={d.name}
      transform={`translate(${scales.combinations.x(d.name)}, 0)`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave(d)}
      onClick={onClick(d)}
      className={className}
    >
      <title>
        {d.name}: {d.cardinality}
      </title>
      <rect width={combinationBarWidth} height={styles.sets.h + combinationBarHeight} className="fillTransparent" />
      <rect
        y={y}
        height={combinationBarHeight - y}
        width={combinationBarWidth}
        className={clsx('fillPrimary', barClassName)}
        style={barStyle}
      />
      <text
        y={y}
        dy={-1}
        x={combinationBarWidth / 2}
        style={barLabelStyle}
        className={clsx('barTextStyle', 'middleText', barLabelClassName)}
      >
        {d.cardinality}
      </text>
      {sets.map((s) => (
        <UpSetDot
          key={s.name}
          r={r}
          cx={cx}
          cy={scales.sets.y(s.name)! + cy}
          name={d.sets.has(s) ? s.name : d.name}
          style={dotStyle}
          clazz={clsx(d.sets.has(s) ? 'fillPrimary' : 'fillNotMember', dotClassName)}
        />
      ))}
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={scales.sets.y(sets.find((p) => d.sets.has(p))!.name)! + cy}
          x2={cx}
          y2={scales.sets.y(rsets.find((p) => d.sets.has(p))!.name)! + cy}
          className="strokePrimary upsetLine"
        />
      )}
    </g>
  );
});

export default CombinationChart;
