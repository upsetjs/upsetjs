import { ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';
import { UpSetStyles } from './defineStyle';

const SetChart = React.memo(function SetChart<T>({
  sets,
  scales,
  onMouseEnter,
  onMouseLeave,
  onClick,
  labelStyle,
  transform,
  className,
  styles,
  setLabelStyle,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
    labelStyle?: React.CSSProperties;
    className?: string;
    styles: UpSetStyles;
    setLabelStyle?: React.CSSProperties;
    transform: string;
  } & UpSetSelection
>) {
  const width = scales.sets.x.range()[0];
  const height = scales.sets.y.bandwidth();
  return (
    <g transform={transform}>
      {sets.map((d, i) => {
        const x = scales.sets.x(d.cardinality);
        return (
          <g
            key={d.name}
            transform={`translate(0, ${scales.sets.y(d.name)})`}
            onMouseEnter={onMouseEnter(d)}
            onMouseLeave={onMouseLeave(d)}
            onClick={onClick(d)}
            className={className}
          >
            <title>
              {d.name}: {d.cardinality}
            </title>
            <rect x={x} width={width - x} height={height} className="fillPrimary" />
            <text x={x} dx={-1} y={height / 2} style={labelStyle} className="labelStyle endText centralText">
              {d.cardinality}
            </text>
            <rect
              x={width}
              width={styles.labels.w + styles.combinations.w}
              height={scales.sets.y.bandwidth()}
              className={i % 2 === 1 ? 'fillAlternating' : 'fillTransparent'}
            />
            <text
              x={width + styles.labels.w / 2}
              y={scales.sets.y.bandwidth() / 2}
              className="middleText centralText"
              style={setLabelStyle}
            >
              {d.name}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export default SetChart;
