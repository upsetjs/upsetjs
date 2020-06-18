/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetComposite, ISetLike, isSetLike, UpSetSelection } from '@upsetjs/react';
import { RefObject, useLayoutEffect, useMemo, MutableRefObject, useRef } from 'react';
import { View } from 'vega';
import { SingleSelection } from 'vega-lite/build/src/selection';
import { sameArray } from './utils';
import { clearMulti } from './single';

export interface IAggregatedGroupSetComposite<T> extends ISetComposite<T> {
  readonly subType: 'aggregate';
  readonly attr: string;
  readonly groups: readonly (string | number)[];
}

export function isAggregatedGroupSetComposite<T>(
  s: UpSetSelection<T> | undefined,
  attr: string
): s is IAggregatedGroupSetComposite<T> {
  return (
    s != null &&
    isSetLike(s) &&
    s.type === 'composite' &&
    (s as IAggregatedGroupSetComposite<T>).subType === 'aggregate' &&
    (s as IAggregatedGroupSetComposite<T>).attr === attr
  );
}

export function createAggregatedGroupSetComposite<T>(
  attr: string,
  elems: readonly T[],
  groups: readonly (string | number)[],
  name?: string
): IAggregatedGroupSetComposite<T> {
  return {
    name: name ?? `Vega Group ${attr}: ${groups.join(', ')}`,
    type: 'composite',
    subType: 'aggregate',
    cardinality: elems.length,
    degree: 0,
    elems,
    sets: new Set(),
    groups,
    attr,
  };
}

interface IAggregateStructure {
  _vgsid_: number;
  [key: string]: any;
}

function updateGroups(
  selection: string,
  view: View,
  s: IAggregatedGroupSetComposite<any>,
  aggregateData: string,
  unitData: string,
  aggregateField: string
) {
  const v = view.signal(`${selection}_tuple`) as { values: number[] };
  const allGroups: IAggregateStructure[] = view.data(aggregateData);
  const values = allGroups.filter((b) => s.groups.includes(b[aggregateField])).map((d) => d._vgsid_);

  const current = v && v.values ? v.values : [];
  if (sameArray(current, values)) {
    return;
  }
  const entry = v
    ? Object.assign({}, v, { values })
    : { unit: unitData, fields: view.signal(`${selection}_tuple_fields`), values };
  view.signal(`${selection}_tuple`, entry);
}

export function useVegaAggregatedGroupSelection<T>(
  viewRef: RefObject<View>,
  selection: UpSetSelection<T> | undefined,
  name: string,
  onClick?: (v: ISetLike<T> | readonly T[] | null) => void,
  onHover?: (v: ISetLike<T> | readonly T[] | null) => void,
  {
    selectionName = 'select',
    aggregatedData = 'data_0',
    unitData = 'layer_0',
    aggregateField = 'v',
    valuesField = 'values',
    elemField = 'e',
    nameGen,
  }: {
    selectionName?: string;
    aggregatedData?: string;
    unitData?: string;
    aggregateField?: string;
    valuesField?: string;
    elemField?: string;
    nameGen?: (groups: any[]) => string;
  } = {}
) {
  const selectionRef = useRef(selection);
  const listeners = useMemo(() => {
    if (!onClick && !onHover) {
      return undefined;
    }
    const r: { [key: string]: (type: string, item: unknown) => void } = {};
    const generate = (listener: (v: ISetLike<T> | readonly T[] | null) => void) =>
      // throttle((_type: string, item: unknown) => {
      (_type: string, item: unknown) => {
        if (!viewRef.current) {
          return;
        }
        const data = item as { _vgsid_: number[] };
        if (!data || !data._vgsid_ || data._vgsid_.length === 0) {
          listener(null);
          return;
        }
        const contained = new Set(data._vgsid_);
        const allGroups: IAggregateStructure[] = viewRef.current.data(aggregatedData);
        const groups = allGroups.filter((d) => contained.has(d._vgsid_));
        const groupNames = groups.map((g) => g[aggregateField] as string | number);
        if (
          selectionRef.current &&
          isAggregatedGroupSetComposite(selectionRef.current, name) &&
          sameArray(selectionRef.current.groups, groupNames)
        ) {
          return;
        }
        const elems = groups
          .map((group) => group[valuesField] || [])
          .flat()
          .map((d) => d[elemField] as T);
        const set = createAggregatedGroupSetComposite(name, elems, groupNames, nameGen ? nameGen(groups) : undefined);
        listener(set);
        // }, 100);
      };
    if (onClick) {
      r[selectionName] = generate(onClick);
    }
    if (onHover) {
      r[`${selectionName}_hover`] = generate(onHover);
    }
    return r;
  }, [
    onClick,
    onHover,
    viewRef,
    name,
    selectionRef,
    selectionName,
    aggregatedData,
    elemField,
    aggregateField,
    valuesField,
    nameGen,
  ]);

  // update bin selection with selection
  useLayoutEffect(() => {
    (selectionRef as MutableRefObject<UpSetSelection<any>>).current = selection ?? null;
    if (!viewRef.current || !onClick) {
      return;
    }
    if (isAggregatedGroupSetComposite(selection, name)) {
      updateGroups(selectionName, viewRef.current, selection, aggregatedData, unitData, aggregateField);
    } else if (selection == null) {
      clearMulti(selectionName, viewRef.current);
    }
  }, [viewRef, selection, name, selectionName, onClick, aggregatedData, unitData, aggregateField]);

  const selectionSpec = useMemo(
    () =>
      Object.assign(
        {},
        onClick
          ? {
              [selectionName]: { type: 'single', empty: 'none' } as SingleSelection,
            }
          : {},
        onHover
          ? {
              [`${selectionName}_hover`]: { type: 'single', empty: 'none', on: 'mouseover' } as SingleSelection,
            }
          : {}
      ),
    [selectionName, onClick, onHover]
  );
  return {
    signalListeners: listeners,
    hoverName: onHover ? `${selectionName}_hover` : null,
    selectionName: onClick ? selectionName : null,
    selection: selectionSpec,
  };
}
