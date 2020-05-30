/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo, useCallback, useRef, MutableRefObject, useLayoutEffect } from 'react';
import { ISetComposite, isSetLike, UpSetSelection } from '@upsetjs/react';
import { VegaLite } from 'react-vega';
import { UpSetPlotProps, fillDefaults } from '../interfaces';
import throttle from 'lodash.throttle';
import { createQueryStore, generateSelectionChecker, generateQueryChecker } from './functions';
import { TopLevelSpec } from 'vega-lite';
import { View } from 'vega';

export interface IScatterplotSetComposite<T> extends ISetComposite<T> {
  readonly subType: 'scatterplot';
  readonly xName: string;
  readonly yName: string;
  readonly x: [number, number];
  readonly y: [number, number];
}

function isScatterplotSetComposite<T>(
  s: UpSetSelection<T> | undefined,
  xName: string,
  yName: string
): s is IScatterplotSetComposite<T> {
  return (
    s != null &&
    isSetLike(s) &&
    s.type === 'composite' &&
    (s as IScatterplotSetComposite<T>).subType === 'scatterplot' &&
    (s as IScatterplotSetComposite<T>).xName === xName &&
    (s as IScatterplotSetComposite<T>).yName === yName
  );
}

export function createScatterplotSetComposite<T>(
  xName: string,
  yName: string,
  elems: ReadonlyArray<T>,
  brush: { x: [number, number]; y: [number, number] }
): IScatterplotSetComposite<T> {
  return {
    name: `Brush (${xName}: ${brush.x}, ${yName}: ${brush.y})`,
    type: 'composite',
    subType: 'scatterplot',
    cardinality: elems.length,
    degree: 0,
    elems,
    sets: new Set(),
    x: brush.x,
    y: brush.y,
    xName,
    yName,
  };
}

export interface ScatterplotProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;

  xAttr: keyof T | ((v: T) => number);
  yAttr: keyof T | ((v: T) => number);
  elems: ReadonlyArray<T>;

  xLabel?: string;
  yLabel?: string;
}

function sameArray(a: [number, number], b: [number, number]) {
  return a[0] === b[0] && a[1] === b[1];
}

function sameBrush(a: { x: [number, number]; y: [number, number] }, b: { x: [number, number]; y: [number, number] }) {
  return sameArray(a.x, b.x) && sameArray(a.y, b.y);
}

export default function Scatterplot<T>(props: ScatterplotProps<T>) {
  const { title, description, selectionColor, color, theme } = fillDefaults(props);
  const { xAttr, yAttr, elems, width, height } = props;
  const xName = props.xLabel ?? typeof xAttr === 'function' ? 'x' : xAttr.toString();
  const yName = props.yLabel ?? typeof yAttr === 'function' ? 'y' : yAttr.toString();

  const viewRef = useRef<View>(null);

  const table = useMemo(() => {
    const xAcc = typeof xAttr === 'function' ? xAttr : (v: T) => v[xAttr];
    const yAcc = typeof yAttr === 'function' ? yAttr : (v: T) => v[yAttr];
    return elems.map((e) => ({ e, x: xAcc(e), y: yAcc(e) }));
  }, [elems, xAttr, yAttr]);

  const data = useMemo(() => {
    const r: { [key: string]: any[] } = {
      table,
      set_store: createQueryStore(generateSelectionChecker(props.selection)),
    };
    (props.queries ?? []).forEach((query, i) => {
      r[`q${i}_store`] = createQueryStore(generateQueryChecker(query));
    });
    return r;
  }, [table, props.selection, props.queries]);

  const onClick = props.onClick;
  const listeners = useMemo(() => {
    const r: { [key: string]: (type: string, item: unknown) => void } = {};
    if (onClick) {
      r.select = throttle((_type: string, item: unknown) => {
        const brush = item as { x: [number, number]; y: [number, number] };
        if (brush.x == null) {
          onClick(null);
          return;
        }
        if (isScatterplotSetComposite(props.selection, xName, yName) && sameBrush(props.selection, brush)) {
          return;
        }
        const elems = table
          .filter((d) => d.x >= brush.x[0] && d.x <= brush.x[1] && d.y >= brush.y[0] && d.y <= brush.y[1])
          .map((e) => e.e);
        const set = createScatterplotSetComposite(xName, yName, elems, brush);
        onClick(set);
      }, 200);
    }
    return r;
  }, [onClick, table, xName, yName, props.selection]);

  // define the set and query stores
  const patchSpec = useCallback(
    (spec) => {
      spec.data!.push({ name: 'set_store' });
      (props.queries ?? []).forEach((_, i) => spec.data!.push({ name: `q${i}_store` }));
      return spec;
    },
    [props.queries]
  );

  // update brush with selection
  useLayoutEffect(() => {
    if (!viewRef.current || !isScatterplotSetComposite(props.selection, xName, yName)) {
      return;
    }
    const x = viewRef.current.signal('select_x') as [number, number];
    const y = viewRef.current.signal('select_y') as [number, number];
    const y2: [number, number] = [props.selection.y[1], props.selection.y[0]];
    if (!x || !Array.isArray(x) || !sameArray(x, props.selection.x)) {
      viewRef.current.signal('select_x', props.selection.x);
    }
    if (!y || !Array.isArray(y) || !sameArray(y, y2)) {
      viewRef.current.signal('select_y', y2);
    }
  }, [viewRef, props.selection, xName, yName]);

  const spec = useMemo((): TopLevelSpec => {
    return {
      title,
      description,
      data: { name: 'table' },
      selection: {
        select: { type: 'interval', empty: 'none' },
      },
      mark: {
        type: 'point',
        stroke: null,
      },
      encoding: {
        fill: {
          condition: [
            { selection: 'select', value: selectionColor },
            { test: 'inSetStore(data("set_store"), datum.e)', value: selectionColor },
            ...(props.queries ?? []).map((query, i) => ({
              test: `inSetStore(data("q${i}_store"), datum.e)`,
              value: query.color,
            })),
          ],
          value: color,
        },
        x: {
          field: 'x',
          type: 'quantitative',
          title: xName,
        },
        y: {
          field: 'y',
          type: 'quantitative',
          title: yName,
        },
      },
    };
  }, [xName, yName, title, description, selectionColor, color, props.queries]);

  return (
    <VegaLite
      spec={spec}
      patch={patchSpec}
      signalListeners={listeners}
      data={data}
      width={width}
      height={height}
      theme={theme === 'dark' ? 'dark' : undefined}
      onNewView={(view) => {
        (viewRef as MutableRefObject<View>).current = view;
      }}
    />
  );
}
