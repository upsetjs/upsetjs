import { ISetLike, setElemOverlapFactory, setOverlapFactory } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetAddon, UpSetAddonProps } from '../config';
import CombinationSelectionChart from './CombinationSelectionChart';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import LabelsSelection from './LabelsSelection';
import SetSelectionChart from './SetSelectionChart';
import UpSetSelectionChart from './UpSetSelectionChart';

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
  size,
  data,
  style,
  selection,
  onHover,
}: PropsWithChildren<{
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  onHover?(selection: ISetLike<T> | null): void;
  selection: ISetLike<T> | null | ReadonlyArray<T>;
}>) {
  const selectionOverlap = selection
    ? elemOverlapOf(Array.isArray(selection) ? selection : (selection as ISetLike<T>).elems)
    : () => 0;
  const selectionName = Array.isArray(selection) ? `Array(${selection.length})` : (selection as ISetLike<T>)?.name;

  const someAddon =
    size.sets.addons.some((s) => s.renderSelection != null) ||
    size.combinations.addons.some((s) => s.renderSelection != null);
  const selectionElemOverlap =
    selection && someAddon
      ? elemElemOverlapOf(Array.isArray(selection) ? selection : (selection as ISetLike<T>).elems)
      : null;

  function wrapAddon<S extends ISetLike<T>>(addon: UpSetAddon<S, T>) {
    return {
      ...addon,
      render: (props: UpSetAddonProps<S, T>) => {
        const overlap = selectionElemOverlap ? selectionElemOverlap(props.set) : null;
        return addon.renderSelection
          ? addon.renderSelection({ selection, selectionColor: style.selectionColor, overlap, ...props })
          : null;
      },
    };
  }

  return (
    <g className={onHover ? `pnone-${style.id}` : undefined}>
      <g transform={`translate(${size.combinations.x},${size.combinations.y})`}>
        {selection && (
          <CombinationSelectionChart
            data={data}
            size={size}
            style={style}
            elemOverlap={selectionOverlap}
            suffix="Selection"
            tooltip={onHover ? undefined : selectionName}
            combinationAddons={size.combinations.addons.map(wrapAddon)}
          />
        )}
      </g>
      <g transform={`translate(${size.sets.x},${size.sets.y})`}>
        {selection && (
          <SetSelectionChart
            data={data}
            size={size}
            style={style}
            elemOverlap={selectionOverlap}
            suffix="Selection"
            tooltip={onHover ? undefined : selectionName}
            setAddons={size.sets.addons.map(wrapAddon)}
          />
        )}
      </g>
      <g transform={`translate(${size.labels.x},${size.labels.y})`}>
        {isSetLike(selection) && <LabelsSelection data={data} size={size} style={style} selection={selection} />}
        {isSetLike(selection) && <UpSetSelectionChart data={data} size={size} style={style} selection={selection} />}
      </g>
    </g>
  );
}
