/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { queryOverlap, UpSetQuery } from '@upsetjs/model';
import React, { PropsWithChildren, useMemo } from 'react';
import KMapSelectionChart from './KMapSelectionChart';
import { KMapDataInfo } from '../derive/deriveDataDependent';
import { KMapStyleInfo } from '../derive/deriveStyleDependent';

export default /*!#__PURE__*/ React.memo(function KMapQueries<T>({
  data,
  style,
  hasHover,
  secondary,
  queries,
}: PropsWithChildren<{
  style: KMapStyleInfo;
  data: KMapDataInfo<T>;
  hasHover?: boolean;
  secondary: boolean;
  queries: readonly UpSetQuery<T>[];
}>) {
  const qs = useMemo(
    () =>
      queries.map((q) => ({
        ...q,
        overlap: queryOverlap(q, 'intersection', data.toElemKey),
      })),
    [queries, data.toElemKey]
  );

  return (
    <g className={hasHover && !secondary ? `pnone-${style.id}` : undefined}>
      {qs.map((q, i) => (
        <KMapSelectionChart
          key={q.name}
          data={data}
          style={style}
          elemOverlap={q.overlap}
          suffix={`Q${i}-${data.id}`}
          secondary={secondary || i > 0}
          tooltip={hasHover && !(secondary || i > 0) ? undefined : q.name}
        />
      ))}
    </g>
  );
});
