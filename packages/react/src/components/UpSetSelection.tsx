/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import type { UpSetAddon, UpSetAddonProps } from '../interfaces';
import CombinationSelectionChart from './CombinationSelectionChart';
import type { UpSetDataInfo } from '../derive/deriveDataDependent';
import type { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import type { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import LabelsSelection from './LabelsSelection';
import SetSelectionChart from './SetSelectionChart';
import UpSetSelectionChart from './UpSetSelectionChart';
import { generateSelectionOverlap, elemElemOverlapOf, isSetLike, generateSelectionName } from '../utils';

const EMPTY_ARRAY: any[] = [];

export default function UpSetSelection<T>({
  size,
  data,
  style,
  selection,
  hasHover,
}: PropsWithChildren<{
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  hasHover?: boolean;
  selection: ISetLike<T> | null | readonly T[] | ((s: ISetLike<T>) => number);
}>) {
  const empty = style.emptySelection;

  const selectionOverlap = generateSelectionOverlap(selection, data.overlapGuesser, data.toElemKey);
  const selectionName = generateSelectionName(selection);

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
          ? addon.renderSelection({
              selection,
              selectionColor: style.selectionColor || props.set.color || 'orange',
              overlap,
              ...props,
            })
          : null;
      },
    };
  }

  return (
    <g className={hasHover ? `pnone-${style.id}` : undefined}>
      {(selection || empty) && (
        <CombinationSelectionChart
          data={data}
          size={size}
          style={style}
          transform={`translate(${size.cs.x},${size.cs.y})`}
          empty={empty && !selection}
          elemOverlap={selectionOverlap}
          suffix={`Selection-${style.id}`}
          tooltip={hasHover ? undefined : selectionName}
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
          tooltip={hasHover ? undefined : selectionName}
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
