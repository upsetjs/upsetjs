/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, queryElemOverlap, queryOverlap, UpSetQuery } from '@upsetjs/model';
import React, { PropsWithChildren, useMemo } from 'react';
import { UpSetAddon, UpSetAddonProps } from '../interfaces';
import CombinationSelectionChart from './CombinationSelectionChart';
import { UpSetDataInfo } from '../derive/deriveDataDependent';
import { UpSetSizeInfo } from '../derive/deriveSizeDependent';
import { UpSetStyleInfo } from '../derive/deriveStyleDependent';
import SetSelectionChart from './SetSelectionChart';

const EMPTY_ARRAY: any[] = [];

export default /*!#__PURE__*/ React.memo(function UpSetQueries<T>({
  size,
  data,
  style,
  hasHover,
  secondary,
  queries,
}: PropsWithChildren<{
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  hasHover?: boolean;
  secondary: boolean;
  queries: readonly UpSetQuery<T>[];
}>) {
  const someAddon =
    size.sets.addons.some((s) => s.renderQuery != null) || size.cs.addons.some((s) => s.renderQuery != null);
  const qs = useMemo(
    () =>
      queries.map((q) => ({
        ...q,
        overlap: queryOverlap(q, 'intersection', data.toElemKey),
        elemOverlap: someAddon ? queryElemOverlap(q, 'intersection', data.toElemKey) : null,
      })),
    [queries, someAddon, data.toElemKey]
  );

  function wrapAddon<
    S extends ISetLike<T>
  >(addon: UpSetAddon<S, T, React.ReactNode>, query: UpSetQuery<T>, index: number, overlapper: (set: S) => readonly T[] | null, secondary: boolean) {
    return {
      ...addon,
      render: (props: UpSetAddonProps<S, T>) => {
        const overlap = overlapper(props.set);
        return addon.renderQuery ? addon.renderQuery({ query, overlap, index, secondary, ...props }) : null;
      },
    };
  }

  return (
    <g className={hasHover && !secondary ? `pnone-${style.id}` : undefined}>
      <g transform={`translate(${size.sets.x},${size.sets.y})`}>
        {qs.map((q, i) => (
          <SetSelectionChart
            key={q.name}
            data={data}
            size={size}
            style={style}
            elemOverlap={q.overlap}
            suffix={`Q${i}-${data.id}`}
            secondary={secondary || i > 0}
            tooltip={hasHover && !(secondary || i > 0) ? undefined : q.name}
            setAddons={
              size.sets.addons.length === 0
                ? EMPTY_ARRAY
                : size.sets.addons.map((a, i) => wrapAddon(a, q, i, q.elemOverlap!, secondary || i > 0))
            }
          />
        ))}
      </g>
      <g transform={`translate(${size.cs.x},${size.cs.y})`}>
        {qs.map((q, i) => (
          <CombinationSelectionChart
            key={q.name}
            data={data}
            size={size}
            style={style}
            elemOverlap={q.overlap}
            suffix={`Q${i}-${data.id}`}
            secondary={secondary || i > 0}
            tooltip={hasHover && !(secondary || i > 0) ? undefined : q.name}
            combinationAddons={
              size.cs.addons.length === 0
                ? EMPTY_ARRAY
                : size.cs.addons.map((a, i) => wrapAddon(a, q, i, q.elemOverlap!, secondary || i > 0))
            }
          />
        ))}
      </g>
    </g>
  );
});
