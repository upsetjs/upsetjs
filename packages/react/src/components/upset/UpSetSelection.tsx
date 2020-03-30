import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetStyles } from './defineStyle';
import { ISets, ISetCombinations, ISetLike, setOverlapFactory } from '@upsetjs/model';
import SetSelectionChart from './SetSelectionChart';
import CombinationSelectionChart from './CombinationSelectionChart';
import LabelsSelection from './LabelsSelection';
import UpSetSelectionChart from './UpSetSelectionChart';
import { UpSetReactStyles, UpSetStyleClassNames } from '../config';

function isSetLike<T>(s: ReadonlyArray<T> | ISetLike<T> | null): s is ISetLike<T> {
  return s != null && !Array.isArray(s);
}

function elemOverlapOf<T>(query: Set<T> | ReadonlyArray<T>) {
  const f = setOverlapFactory(query);
  return (s: ISetLike<T>) => {
    return f(s.elems).intersection;
  };
}

export default function UpSetSelection<T>({
  scales,
  styles,
  sets,
  cs,
  selection,
  onHover,
  triangleSize,
  cStyles,
  classNames,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  sets: ISets<T>;
  cs: ISetCombinations<T>;
  triangleSize: number;
  onHover?(selection: ISetLike<T> | null): void;
  selection: ISetLike<T> | null | ReadonlyArray<T>;
  classNames: UpSetStyleClassNames;
  cStyles: UpSetReactStyles;
}>) {
  const selectionOverlap = selection
    ? elemOverlapOf(Array.isArray(selection) ? selection : (selection as ISetLike<T>).elems)
    : () => 0;
  const selectionName = Array.isArray(selection) ? `Array(${selection.length})` : (selection as ISetLike<T>)?.name;

  return (
    <g className={onHover ? 'pnone' : undefined}>
      <g transform={`translate(${styles.sets.w + styles.labels.w},0)`}>
        {selection && (
          <CombinationSelectionChart
            scales={scales}
            combinations={cs}
            elemOverlap={selectionOverlap}
            suffix="Selection"
            triangleSize={triangleSize}
            tooltip={onHover ? undefined : selectionName}
            barClassName={classNames.bar}
            barStyle={cStyles.bar}
          />
        )}
      </g>
      <g transform={`translate(0,${styles.combinations.h})`}>
        {selection && (
          <SetSelectionChart
            scales={scales}
            sets={sets}
            elemOverlap={selectionOverlap}
            suffix="Selection"
            triangleSize={triangleSize}
            tooltip={onHover ? undefined : selectionName}
            barClassName={classNames.bar}
            barStyle={cStyles.bar}
          />
        )}
      </g>
      <g transform={`translate(${styles.sets.w},${styles.combinations.h})`}>
        {isSetLike(selection) && <LabelsSelection scales={scales} styles={styles} selection={selection} />}
        {isSetLike(selection) && (
          <UpSetSelectionChart
            scales={scales}
            sets={sets}
            styles={styles}
            selection={selection}
            dotClassName={classNames.dot}
            dotStyle={cStyles.dot}
          />
        )}
      </g>
    </g>
  );
}
