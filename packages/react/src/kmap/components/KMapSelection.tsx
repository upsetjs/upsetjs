/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetLike } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { generateSelectionName, generateSelectionOverlap } from '../../utils';
import type { KMapDataInfo } from '../derive/deriveDataDependent';
import type { KMapStyleInfo } from '../derive/deriveStyleDependent';
import KMapSelectionChart from './KMapSelectionChart';

export default function KMapSelection<T>({
  data,
  style,
  selection,
  hasHover,
}: PropsWithChildren<{
  style: KMapStyleInfo;
  data: KMapDataInfo<T>;
  hasHover?: boolean;
  selection: ISetLike<T> | null | readonly T[] | ((s: ISetLike<T>) => number);
}>) {
  const empty = style.emptySelection;

  const selectionOverlap = generateSelectionOverlap(selection, data.overlapGuesser, data.toElemKey);
  const selectionName = generateSelectionName(selection);

  return (
    <g className={hasHover ? `pnone-${style.id}` : undefined}>
      {(selection || empty) && (
        <KMapSelectionChart
          data={data}
          style={style}
          empty={empty && !selection}
          elemOverlap={selectionOverlap}
          suffix={`Selection-${style.id}`}
          tooltip={hasHover ? undefined : selectionName}
        />
      )}
    </g>
  );
}
