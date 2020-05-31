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
import { useVegaBinSelection } from '../selections';

export interface HistogramProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;
  actions?: boolean;

  elems: ReadonlyArray<T>;
  attr: keyof T | ((v: T) => number);
  label?: string;
}

function generateLayer(attr: string, color: string, secondary = false) {
  return {
    mark: !secondary
      ? {
          type: 'bar' as 'bar',
          tooltip: false,
        }
      : {
          type: 'point' as 'point',
          shape: 'triangle-right',
          tooltip: false,
        },
    encoding: {
      color: {
        value: color,
      },
      x: {
        bin: true,
        field: 'v',
        band: secondary ? 0 : undefined,
        type: 'quantitative' as 'quantitative',
      },
      y: {
        aggregate: 'sum' as 'sum',
        field: attr,
        type: 'quantitative' as 'quantitative',
        title: false,
      },
    },
  };
}

export default function Histogram<T>(props: HistogramProps<T>): React.ReactElement<any, any> | null {
  const { title, description, selectionColor, color, theme } = fillDefaults(props);
  const { attr, elems, width, height, actions } = props;
  const name = props.label ?? typeof attr === 'function' ? 'v' : attr.toString();

  const data = useMemo(() => {
    const acc = typeof attr === 'function' ? attr : (v: T) => (v[attr] as unknown) as number;
    return { table: elems.map((e) => ({ e, i: 1, v: acc(e) })) };
  }, [elems, attr]);

  const { viewRef, vegaProps } = useVegaHooks(props.queries, props.selection, true);

  const { selection, signalListeners, selectionName, hoverName } = useVegaBinSelection(
    viewRef,
    props.selection,
    name,
    props.onClick,
    props.onHover,
    {
      binData:
        props.queries && (props.queries.length > 1 || (props.queries.length === 1 && (props.onClick || props.onHover)))
          ? 'data_4'
          : 'data_1',
    }
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
      ],
      layer: [
        {
          selection,
          mark: {
            type: 'bar',
            cursor: selectionName || hoverName ? 'pointer' : undefined,
            tooltip: true,
          },
          encoding: {
            color: {
              condition: [
                hoverName ? [{ selection: hoverName, value: selectionColor }] : [],
                selectionName ? [{ selection: selectionName, value: selectionColor }] : [],
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
        generateLayer('s', selectionColor),
        ...(props.queries ?? []).map((q, i) =>
          generateLayer(`q${i}`, q.color, i > 0 || hoverName != null || selectionName != null)
        ),
      ],
    };
  }, [name, title, description, selectionColor, color, props.queries, selection, selectionName, hoverName]);

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
