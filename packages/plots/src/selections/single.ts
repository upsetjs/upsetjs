/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetComposite, ISetLike, UpSetSelection, isSetCombination, ISetCombination } from '@upsetjs/react';
import { RefObject, useLayoutEffect, useMemo, MutableRefObject, useRef } from 'react';
import { View } from 'vega';
import { SingleSelection } from 'vega-lite/build/src/selection';
import { sameArray } from './utils';

export function createSetComposite<T>(elems: ReadonlyArray<T>): ISetComposite<T> {
  return {
    name: 'Vega Selection',
    type: 'composite',
    cardinality: elems.length,
    degree: 0,
    elems,
    sets: new Set(),
  };
}

interface ITransformedData<T> {
  _vgsid_: number;
  e: T;
}

export function updateMulti<T>(
  selection: string,
  view: View,
  s: ISetCombination<T>,
  transformedData: string,
  layerData: string
) {
  const v = view.signal(`${selection}_tuple`) as { values: number[] };
  const allData: ITransformedData<T>[] = view.data(transformedData);
  const lookup = new Set(s.elems);
  const values = allData.filter((b) => lookup.has(b.e)).map((d) => d._vgsid_);

  const current = v ? v.values : [];
  if (sameArray(current, values)) {
    return;
  }
  const entry = v
    ? Object.assign({}, v, { values })
    : { unit: layerData, fields: view.signal(`${selection}_tuple_fields`, values) };
  view.signal(`${selection}_tuple`, entry);
}

export function clearMulti(selection: string, view: View) {
  const v = view.signal(`${selection}_tuple`) as { values: number[] };
  if (!v || v.values.length === 0) {
    return;
  }
  view.signal(`${selection}_tuple`, null);
}

export function generateListener<T>(
  viewRef: RefObject<View>,
  selectionRef: RefObject<UpSetSelection<T> | undefined>,
  listener: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  transformedData: string
) {
  return (_type: string, item: unknown) => {
    if (!viewRef.current) {
      return;
    }
    const data = item as { _vgsid_: number[] };
    if (!data || !data._vgsid_ || data._vgsid_.length === 0) {
      listener(null);
      return;
    }
    const contained = new Set(data._vgsid_);
    const allElems: { _vgsid_: number; e: T }[] = viewRef.current.data(transformedData);
    const elems = allElems.filter((d) => contained.has(d._vgsid_)).map((d) => d.e);
    if (elems.length === 0) {
      listener(null);
      return;
    }

    if (
      selectionRef.current &&
      isSetCombination(selectionRef.current) &&
      sameArray(selectionRef.current.elems, elems)
    ) {
      return;
    }
    const set = createSetComposite(elems);
    listener(set);
  };
}

export function useVegaMultiSelection<T>(
  viewRef: RefObject<View>,
  selection: UpSetSelection<T> | undefined,
  onClick?: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  onHover?: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  { selectionName = 'select', transformedData = 'data_0', layerData = 'layer_0' } = {}
) {
  const selectionRef = useRef(selection);
  const listeners = useMemo(() => {
    if (!onClick && !onHover) {
      return undefined;
    }
    const r: { [key: string]: (type: string, item: unknown) => void } = {};
    if (onClick) {
      r[selectionName] = generateListener(viewRef, selectionRef, onClick, transformedData);
    }
    if (onHover) {
      r[`${selectionName}_hover`] = generateListener(viewRef, selectionRef, onHover, transformedData);
    }
    return r;
  }, [onClick, onHover, viewRef, selectionRef, selectionName, transformedData]);

  // update bin selection with selection
  useLayoutEffect(() => {
    (selectionRef as MutableRefObject<UpSetSelection<any>>).current = selection ?? null;
    if (!viewRef.current || !onClick) {
      return;
    }
    if (isSetCombination(selection)) {
      updateMulti(selectionName, viewRef.current, selection, transformedData, layerData);
    } else if (selection == null) {
      clearMulti(selectionName, viewRef.current);
    }
  }, [viewRef, selection, selectionName, onClick, transformedData, layerData]);

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
