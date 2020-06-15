/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { VegaLite } from 'react-vega';
import { UpSetPlotProps, fillDefaults } from '../interfaces';
import { TopLevelSpec } from 'vega-lite';
import { areQueriesTests, isSelectedTest, useVegaHooks } from './functions';
import { useVegaMultiSelection } from '../selections/single';

export interface BarChartProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;
  actions?: boolean;

  /**
   * @default vertical
   */
  orientation?: 'horizontal' | 'vertical';

  elems: ReadonlyArray<T>;
  toElemKey?: (elem: T) => string;

  iLabel?: string;
  iAttr: keyof T | ((v: T) => string);
  vLabel?: string;
  vAttr: keyof T | ((v: T) => number);
}

export default function BarChart<T>(props: BarChartProps<T>): React.ReactElement<any, any> | null {
  const { title, description, selectionColor, color, theme } = fillDefaults(props);
  const { vAttr, iAttr, elems, width, height, orientation = 'vertical', actions, toElemKey } = props;
  const iAxis = orientation === 'horizontal' ? 'y' : 'x';
  const vAxis = orientation === 'horizontal' ? 'x' : 'y';
  const vName = props.vLabel ?? typeof vAttr === 'function' ? 'v' : vAttr.toString();
  const iName = props.iLabel ?? typeof iAttr === 'function' ? 'i' : iAttr.toString();

  const data = useMemo(() => {
    const vAcc = typeof vAttr === 'function' ? vAttr : (v: T) => (v[vAttr] as unknown) as number;
    const iAcc = typeof iAttr === 'function' ? iAttr : (v: T) => (v[iAttr] as unknown) as string;
    return { table: elems.map((e) => ({ e, v: vAcc(e), i: iAcc(e), k: toElemKey ? toElemKey(e) : e })) };
  }, [elems, vAttr, iAttr, toElemKey]);

  const { viewRef, vegaProps } = useVegaHooks(toElemKey, props.queries, props.selection, true);

  const { signalListeners, selection, selectionName, hoverName } = useVegaMultiSelection(
    'multi',
    viewRef,
    toElemKey,
    props.selection,
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
        type: 'bar',
        stroke: null,
        cursor: hoverName ? 'pointer' : undefined,
        tooltip: true,
      },
      encoding: {
        fill: {
          condition: ([
            hoverName && { selection: hoverName, value: selectionColor },
            selectionName && { selection: selectionName, value: selectionColor },
            isSelectedTest(selectionColor),
            ...areQueriesTests(props.queries),
          ] as any[]).filter(Boolean),
          value: color,
        },
        [iAxis]: {
          field: 'i',
          type: 'nominal',
          title: iName,
          axis: { labelAngle: 0 },
        },
        [vAxis]: {
          field: 'v',
          type: 'quantitative',
          title: vName,
        },
      },
    };
  }, [
    iName,
    vName,
    title,
    description,
    selectionColor,
    color,
    props.queries,
    selection,
    selectionName,
    hoverName,
    iAxis,
    vAxis,
  ]);

  return (
    <VegaLite
      spec={spec}
      signalListeners={signalListeners}
      width={width}
      height={height}
      data={data}
      theme={theme === 'dark' ? 'dark' : undefined}
      actions={actions}
      {...vegaProps}
    />
  );
}
