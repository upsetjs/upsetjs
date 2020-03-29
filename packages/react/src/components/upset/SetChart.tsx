import { ISet } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';
import { UpSetStyles } from './defineStyle';

const SetChart = React.memo(function SetChart<T>({
  d,
  i,
  scales,
  onMouseEnter,
  onMouseLeave,
  onClick,
  labelStyle,
  className,
  styles,
  setLabelStyle,
  setBarWidth,
  setBarHeight,
}: PropsWithChildren<
  {
    d: ISet<T>;
    i: number;
    scales: UpSetScales;
    labelStyle?: React.CSSProperties;
    className?: string;
    styles: UpSetStyles;
    setLabelStyle?: React.CSSProperties;
    setBarWidth: number;
    setBarHeight: number;
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
      <rect x={x} width={setBarWidth - x} height={setBarHeight} className="fillPrimary" />
      <text x={x} dx={-1} y={setBarHeight / 2} style={labelStyle} className="labelStyle endText centralText">
        {d.cardinality}
      </text>
      <text
        x={setBarWidth + styles.labels.w / 2}
        y={scales.sets.y.bandwidth() / 2}
        className="labelStyle nameStyle middleText centralText"
        style={setLabelStyle}
      >
        {d.name}
      </text>
    </g>
  );
});

export default SetChart;
