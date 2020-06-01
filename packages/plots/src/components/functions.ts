/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { expressionFunction, View, Spec } from 'vega';
import {
  UpSetQuery,
  UpSetSelection,
  isElemQuery,
  isCalcQuery,
  isSetQuery,
  isSetLike,
  UpSetQueries,
} from '@upsetjs/react';
import { useCallback, MutableRefObject, useRef, useLayoutEffect, RefObject } from 'react';
import { VegaProps } from 'react-vega/lib/Vega';

function generateQueryChecker<T>(query: UpSetQuery<T>) {
  if (isCalcQuery(query)) {
    return (v: T) => query.overlap([v]) > 0;
  } else if (isSetQuery(query)) {
    const ov = query.set.overlap;
    if (ov) {
      return (v: T) => ov([v]) > 0;
    } else {
      const lookup = new Set(query.set.elems);
      return (v: T) => lookup.has(v);
    }
  } else if (isElemQuery(query)) {
    const lookup = new Set(query.elems);
    return (v: T) => lookup.has(v);
  }
  return false;
}

function generateSelectionChecker<T>(selection?: UpSetSelection<T>) {
  if (!selection) {
    return false;
  }
  if (typeof selection === 'function') {
    return (v: T) => selection({ type: 'set', name: 'S', cardinality: 1, elems: [v] }) > 0;
  } else if (isSetLike(selection)) {
    const ov = selection.overlap;
    if (ov) {
      return (v: T) => ov([v]) > 0;
    } else {
      const lookup = new Set(selection.elems);
      return (v: T) => lookup.has(v);
    }
  } else if (Array.isArray(selection)) {
    const lookup = new Set(selection);
    return (v: T) => lookup.has(v);
  }
  return false;
}

function wrap(v: false | ((v: any) => boolean)) {
  return v === false ? false : () => v;
}

function inSetStore<T>(signal: (v: T) => boolean, elem: T) {
  return typeof signal === 'function' && signal(elem);
}

function countInSetStore<T, E extends { [key: string]: T }>(
  signal: (v: T) => boolean,
  values: ReadonlyArray<E>,
  key: keyof E
) {
  if (typeof signal !== 'function' || !Array.isArray(values)) {
    return 0;
  }
  return values.reduce((acc, v) => acc + (signal(v[key]) ? 1 : 0), 0);
}

expressionFunction('inSetStore', inSetStore);
expressionFunction('countInSetStore', countInSetStore);

/**
 * generates a condition which checks whether the datum has been selected
 * @param color the selection color
 * @param elemField the property in the datum which hold the raw element
 */
export function isSelectedTest(color: string, elemField = 'e') {
  return { test: `inSetStore(upset_signal, datum.${elemField})`, value: color };
}

/**
 * generates a count field which counts the number of selected
 * @param valuesField the property in the aggregated datum which holds the raw values elements
 * @param elemField the property in the datum which holds the raw element
 */
export function countSelectedExpression(valuesField = 'values', elemField = 'e') {
  return `countInSetStore(upset_signal, datum.${valuesField}, '${elemField}')`;
}

/**
 * generates a count field which counts the number of selected
 * @param queryIndex
 * @param valuesField the property in the aggregated datum which holds the raw values elements
 * @param elemField the property in the datum which holds the raw element
 */
export function countQueryExpression(queryIndex: number, valuesField = 'values', elemField = 'e') {
  return `countInSetStore(upset_q${queryIndex}_signal, datum.${valuesField}, '${elemField}')`;
}

/**
 * generates condition which checks whether the datum has been selected in one of the given queries
 * @param queries the queries to check
 * @param elemField the property in the datum which hold the raw element
 */
export function areQueriesTests(queries?: UpSetQueries<any>, elemField = 'e') {
  return (queries ?? []).map((query, i) => ({
    test: `inSetStore(upset_q${i}_signal, datum.${elemField})`,
    value: query.color,
  }));
}

/**
 * React hook which injects signals for injecting queries and the current selection into the vega spec, use `isSelectedTest` and `areQueriesTests`
 * to check
 * @param queries
 * @param selection
 * @param trigger whether to trigger an "update" after the signal has been changed (needed sometimes)
 */
export function useVegaHooks(
  queries?: UpSetQueries,
  selection?: UpSetSelection<any>,
  trigger = false
): { viewRef: RefObject<View>; vegaProps: Partial<VegaProps> } {
  const viewRef = useRef<View>(null);

  const selectionRef = useRef(selection);
  const patch = useCallback(
    (spec: Spec) => {
      spec.signals = spec.signals || [];
      spec.signals!.push({
        name: 'upset_signal',
        value: wrap(generateSelectionChecker(selectionRef.current)),
      });
      (queries ?? []).forEach((query, i) =>
        spec.signals!.push({ name: `upset_q${i}_signal`, value: wrap(generateQueryChecker(query)) })
      );
      return spec;
    },
    [selectionRef, queries]
  );

  useLayoutEffect(() => {
    (selectionRef as MutableRefObject<UpSetSelection<any>>).current = selection ?? null;
    if (!viewRef.current) {
      return;
    }
    viewRef.current.signal('upset_signal', generateSelectionChecker(selection));
    (queries ?? []).forEach((query, i) => viewRef.current!.signal(`upset_q${i}_signal`, generateQueryChecker(query)));
    if (trigger && !(viewRef.current as any)._running) {
      viewRef.current.resize().run();
    }
  }, [viewRef, selection, queries, trigger]);

  const onNewView = useCallback(
    (view: View) => {
      (viewRef as MutableRefObject<View>).current = view;
    },
    [viewRef]
  );

  return {
    viewRef,
    vegaProps: {
      patch,
      onNewView,
    },
  };
}
