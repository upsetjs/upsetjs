import { expressionFunction } from 'vega';
import { UpSetQuery, UpSetSelection, isElemQuery, isCalcQuery, isSetQuery, isSetLike } from '@upsetjs/react';

export function generateQueryChecker<T>(query: UpSetQuery<T>) {
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

export function generateSelectionChecker<T>(selection?: UpSetSelection<T>) {
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

export function createQueryStore<T>(includes: (v: T) => boolean) {
  return [includes];
}

function inSetStore<T>(store: any[], elem: T) {
  return store != null && typeof store[0] === 'function' && store[0](elem);
}
expressionFunction('inSetStore', inSetStore);
