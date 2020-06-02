/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, setElemOverlapFactory, setOverlapFactory } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { UpSetAddon, UpSetAddonProps } from '../interfaces';
import CombinationSelectionChart from './CombinationSelectionChart';
import { UpSetDataInfo } from '../derive/deriveDataDependent';
import { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import LabelsSelection from './LabelsSelection';
import SetSelectionChart from './SetSelectionChart';
import UpSetSelectionChart from './UpSetSelectionChart';

const EMPTY_ARRAY: any[] = [];

function isSetLike<T>(s: ReadonlyArray<T> | ISetLike<T> | null | ((s: ISetLike<T>) => number)): s is ISetLike<T> {
  return s != null && !Array.isArray(s);
}

function elemOverlapOf<T>(query: Set<T> | ReadonlyArray<T>, toElemKey?: (e: T) => string) {
  const f = setOverlapFactory(query, toElemKey);
  return (s: ISetLike<T>) => {
    return f(s.elems).intersection;
  };
}

function elemElemOverlapOf<T>(query: Set<T> | ReadonlyArray<T>, toElemKey?: (e: T) => string) {
  const f = setElemOverlapFactory(query, toElemKey);
  return (s: ISetLike<T>) => {
    return f(s.elems).intersection;
  };
}

export function noOverlap() {
  return 0;
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
  onHover?(selection: ISetLike<T> | null, evt: MouseEvent): void;
  selection: ISetLike<T> | null | ReadonlyArray<T> | ((s: ISetLike<T>) => number);
}>) {
  const empty = style.emptySelection;

  function generateSelectionOverlap(): (s: ISetLike<T>) => number {
    if (!selection) {
      return noOverlap;
    }
    if (typeof selection === 'function') {
      return selection;
    }
    if (Array.isArray(selection)) {
      return elemOverlapOf(selection, data.toElemKey);
    }
    const ss = selection as ISetLike<T>;
    if (ss.overlap) {
      return ss.overlap;
    }
    const f = elemOverlapOf(ss.elems, data.toElemKey);
    return (s) => {
      return s.overlap ? s.overlap(ss) : f(s);
    };
  }

  const selectionOverlap = generateSelectionOverlap();
  const selectionName = Array.isArray(selection)
    ? `Array(${selection.length})`
    : typeof selection === 'function'
    ? '?'
    : (selection as ISetLike<T>)?.name;

  const someAddon =
    size.sets.addons.some((s) => s.renderSelection != null) || size.cs.addons.some((s) => s.renderSelection != null);
  const selectionElemOverlap =
    selection && typeof selection !== 'function' && someAddon
      ? elemElemOverlapOf(Array.isArray(selection) ? selection : (selection as ISetLike<T>).elems, data.toElemKey)
      : null;

  function wrapAddon<S extends ISetLike<T>>(addon: UpSetAddon<S, T, React.ReactNode>) {
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
      {(selection || empty) && (
        <CombinationSelectionChart
          data={data}
          size={size}
          style={style}
          transform={`translate(${size.cs.x},${size.cs.y})`}
          empty={empty && !selection}
          elemOverlap={selectionOverlap}
          suffix={`Selection-${style.id}`}
          tooltip={onHover ? undefined : selectionName}
          combinationAddons={size.cs.addons.length === 0 ? EMPTY_ARRAY : size.cs.addons.map(wrapAddon)}
        />
      )}
      {(selection || empty) && (
        <SetSelectionChart
          data={data}
          size={size}
          style={style}
          transform={`translate(${size.sets.x},${size.sets.y})`}
          empty={empty && !selection}
          elemOverlap={selectionOverlap}
          suffix={`Selection-${style.id}`}
          tooltip={onHover ? undefined : selectionName}
          setAddons={size.sets.addons.length === 0 ? EMPTY_ARRAY : size.sets.addons.map(wrapAddon)}
        />
      )}
      <g transform={`translate(${size.labels.x},${size.labels.y})`}>
        {isSetLike(selection) && <LabelsSelection data={data} size={size} style={style} selection={selection} />}
        {isSetLike(selection) && <UpSetSelectionChart data={data} size={size} style={style} selection={selection} />}
      </g>
    </g>
  );
}
