/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetComposite, isSetLike, UpSetSelection, ISetLike } from '@upsetjs/react';
import { View } from 'vega';
import { useLayoutEffect, RefObject, useMemo, useRef, MutableRefObject } from 'react';
import throttle from 'lodash.throttle';
import { IntervalSelection, SingleSelection } from 'vega-lite/build/src/selection';
import { generateListener } from './single';

export interface IIntervalSetComposite<T> extends ISetComposite<T> {
  readonly subType: 'interval';
  readonly xAttr: string;
  readonly yAttr: string;
  readonly x: [number, number];
  readonly y: [number, number];
}

export function isIntervalSetComposite<T>(
  s: UpSetSelection<T> | undefined,
  xAttr: string,
  yAttr: string
): s is IIntervalSetComposite<T> {
  return (
    s != null &&
    isSetLike(s) &&
    s.type === 'composite' &&
    (s as IIntervalSetComposite<T>).subType === 'interval' &&
    (s as IIntervalSetComposite<T>).xAttr === xAttr &&
    (s as IIntervalSetComposite<T>).yAttr === yAttr
  );
}

export function createIntervalSetComposite<T>(
  xAttr: string,
  yAttr: string,
  elems: ReadonlyArray<T>,
  x: [number, number],
  y: [number, number]
): IIntervalSetComposite<T> {
  return {
    name: `Vega Brush (${xAttr}: ${x}, ${yAttr}: ${y})`,
    type: 'composite',
    subType: 'interval',
    cardinality: elems.length,
    degree: 0,
    elems,
    sets: new Set(),
    x,
    y,
    xAttr,
    yAttr,
  };
}

function sameIntervalArray(a: [number, number], b: [number, number]): boolean {
  return a === b || (a != null && b != null && a[0] === b[0] && a[1] === b[1]);
}

function sameInterval(a: { x: [number, number]; y: [number, number] }, x: [number, number], y: [number, number]) {
  return sameIntervalArray(a.x, x) && sameIntervalArray(a.y, y);
}

function updateIntervalBrush(
  selection: string,
  view: View,
  s: IIntervalSetComposite<any>,
  xField: string,
  yField: string
) {
  const x = view.signal(`${selection}_${xField}`) as [number, number];
  const y = view.signal(`${selection}_${yField}`) as [number, number];
  if (!x || !Array.isArray(x) || !sameIntervalArray(x, s.x)) {
    view.signal(`${selection}_${xField}`, s.x);
  }
  const y2: [number, number] = [s.y[1], s.y[0]]; // since flipped
  if (!y || !Array.isArray(y) || !sameIntervalArray(y, y2)) {
    view.signal(`${selection}_${yField}`, y2);
  }
}

function clearIntervalBrush(selection: string, view: View, xField: string, yField: string) {
  const x = view.signal(`${selection}_${xField}`) as [number, number];
  const y = view.signal(`${selection}_${yField}`) as [number, number];
  if (x) {
    view.signal(`${selection}_${xField}`, null);
  }
  if (y) {
    view.signal(`${selection}_${yField}`, null);
  }
}

export function useVegaIntervalSelection<T>(
  viewRef: RefObject<View>,
  selection: UpSetSelection<T> | undefined,
  xName: string,
  yName: string,
  onClick?: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  onHover?: (v: ISetLike<T> | ReadonlyArray<T> | null) => void,
  { selectionName = 'select', transformedData = 'data_0', xField = 'x', yField = 'y', elemField = 'e' } = {}
) {
  const selectionRef = useRef(selection);
  const listeners = useMemo(() => {
    if (!onClick && !onHover) {
      return undefined;
    }
    const r: { [key: string]: (type: string, item: unknown) => void } = {};
    if (onClick) {
      r[selectionName] = throttle((_type: string, item: unknown) => {
        if (!viewRef.current) {
          return;
        }
        const brush = item as { [key: string]: [number, number] };
        if (brush[xField] == null) {
          onClick(null);
          return;
        }
        if (
          selectionRef.current &&
          isIntervalSetComposite(selectionRef.current, xName, yName) &&
          sameInterval(selectionRef.current, brush[xField], brush[yField])
        ) {
          return;
        }
        const table: any[] = viewRef.current.data('table');
        const elems = table
          .filter(
            (d) =>
              d[xField] >= brush[xField][0] &&
              d[xField] <= brush[xField][1] &&
              d[yField] >= brush[yField][0] &&
              d[yField] <= brush[yField][1]
          )
          .map((e) => e[elemField]);
        const set = createIntervalSetComposite(xName, yName, elems, brush[xField], brush[yField]);
        onClick(set);
      }, 200);
    }
    if (onHover) {
      r[`${selectionName}_hover`] = generateListener(viewRef, selectionRef, onHover, transformedData, elemField);
    }
    return r;
  }, [
    selectionName,
    onClick,
    onHover,
    viewRef,
    xName,
    yName,
    selectionRef,
    transformedData,
    xField,
    yField,
    elemField,
  ]);

  // update brush with selection
  useLayoutEffect(() => {
    (selectionRef as MutableRefObject<UpSetSelection<any>>).current = selection ?? null;
    if (!viewRef.current || !onClick) {
      return;
    }
    if (isIntervalSetComposite(selection, xName, yName)) {
      updateIntervalBrush(selectionName, viewRef.current, selection, xField, yField);
    } else if (!selection) {
      clearIntervalBrush(selectionName, viewRef.current, xField, yField);
    }
  }, [selectionName, viewRef, selection, xName, yName, onClick, xField, yField]);

  const selectionSpec = useMemo(
    () =>
      Object.assign(
        {},
        onClick
          ? {
              [selectionName]: { type: 'interval', empty: 'none' } as IntervalSelection,
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
