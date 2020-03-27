import { ISetCombinations, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';
import UpSetDot from './UpSetDot';
import { UpSetStyles } from './defineStyle';

const CombinationChart = React.memo(function CombinationChart<T>({
  combinations,
  scales,
  onClick,
  onMouseEnter,
  onMouseLeave,
  labelStyle,
  transform,
  className,
  r,
  styles,
  sets,
}: PropsWithChildren<
  {
    transform: string;
    combinations: ISetCombinations<T>;
    scales: UpSetScales;
    styles: UpSetStyles;
    className?: string;
    r: number;
    sets: ISets<T>;
    labelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const width = scales.combinations.x.bandwidth();
  const cx = width / 2;
  const height = scales.combinations.y.range()[0];
  const cy = scales.sets.y.bandwidth() / 2 + height;

  const rsets = sets.slice().reverse();

  return (
    <g transform={transform}>
      {combinations.map((d) => {
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
            <rect y={y} height={height - y} width={width} className="fillPrimary" />
            <text y={y} dy={-1} x={width / 2} style={labelStyle} className="labelStyle middleText">
              {d.cardinality}
            </text>
            <rect y={height} width={width} height={styles.sets.h} className="fillTransparent" />
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
      })}
    </g>
  );
});

export default CombinationChart;
