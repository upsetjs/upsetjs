import React, { PropsWithChildren } from 'react';
import { UpSetScales } from './generateScales';
import { UpSetStyles } from './defineStyle';
import {
  ISets,
  ISetCombinations,
  ISetLike,
  setOverlapFactory,
  ISetCombination,
  ISet,
  setElemOverlapFactory,
} from '@upsetjs/model';
import SetSelectionChart from './SetSelectionChart';
import CombinationSelectionChart from './CombinationSelectionChart';
import LabelsSelection from './LabelsSelection';
import UpSetSelectionChart from './UpSetSelectionChart';
import { UpSetReactStyles, UpSetStyleClassNames, UpSetAddon, UpSetAddons, UpSetAddonProps } from '../config';

function isSetLike<T>(s: ReadonlyArray<T> | ISetLike<T> | null): s is ISetLike<T> {
  return s != null && !Array.isArray(s);
}

function elemOverlapOf<T>(query: Set<T> | ReadonlyArray<T>) {
  const f = setOverlapFactory(query);
  return (s: ISetLike<T>) => {
    return f(s.elems).intersection;
  };
}

function elemElemOverlapOf<T>(query: Set<T> | ReadonlyArray<T>) {
  const f = setElemOverlapFactory(query);
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
  setAddons,
  combinationAddons,
  selectionColor,
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
  selectionColor: string;
  setAddons: UpSetAddons<ISet<T>, T>;
  combinationAddons: UpSetAddons<ISetCombination<T>, T>;
}>) {
  const selectionOverlap = selection
    ? elemOverlapOf(Array.isArray(selection) ? selection : (selection as ISetLike<T>).elems)
    : () => 0;
  const selectionName = Array.isArray(selection) ? `Array(${selection.length})` : (selection as ISetLike<T>)?.name;

  const someAddon =
    setAddons.some((s) => s.renderSelection != null) || combinationAddons.some((s) => s.renderSelection != null);
  const selectionElemOverlap =
    selection && someAddon
      ? elemElemOverlapOf(Array.isArray(selection) ? selection : (selection as ISetLike<T>).elems)
      : null;

  function wrapAddon<S extends ISetLike<T>>(addon: UpSetAddon<S, T>) {
    return {
      ...addon,
      render: (props: UpSetAddonProps<S, T>) => {
        const overlap = selectionElemOverlap ? selectionElemOverlap(props.set) : null;
        return addon.renderSelection ? addon.renderSelection({ selection, selectionColor, overlap, ...props }) : null;
      },
    };
  }

  return (
    <g className={onHover ? `pnone-${styles.styleId}` : undefined}>
      <g transform={`translate(${styles.combinations.x},${styles.combinations.y})`}>
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
            combinationAddons={combinationAddons.map(wrapAddon)}
            totalHeight={styles.combinations.h + styles.sets.h}
          />
        )}
      </g>
      <g transform={`translate(${styles.sets.x},${styles.sets.y})`}>
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
            totalWidth={styles.sets.w + styles.labels.w + styles.combinations.w}
            setAddons={setAddons.map(wrapAddon)}
          />
        )}
      </g>
      <g transform={`translate(${styles.labels.x},${styles.labels.y})`}>
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
