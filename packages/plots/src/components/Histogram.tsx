/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { VegaLite } from 'react-vega';
import { UpSetPlotProps, fillDefaults } from '../interfaces';
import type { TopLevelSpec } from 'vega-lite';
import { useVegaHooks, countSelectedExpression, countQueryExpression } from './functions';
import { useVegaBinSelection } from '../selections';
import type { UnitSpec, LayerSpec } from 'vega-lite/build/src/spec';
import type { Field } from 'vega-lite/build/src/channeldef';

export interface HistogramProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;
  actions?: boolean;

  elems: readonly T[];
  toElemKey?: (elem: T) => string;
  attr: keyof T | ((v: T) => number);
  label?: string;
}

function generateLayer(expr: string, color: string): UnitSpec<Field> | LayerSpec<Field> {
  return {
    transform: [
      {
        aggregate: [
          {
            op: 'values' as const,
            as: 'values',
          },
        ],
        groupby: ['bin_maxbins_10_v', 'bin_maxbins_10_v_end'],
      },
    ],
    mark: {
      type: 'bar' as const,
      tooltip: false,
    },
    encoding: {
      color: {
        value: color,
      },
      x: {
        bin: true,
        field: 'v',
        type: 'quantitative',
      },
      y: {
        datum: {
          signal: expr,
        },
        type: 'quantitative',
        title: null,
      },
      y2: {
        type: 'quantitative',
        datum: 0,
        title: null,
      },
    },
  };
}

function generateSecondaryLayer(expr: string, color: string): UnitSpec<Field> | LayerSpec<Field> {
  return {
    transform: [
      {
        aggregate: [
          {
            op: 'values' as const,
            as: 'values',
          },
        ],
        groupby: ['bin_maxbins_10_v', 'bin_maxbins_10_v_end'],
      },
    ],
    mark: {
      type: 'point',
      shape: 'triangle-right',
      tooltip: false,
    },
    encoding: {
      color: {
        value: color,
      },
      x: {
        bin: true,
        band: 0,
        field: 'v',
        type: 'quantitative',
      } as any,
      y: {
        datum: {
          signal: expr,
        },
        type: 'quantitative',
      },
    },
  };
}

export default function Histogram<T>(props: HistogramProps<T>): React.ReactElement<any, any> | null {
  const { title, description, selectionColor, color, theme } = fillDefaults(props);
  const { attr, elems, width, height, actions, toElemKey } = props;
  const name = props.label ?? typeof attr === 'function' ? 'v' : attr.toString();

  const data = useMemo(() => {
    const acc = typeof attr === 'function' ? attr : (v: T) => v[attr] as unknown as number;
    return { table: elems.map((e) => ({ e, i: 1, v: acc(e), k: toElemKey ? toElemKey(e) : e })) };
  }, [elems, attr, toElemKey]);

  const { viewRef, vegaProps } = useVegaHooks(toElemKey, props.queries, props.selection, true);

  const { params, signalListeners, paramName, hoverParamName } = useVegaBinSelection(
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
      layer: [
        {
          params,
          mark: {
            type: 'bar',
            cursor: paramName || hoverParamName ? 'pointer' : undefined,
            tooltip: true,
          },
          encoding: {
            color: {
              condition: [
                hoverParamName ? { param: hoverParamName, empty: false, value: selectionColor } : [],
                paramName ? { param: paramName, empty: false, value: selectionColor } : [],
              ].flat(),
              value: color,
            },
            x: {
              bin: true,
              field: 'v',
              type: 'quantitative',
              title: name,
            },
            y: {
              aggregate: 'sum',
              field: 'i',
              type: 'quantitative',
              title: 'Count',
            },
          },
        },
        generateLayer(countSelectedExpression(), selectionColor),
        ...(props.queries ?? []).map((q, i) =>
          i > 0 || paramName != null || hoverParamName != null
            ? generateSecondaryLayer(countQueryExpression(i), q.color)
            : generateLayer(countQueryExpression(i), q.color)
        ),
      ],
      resolve: {
        scale: {
          y: 'shared',
        },
      },
    };
  }, [name, title, description, selectionColor, color, props.queries, params, paramName, hoverParamName]);

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
