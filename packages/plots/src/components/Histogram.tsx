/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { TopLevelSpec } from 'vega-lite';
import { VegaLite } from 'react-vega';
import { UpSetPlotProps } from '../interfaces';

export interface HistogramProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;

  attr: keyof T | ((v: T) => number);
  elems: ReadonlyArray<T>;
}

export default function Histogram<T>({ theme, attr, elems, width, height }: HistogramProps<T>) {
  const spec: TopLevelSpec = {
    mark: 'bar',
    encoding: {
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
  };
  const barData = {
    table: typeof attr !== 'function' ? elems : elems.map((e) => ({ e, v: attr(e) })),
  };
  return (
    <VegaLite spec={spec} data={barData} width={width} height={height} theme={theme === 'dark' ? 'dark' : undefined} />
  );
}
