/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { VegaLite } from 'react-vega';
import { TopLevelSpec } from 'vega-lite';
import { fillDefaults, UpSetPlotProps } from '../interfaces';
import { useVegaIntervalSelection } from '../selections';
import { areQueriesTests, isSelectedTest, useVegaHooks } from './functions';

export interface ScatterplotProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;

  elems: ReadonlyArray<T>;
  xLabel?: string;
  xAttr: keyof T | ((v: T) => number);
  yLabel?: string;
  yAttr: keyof T | ((v: T) => number);
}

export default function Scatterplot<T>(props: ScatterplotProps<T>) {
  const { title, description, selectionColor, color, theme } = fillDefaults(props);
  const { xAttr, yAttr, elems, width, height } = props;
  const xName = props.xLabel ?? typeof xAttr === 'function' ? 'x' : xAttr.toString();
  const yName = props.yLabel ?? typeof yAttr === 'function' ? 'y' : yAttr.toString();

  const table = useMemo(() => {
    const xAcc = typeof xAttr === 'function' ? xAttr : (v: T) => (v[xAttr] as unknown) as number;
    const yAcc = typeof yAttr === 'function' ? yAttr : (v: T) => (v[yAttr] as unknown) as number;
    return elems.map((e) => ({ e, x: xAcc(e), y: yAcc(e) }));
  }, [elems, xAttr, yAttr]);

  const { viewRef, vegaProps } = useVegaHooks(table, props.queries, props.selection);

  const { signalListeners, selection, selectionName } = useVegaIntervalSelection(
    viewRef,
    props.selection,
    xName,
    yName,
    props.onClick
  );

  const spec = useMemo((): TopLevelSpec => {
    return {
      title,
      description,
      data: { name: 'table' },
      selection,
      mark: {
        type: 'point',
        stroke: null,
      },
      encoding: {
        fill: {
          condition: [
            selectionName ? [{ selection: selectionName, value: selectionColor }] : [],
            isSelectedTest(selectionColor),
            areQueriesTests(props.queries),
          ].flat(),
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
  }, [xName, yName, title, description, selectionColor, color, props.queries, selection, selectionName]);

  return (
    <VegaLite
      spec={spec}
      signalListeners={signalListeners}
      width={width}
      height={height}
      theme={theme === 'dark' ? 'dark' : undefined}
      {...vegaProps}
    />
  );
}
