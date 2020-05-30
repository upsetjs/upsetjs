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
import { useCallback, MutableRefObject, useMemo, useRef } from 'react';

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
  return () => false;
}

function generateSelectionChecker<T>(selection?: UpSetSelection<T>) {
  if (!selection) {
    return () => false;
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
  return () => false;
}

function createQueryStore<T>(includes: (v: T) => boolean) {
  return [includes];
}

function inSetStore<T>(store: any[], elem: T) {
  return store != null && typeof store[0] === 'function' && store[0](elem);
}
expressionFunction('inSetStore', inSetStore);

export function isSelectedTest(color: string) {
  return { test: 'inSetStore(data("set_store"), datum.e)', value: color };
}

export function areQueriesTests(queries?: UpSetQueries<any>) {
  return (queries ?? []).map((query, i) => ({
    test: `inSetStore(data("q${i}_store"), datum.e)`,
    value: query.color,
  }));
}

export function useVegaHooks(table: any[], queries?: UpSetQueries, selection?: UpSetSelection<any>) {
  const viewRef = useRef<View>(null);
  const data = useMemo(() => {
    const r: { [key: string]: any[] } = {
      table,
      set_store: createQueryStore(generateSelectionChecker(selection)),
    };
    (queries ?? []).forEach((query, i) => {
      r[`q${i}_store`] = createQueryStore(generateQueryChecker(query));
    });
    return r;
  }, [table, selection, queries]);

  const patch = useCallback(
    (spec: Spec) => {
      spec.data!.push({ name: 'set_store' });
      (queries ?? []).forEach((_, i) => spec.data!.push({ name: `q${i}_store` }));
      return spec;
    },
    [queries]
  );

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
      data,
      onNewView,
    },
  };
}
