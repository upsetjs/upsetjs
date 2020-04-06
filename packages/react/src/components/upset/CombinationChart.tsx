import { ISetCombination, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';
import UpSetDot from './UpSetDot';
import { UpSetStyles } from './defineStyle';
import { clsx, addonPositionGenerator } from './utils';
import { UpSetAddons } from '../config';

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
  cx,
  cy,
  barClassName,
  barStyle,
  barLabelClassName,
  barLabelStyle,
  dotClassName,
  dotStyle,
  children,
  barLabelOffset,
  combinationAddons,
}: PropsWithChildren<
  {
    d: ISetCombination<T>;
    scales: UpSetScales;
    styles: UpSetStyles;
    className?: string;
    r: number;
    barLabelOffset: number;
    sets: ISets<T>;
    rsets: ISets<T>;
    combinationBarWidth: number;
    cx: number;
    cy: number;
    barClassName?: string;
    barStyle?: React.CSSProperties;
    barLabelClassName?: string;
    barLabelStyle?: React.CSSProperties;
    dotClassName?: string;
    dotStyle?: React.CSSProperties;
    combinationAddons: UpSetAddons<ISetCombination<T>, T>;
  } & UpSetSelection
>) {
  const y = scales.combinations.y(d.cardinality);
  const genPosition = addonPositionGenerator(styles.combinations.h + styles.sets.h);
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
      <rect
        y={-styles.combinations.before}
        width={combinationBarWidth}
        height={styles.sets.h + styles.combinations.h + styles.combinations.before + styles.combinations.after}
        className="fillTransparent hoverBar"
      />
      <rect
        y={y}
        height={styles.combinations.h - y}
        width={combinationBarWidth}
        className={clsx('fillPrimary', barClassName)}
        style={barStyle}
      />
      <text
        y={y - barLabelOffset}
        x={combinationBarWidth / 2}
        style={barLabelStyle}
        className={clsx('textStyle', 'barTextStyle', 'middleText', barLabelClassName)}
      >
        {d.cardinality}
      </text>
      <text
        y={-barLabelOffset - styles.combinations.before}
        x={combinationBarWidth / 2}
        style={barLabelStyle}
        className={clsx('textStyle', 'hoverBarTextStyle', 'middleText', barLabelClassName)}
      >
        {d.name}
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
      {combinationAddons.map((addon) => (
        <g key={addon.name} transform={`translate(0,${genPosition(addon)})`}>
          {addon.render({ set: d, width: combinationBarWidth, height: addon.size })}
        </g>
      ))}
      {children}
    </g>
  );
});

export default CombinationChart;
