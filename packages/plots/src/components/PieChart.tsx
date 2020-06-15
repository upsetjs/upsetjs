/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { VegaLite } from 'react-vega';
import { UpSetPlotProps, fillDefaults, UpSetThemes } from '../interfaces';
import { TopLevelSpec } from 'vega-lite';
import { useVegaHooks, countQueryExpression, countSelectedExpression } from './functions';
import { useVegaAggregatedGroupSelection } from '../selections';
import { LayerSpec, UnitSpec } from 'vega-lite/build/src/spec';

export interface PieChartProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;
  actions?: boolean;

  innerRadius?: number;

  elems: ReadonlyArray<T>;
  toElemKey?: (elem: T) => string;
  attr: keyof T | ((v: T) => string);
  label?: string;
}

function generateLayer(
  expr: string,
  color: string,
  secondary: boolean,
  theme?: UpSetThemes,
  innerRadius?: number
): LayerSpec | UnitSpec {
  return {
    mark: {
      type: 'arc',
      tooltip: false,
      innerRadius,
    },
    encoding: {
      theta: {
        field: `i_sum_start`,
        type: 'quantitative',
        title: null,
      },
      theta2: {
        datum: {
          signal: `datum.i_sum_start + ${expr}`,
        },
        type: 'quantitative',
        title: null,
      },
      ...(!secondary
        ? {
            color: { value: color },
            stroke: {
              field: 'v',
              type: 'nominal',
              title: null,
              legend: null,
              scale: {
                scheme: theme === 'dark' ? 'dark2' : 'set2',
              },
            },
          }
        : {
            stroke: {
              value: color,
            },
            color: { value: color },
            fillOpacity: { value: 0.3 },
          }),
    },
  };
}

export default function PieChart<T>(props: PieChartProps<T>): React.ReactElement<any, any> | null {
  const { title, description, selectionColor, theme } = fillDefaults(props);
  const { attr, elems, width, height, innerRadius, actions, toElemKey } = props;
  const name = props.label ?? typeof attr === 'function' ? 'v' : attr.toString();

  const data = useMemo(() => {
    const acc = typeof attr === 'function' ? attr : (v: T) => (v[attr] as unknown) as number;
    return { table: elems.map((e) => ({ e, i: 1, v: acc(e), k: toElemKey ? toElemKey(e) : e })) };
  }, [elems, attr, toElemKey]);

  const { viewRef, vegaProps } = useVegaHooks(toElemKey, props.queries, props.selection, true);

  const { selection, signalListeners, selectionName, hoverName } = useVegaAggregatedGroupSelection(
    viewRef,
    props.selection,
    name,
    props.onClick,
    props.onHover
  );

  const spec = useMemo((): TopLevelSpec => {
    return {
      title,
      description,
      data: {
        name: 'table',
      },
      transform: [
        {
          aggregate: [
            {
              op: 'values',
              as: 'values',
            },
            {
              op: 'sum',
              field: 'i',
              as: 'i_sum',
            },
          ],
          groupby: ['v'],
        },
        {
          stack: 'i_sum',
          as: ['i_sum_start', 'i_sum_end'],
          sort: [{ field: 'v', order: 'ascending' }],
          groupby: [],
        },
      ],
      layer: [
        {
          selection,
          mark: {
            type: 'arc',
            cursor: selectionName || hoverName ? 'pointer' : undefined,
            tooltip: true,
            innerRadius,
          },
          encoding: {
            color: {
              condition: [
                hoverName ? [{ selection: hoverName, value: selectionColor }] : [],
                selectionName ? [{ selection: selectionName, value: selectionColor }] : [],
              ].flat(),
              field: 'v',
              type: 'nominal',
              title: name,
              scale: {
                scheme: theme === 'dark' ? 'dark2' : 'set2',
              },
              // value: color,
            },
            theta: {
              field: 'i_sum',
              type: 'quantitative',
              title: 'Count',
            },
          },
        },
        generateLayer(countSelectedExpression(), selectionColor, false, theme, innerRadius),
        ...(props.queries ?? []).map((q, i) =>
          generateLayer(
            countQueryExpression(i),
            q.color,
            i > 0 || hoverName != null || selectionName != null,
            theme,
            innerRadius
          )
        ),
      ],
      resolve: {
        scale: {
          theta: 'shared',
        },
      },
    };
  }, [
    name,
    title,
    description,
    selectionColor,
    props.queries,
    selection,
    selectionName,
    hoverName,
    innerRadius,
    theme,
  ]);

  return (
    <VegaLite
      spec={spec}
      width={width}
      height={height}
      data={data}
      signalListeners={signalListeners}
      theme={theme === 'dark' ? 'dark' : undefined}
      actions={actions}
      {...vegaProps}
    />
  );
}
