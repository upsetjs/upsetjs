import { ISetCombination, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';
import UpSetDot from './UpSetDot';
import { UpSetStyles } from './defineStyle';

const CombinationChart = React.memo(function CombinationChart<T>({
  d,
  scales,
  onClick,
  onMouseEnter,
  onMouseLeave,
  labelStyle,
  className,
  r,
  styles,
  sets,
  rsets,
  combinationBarWidth,
  combinationBarHeight,
  cx,
  cy,
}: PropsWithChildren<
  {
    d: ISetCombination<T>;
    scales: UpSetScales;
    styles: UpSetStyles;
    className?: string;
    r: number;
    sets: ISets<T>;
    rsets: ISets<T>;
    labelStyle?: React.CSSProperties;
    combinationBarWidth: number;
    combinationBarHeight: number;
    cx: number;
    cy: number;
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
      <rect y={y} height={combinationBarHeight - y} width={combinationBarWidth} className="fillPrimary" />
      <text y={y} dy={-1} x={combinationBarWidth / 2} style={labelStyle} className="labelStyle middleText">
        {d.cardinality}
      </text>
      <rect y={combinationBarHeight} width={combinationBarWidth} height={styles.sets.h} className="fillTransparent" />
      {sets.map((s) => (
        <UpSetDot
          key={s.name}
          r={r}
          cx={cx}
          cy={scales.sets.y(s.name)! + cy}
          name={d.sets.has(s) ? s.name : d.name}
          clazz={d.sets.has(s) ? 'fillPrimary' : 'fillNotMember'}
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
