import { ISetLike, ISets } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetStyles } from './defineStyle';
import { UpSetScales } from './generateScales';
import { UpSetDot } from './UpSetChart';

function UpSetSelectionChart<T>({
  sets,
  scales,
  styles,
  selection,
}: PropsWithChildren<{
  sets: ISets<T>;
  scales: UpSetScales;
  styles: UpSetStyles;
  selection: ISetLike<T> | null;
}>) {
  const cy = scales.sets.y.bandwidth() / 2;
  const cx = scales.combinations.x.bandwidth() / 2;
  const r = Math.min(cx, cy) * (1 - styles.padding);
  const height = scales.sets.y.range()[1];
  const rsets = sets.slice().reverse();
  const width = scales.combinations.x.bandwidth();

  if (!selection || selection.type === 'set') {
    return null;
  }
  const d = selection;
  return (
    <g transform={`translate(${styles.labels.w + scales.combinations.x(d.name)!}, 0)`}>
      <rect width={width} height={height} className="fillTransparent strokeSelection pnone" />
      {sets.map((s) => {
        const has = d.sets.has(s);
        return (
          <UpSetDot
            key={s.name}
            r={r}
            cx={cx}
            cy={scales.sets.y(s.name)! + cy}
            name={has ? s.name : d.name}
            clazz={has ? 'fillSelection' : 'fillNotMember'}
            interactive={false}
          />
        );
      })}
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={scales.sets.y(sets.find((p) => d.sets.has(p))!.name)! + cy}
          x2={cx}
          y2={scales.sets.y(rsets.find((p) => d.sets.has(p))!.name)! + cy}
          className="upsetLine strokeSelection pnone"
        />
      )}
    </g>
  );
}

export default UpSetSelectionChart;
