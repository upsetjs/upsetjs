import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetStyles } from './defineStyle';
import { ISets, ISetCombinations, ISetLike, UpSetQuery, queryOverlap, ISet, ISetCombination } from '@upsetjs/model';
import CombinationSelectionChart from './CombinationSelectionChart';
import SetSelectionChart from './SetSelectionChart';
import { UpSetStyleClassNames, UpSetReactStyles, UpSetAddons, UpSetAddon, UpSetAddonProps } from '../config';

export default React.memo(function UpSetQueries<T>({
  scales,
  styles,
  sets,
  cs,
  onHover,
  secondary,
  queries,
  triangleSize,
  cStyles,
  classNames,
  combinationAddons,
  setAddons,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  sets: ISets<T>;
  cs: ISetCombinations<T>;
  onHover?(selection: ISetLike<T> | null): void;
  secondary: boolean;
  queries: ReadonlyArray<UpSetQuery<T>>;
  triangleSize: number;
  classNames: UpSetStyleClassNames;
  cStyles: UpSetReactStyles;
  setAddons: UpSetAddons<ISet<T>, T>;
  combinationAddons: UpSetAddons<ISetCombination<T>, T>;
}>) {
  const qs = React.useMemo(
    () =>
      queries.map((q) => ({
        ...q,
        overlap: queryOverlap(q, 'intersection'),
      })),
    [queries]
  );

  function wrapAddon<S extends ISetLike<T>>(addon: UpSetAddon<S, T>, query: UpSetQuery<T>, secondary: boolean) {
    return {
      ...addon,
      render: (props: UpSetAddonProps<S, T>) => {
        return addon.renderQuery ? addon.renderQuery({ query, secondary, ...props }) : null;
      },
    };
  }

  return (
    <g className={onHover && !secondary ? 'pnone' : undefined}>
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
            barClassName={classNames.bar}
            barStyle={cStyles.bar}
            combinationAddons={combinationAddons.map((a) => wrapAddon(a, q, secondary || i > 0))}
            totalHeight={styles.combinations.h + styles.sets.h}
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
            barClassName={classNames.bar}
            barStyle={cStyles.bar}
            totalWidth={styles.sets.w + styles.labels.w + styles.combinations.w}
            setAddons={setAddons.map((a) => wrapAddon(a, q, secondary || i > 0))}
          />
        ))}
      </g>
    </g>
  );
});
