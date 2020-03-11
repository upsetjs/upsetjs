import { ISet, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetStyles } from './defineStyle';
import { UpSetScales } from './generateScales';
import { UpSetSelection } from './interfaces';

const UpSetLabel = React.memo(function UpSetLabel<T>({
  d,
  i,
  scales,
  styles,
  onClick,
  onMouseEnter,
  onMouseLeave,
  alternatingBackgroundColor,
  setLabelStyle,
}: PropsWithChildren<
  {
    d: ISet<T>;
    i: number;
    scales: UpSetScales;
    styles: UpSetStyles;
    alternatingBackgroundColor: string;
    setLabelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  return (
    <g
      transform={`translate(0, ${scales.sets.y(d.name)})`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave(d)}
      onClick={onClick(d)}
    >
      <rect
        width={styles.labels.w + styles.combinations.w}
        height={scales.sets.y.bandwidth()}
        style={{ fill: i % 2 === 1 ? alternatingBackgroundColor : 'transparent' }}
      />
      <text
        x={styles.labels.w / 2}
        y={scales.sets.y.bandwidth() / 2}
        style={{ textAnchor: 'middle', dominantBaseline: 'central', ...(setLabelStyle ?? {}) }}
      >
        {d.name}
      </text>
    </g>
  );
});

const Labels = React.memo(function Labels<T>({
  sets,
  scales,
  styles,
  onClick,
  onMouseEnter,
  onMouseLeave,
  alternatingBackgroundColor,
  setLabelStyle,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
    styles: UpSetStyles;
    alternatingBackgroundColor: string;
    setLabelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  return (
    <g>
      {sets.map((d, i) => (
        <UpSetLabel
          key={d.name}
          d={d}
          i={i}
          scales={scales}
          styles={styles}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          alternatingBackgroundColor={alternatingBackgroundColor}
          setLabelStyle={setLabelStyle}
        />
      ))}
    </g>
  );
});

export default Labels;
