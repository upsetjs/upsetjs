import { ISetLike, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetStyles } from './defineStyle';
import { UpSetScales } from './generateScales';
import UpSetDot from './UpSetDot';
import { clsx } from './utils';

function UpSetSelectionChart<T>({
  sets,
  scales,
  styles,
  selection,
  dotClassName,
  dotStyle,
}: PropsWithChildren<{
  sets: ISets<T>;
  scales: UpSetScales;
  styles: UpSetStyles;
  selection: ISetLike<T> | null;
  dotClassName?: string;
  dotStyle?: React.CSSProperties;
}>) {
  const cy = scales.sets.y.bandwidth() / 2;
  const cx = scales.combinations.x.bandwidth() / 2;
  const r = Math.min(cx, cy) * (1 - styles.padding);
  const height = styles.sets.h + styles.sets.after;
  const rsets = sets.slice().reverse();
  const width = scales.combinations.x.bandwidth();

  if (!selection || selection.type === 'set') {
    return null;
  }
  const d = selection;
  return (
    <g transform={`translate(${styles.labels.w + scales.combinations.x(d.name)!}, 0)`}>
      <rect width={width} height={height} className={`selectionHint-${styles.styleId}`} />
      {sets
        .filter((s) => d.sets.has(s))
        .map((s) => {
          return (
            <UpSetDot
              key={s.name}
              r={r * 1.1}
              cx={cx}
              cy={scales.sets.y(s.name)! + cy}
              name={s.name}
              className={clsx(`fillSelection-${styles.styleId}`, dotClassName, `pnone-${styles.styleId}`)}
              style={dotStyle}
            />
          );
        })}
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={scales.sets.y(sets.find((p) => d.sets.has(p))!.name)! + cy}
          x2={cx}
          y2={scales.sets.y(rsets.find((p) => d.sets.has(p))!.name)! + cy}
          className={`upsetSelectionLine-${styles.styleId}`}
        />
      )}
    </g>
  );
}

export default UpSetSelectionChart;
