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
import { useVegaHooks } from './functions';
import { useVegaAggregatedGroupSelection } from '../selections';

export interface PieChartProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;

  innerRadius?: number;

  elems: ReadonlyArray<T>;
  attr: keyof T | ((v: T) => string);
  label?: string;
}

function generateLayer(attr: string, color: string, secondary: boolean, innerRadius?: number) {
  return {
    mark: {
      type: 'arc' as 'arc',
      tooltip: false,
      innerRadius,
    },
    encoding: {
      theta: {
        field: `i_sum_start`,
        type: 'quantitative' as 'quantitative',
        title: false,
      },
      theta2: {
        field: `${attr}_sum_end`,
        type: 'quantitative' as 'quantitative',
        title: false,
      },
      ...(!secondary
        ? { color: { value: color } }
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
  const { attr, elems, width, height, innerRadius } = props;
  const name = props.label ?? typeof attr === 'function' ? 'v' : attr.toString();

  const data = useMemo(() => {
    const acc = typeof attr === 'function' ? attr : (v: T) => (v[attr] as unknown) as number;
    return { table: elems.map((e) => ({ e, i: 1, v: acc(e) })) };
  }, [elems, attr]);

  const { viewRef, vegaProps } = useVegaHooks(props.queries, props.selection, true);

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
        { calculate: 'inSetStore(upset_signal, datum.e) ? 1 : 0', as: 's' },
        ...(props.queries ?? []).map((_, i) => ({
          calculate: `inSetStore(upset_q${i}_signal, datum.e) ? 1 : 0`,
          as: `q${i}`,
        })),
        {
          aggregate: [
            {
              op: 'sum',
              field: 'i',
              as: 'i_sum',
            },
            {
              op: 'sum',
              field: 's',
              as: 's_sum',
            },
            ...(props.queries ?? []).map((_, i) => ({
              op: 'sum' as 'sum',
              field: `q${i}`,
              as: `q${i}_sum`,
            })),
          ],
          groupby: ['v'],
        },
        {
          stack: 'i_sum',
          as: ['i_sum_start', 'i_sum_end'],
          sort: [{ field: 'v', order: 'ascending' }],
          groupby: [],
        },
        {
          calculate: 'datum.i_sum_start + datum.s_sum',
          as: 's_sum_end',
        },
        ...(props.queries ?? []).map((_, i) => ({
          calculate: `datum.i_sum_start + datum.q${i}_sum`,
          as: `q${i}_sum_end`,
        })),
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
              // value: color,
            },
            theta: {
              field: 'i_sum',
              stack: true,
              type: 'quantitative',
              title: 'Count',
            },
          },
        },
        generateLayer('s', selectionColor, false, innerRadius),
        ...(props.queries ?? []).map((q, i) =>
          generateLayer(`q${i}`, q.color, i > 0 || hoverName != null || selectionName != null, innerRadius)
        ),
      ],
      resolve: {
        scale: {
          theta: 'shared',
        },
      },
    };
  }, [name, title, description, selectionColor, props.queries, selection, selectionName, hoverName, innerRadius]);

  return (
    <VegaLite
      spec={spec}
      width={width}
      height={height}
      data={data}
      signalListeners={signalListeners}
      theme={theme === 'dark' ? 'dark' : undefined}
      {...vegaProps}
    />
  );
}
