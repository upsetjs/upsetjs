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

  const data = useMemo(() => {
    const xAcc = typeof xAttr === 'function' ? xAttr : (v: T) => (v[xAttr] as unknown) as number;
    const yAcc = typeof yAttr === 'function' ? yAttr : (v: T) => (v[yAttr] as unknown) as number;
    return { table: elems.map((e) => ({ e, x: xAcc(e), y: yAcc(e) })) };
  }, [elems, xAttr, yAttr]);

  const { viewRef, vegaProps } = useVegaHooks(props.queries, props.selection);

  const { signalListeners, selection, selectionName, hoverName } = useVegaIntervalSelection(
    viewRef,
    props.selection,
    xName,
    yName,
    props.onClick,
    props.onHover
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
        cursor: hoverName ? 'pointer' : undefined,
        tooltip: true,
      },
      encoding: {
        fill: {
          condition: [
            hoverName ? [{ selection: hoverName, value: selectionColor }] : [],
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
  }, [xName, yName, title, description, selectionColor, color, props.queries, selection, selectionName, hoverName]);

  return (
    <VegaLite
      spec={spec}
      signalListeners={signalListeners}
      width={width}
      height={height}
      data={data}
      theme={theme === 'dark' ? 'dark' : undefined}
      {...vegaProps}
    />
  );
}
