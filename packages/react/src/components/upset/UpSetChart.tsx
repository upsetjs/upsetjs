import { ISetCombination, ISetCombinations, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetStyles } from './defineStyle';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';

export const UpSetDot = React.memo(function UpSetDot({
  cx,
  r,
  cy,
  name,
  color,
  interactive = true,
}: PropsWithChildren<{ r: number; cx: number; cy: number; color: string; name: string; interactive?: boolean }>) {
  return (
    <circle r={r} cx={cx} cy={cy} style={{ fill: color, pointerEvents: interactive ? undefined : 'none' }}>
      <title>{name}</title>
    </circle>
  );
});

const UpSetLine = React.memo(function UpSetLine<T>({
  d,
  sets,
  rsets,
  cx,
  r,
  cy,
  scales,
  height,
  color,
  notMemberColor,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
    height: number;
    rsets: ISets<T>;
    d: ISetCombination<T>;
    r: number;
    cx: number;
    cy: number;
    notMemberColor: string;
    color: string;
  } & UpSetSelection
>) {
  const width = cx * 2;
  const lineStyle: React.CSSProperties = { stroke: color, strokeWidth: r * 0.6, pointerEvents: 'none' };
  return (
    <g
      transform={`translate(${scales.combinations.x(d.name)}, 0)`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave(d)}
      onClick={onClick(d)}
    >
      <title>{d.name}</title>
      <rect width={width} height={height} style={{ fill: 'transparent' }} />
      <g>
        {sets.map(s => (
          <UpSetDot
            key={s.name}
            r={r}
            cx={cx}
            cy={scales.sets.y(s.name)! + cy}
            name={d.sets.has(s) ? s.name : d.name}
            color={d.sets.has(s) ? color : notMemberColor}
          />
        ))}
      </g>
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={scales.sets.y(sets.find(p => d.sets.has(p))!.name)! + cy}
          x2={cx}
          y2={scales.sets.y(rsets.find(p => d.sets.has(p))!.name)! + cy}
          style={lineStyle}
        />
      )}
    </g>
  );
});

const UpSetChart = React.memo(function UpSetChart<T>({
  sets,
  combinations,
  scales,
  styles,
  onClick,
  onMouseEnter,
  onMouseLeave,
  color,
  notMemberColor,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    combinations: ISetCombinations<T>;
    scales: UpSetScales;
    styles: UpSetStyles;
    color: string;
    notMemberColor: string;
  } & UpSetSelection
>) {
  const cy = scales.sets.y.bandwidth() / 2;
  const width = scales.combinations.x.bandwidth();
  const cx = width / 2;
  const r = Math.min(cx, cy) * (1 - styles.padding);
  const height = scales.sets.y.range()[1];
  const rsets = sets.slice().reverse();

  return (
    <g transform={`translate(${styles.labels.w}, 0)`}>
      {combinations.map(d => (
        <UpSetLine
          key={d.name}
          d={d}
          sets={sets}
          rsets={rsets}
          cx={cx}
          cy={cy}
          height={height}
          scales={scales}
          r={r}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          color={color}
          notMemberColor={notMemberColor}
        />
      ))}
    </g>
  );
});

export default UpSetChart;
