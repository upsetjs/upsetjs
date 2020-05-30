/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { VegaLite } from 'react-vega';
import { UpSetPlotProps, fillDefaults } from '../interfaces';

export interface HistogramProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;

  attr: keyof T | ((v: T) => number);
  elems: ReadonlyArray<T>;
}

export default function Histogram<T>(props: HistogramProps<T>) {
  const full = fillDefaults(props);
  const { attr, elems, width, height } = props;
  const data = {
    table: typeof attr !== 'function' ? elems : elems.map((e) => ({ e, v: attr(e) })),
  };
  const listeners = useMemo(() => {
    return {
      select: (type: string, item: unknown) => {
        console.log(type, item);
      },
      select_tuple: (type: string, item: unknown) => {
        console.log(type, item);
      },
      highlight: (type: string, item: unknown) => {
        console.log(type, item);
      },
      highlight_tuple: (type: string, item: unknown) => {
        console.log(type, item);
      },
    };
  }, []);
  return (
    <VegaLite
      spec={{
        title: full.title,
        description: full.description,
        selection: {
          highlight: { type: 'single', empty: 'none', on: 'mouseover' },
          select: { type: 'single', empty: 'none' },
        },
        mark: {
          type: 'bar',
          cursor: 'pointer',
        },
        encoding: {
          color: {
            condition: { selection: 'select', value: full.selectionColor },
            value: full.color,
          },
          x: {
            bin: true,
            field: typeof attr !== 'function' ? attr.toString() : 'v',
            type: 'quantitative',
          },
          y: {
            aggregate: 'count',
            type: 'quantitative',
          },
        },
        data: { name: 'table' },
      }}
      data={data}
      width={width}
      height={height}
      theme={full.theme === 'dark' ? 'dark' : undefined}
      signalListeners={listeners}
    />
  );
}
