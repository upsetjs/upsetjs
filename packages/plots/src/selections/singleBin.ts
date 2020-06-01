/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, UpSetSelection } from '@upsetjs/react';
import { RefObject, useCallback } from 'react';
import { View } from 'vega';
import { useVegaAggregatedGroupSelection } from './singleAggregate';

export function useVegaBinSelection<T>(
  viewRef: RefObject<View>,
  selection: UpSetSelection<T> | undefined,
  name: string,
  onClick?: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  onHover?: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  {
    selectionName = 'select',
    aggregatedData = 'data_1',
    unitData = 'layer_0',
    valueField = 'v',
    valuesField = 'values',
    elemField = 'e',
  } = {}
) {
  const aggregateField = `bin_maxbins_10_${valueField}`;
  const nameGen = useCallback(
    (groups: any[]) => {
      return `Vega Bin ${name}: ${groups
        .map((bin) => `[${bin[aggregateField]},${bin[`${aggregateField}_end`]})`)
        .join(', ')}`;
    },
    [aggregateField, name]
  );
  return useVegaAggregatedGroupSelection(viewRef, selection, name, onClick, onHover, {
    selectionName,
    aggregatedData,
    unitData,
    valuesField,
    elemField,
    aggregateField,
    nameGen,
  });
}
