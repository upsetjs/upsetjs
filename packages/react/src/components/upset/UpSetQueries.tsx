import { ISetLike, queryElemOverlap, queryOverlap, UpSetQuery } from '@upsetjs/model';
import React, { PropsWithChildren, useMemo } from 'react';
import { UpSetAddon, UpSetAddonProps } from '../config';
import CombinationSelectionChart from './CombinationSelectionChart';
import { UpSetDataInfo } from './deriveDataDependent';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { UpSetStyleInfo } from './deriveStyleDependent';
import SetSelectionChart from './SetSelectionChart';

const EMPTY_ARRAY: any[] = [];

export default React.memo(function UpSetQueries<T>({
  size,
  data,
  style,
  onHover,
  secondary,
  queries,
}: PropsWithChildren<{
  size: UpSetSizeInfo;
  style: UpSetStyleInfo;
  data: UpSetDataInfo<T>;
  onHover?(selection: ISetLike<T> | null, evt: React.MouseEvent): void;
  secondary: boolean;
  queries: ReadonlyArray<UpSetQuery<T>>;
}>) {
  const someAddon =
    size.sets.addons.some((s) => s.renderQuery != null) || size.cs.addons.some((s) => s.renderQuery != null);
  const qs = useMemo(
    () =>
      queries.map((q) => ({
        ...q,
        overlap: queryOverlap(q, 'intersection'),
        elemOverlap: someAddon ? queryElemOverlap(q, 'intersection') : null,
      })),
    [queries, someAddon]
  );

  function wrapAddon<
    S extends ISetLike<T>
  >(addon: UpSetAddon<S, T>, query: UpSetQuery<T>, overlapper: (set: S) => ReadonlyArray<T> | null, secondary: boolean) {
    return {
      ...addon,
      render: (props: UpSetAddonProps<S, T>) => {
        const overlap = overlapper(props.set);
        return addon.renderQuery ? addon.renderQuery({ query, overlap, secondary, ...props }) : null;
      },
    };
  }

  return (
    <g className={onHover && !secondary ? `pnone-${style.id}` : undefined}>
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
            tooltip={onHover && !(secondary || i > 0) ? undefined : q.name}
            setAddons={
              size.sets.addons.length === 0
                ? EMPTY_ARRAY
                : size.sets.addons.map((a) => wrapAddon(a, q, q.elemOverlap!, secondary || i > 0))
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
            tooltip={onHover && !(secondary || i > 0) ? undefined : q.name}
            combinationAddons={
              size.cs.addons.length === 0
                ? EMPTY_ARRAY
                : size.cs.addons.map((a) => wrapAddon(a, q, q.elemOverlap!, secondary || i > 0))
            }
          />
        ))}
      </g>
    </g>
  );
});
