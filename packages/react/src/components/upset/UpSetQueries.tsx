import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetStyles } from './defineStyle';
import { ISets, ISetCombinations, ISetLike, UpSetQuery, queryOverlap } from '@upsetjs/model';
import CombinationSelectionChart from './CombinationSelectionChart';
import SetSelectionChart from './SetSelectionChart';

export default React.memo(function UpSetQueries<T>({
  scales,
  styles,
  sets,
  cs,
  onHover,
  secondary,
  queries,
  triangleSize,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  sets: ISets<T>;
  cs: ISetCombinations<T>;
  onHover?(selection: ISetLike<T> | null): void;
  secondary: boolean;
  queries: ReadonlyArray<UpSetQuery<T>>;
  triangleSize: number;
}>) {
  const qs = React.useMemo(
    () =>
      queries.map((q) => ({
        ...q,
        overlap: queryOverlap(q, 'intersection'),
      })),
    [queries]
  );

  return (
    <g className={onHover ? 'pnone' : undefined}>
      <g transform={`translate(${styles.sets.w + styles.labels.w},0)`}>
        {qs.map((q, i) => (
          <CombinationSelectionChart
            key={q.name}
            scales={scales}
            combinations={cs}
            elemOverlap={q.overlap}
            suffix={`Q${i}`}
            secondary={secondary || i > 0}
            triangleSize={triangleSize}
            tooltip={onHover && !(secondary || i > 0) ? undefined : q.name}
          />
        ))}
      </g>
      <g transform={`translate(0,${styles.combinations.h})`}>
        {qs.map((q, i) => (
          <SetSelectionChart
            key={q.name}
            scales={scales}
            sets={sets}
            elemOverlap={q.overlap}
            suffix={`Q${i}`}
            secondary={secondary || i > 0}
            triangleSize={triangleSize}
            tooltip={onHover && !(secondary || i > 0) ? undefined : q.name}
          />
        ))}
      </g>
    </g>
  );
});
