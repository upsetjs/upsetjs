/**
 * @upsetjs/plots
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { ISetComposite, ISetLike, validators } from '@upsetjs/react';
import { VegaLite } from 'react-vega';
import { UpSetPlotProps, fillDefaults, IUpSetSelection } from '../interfaces';
import throttle from 'lodash.throttle';

export interface IScatterplotSetComposite<T> extends ISetComposite<T> {
  subType: 'scatterplot';
  readonly x: [number, number];
  readonly y: [number, number];
}

function isScatterplotSetComposite<T>(s?: IUpSetSelection<T>): s is IScatterplotSetComposite<T> {
  return (
    s != null &&
    validators.isSetLike(s) &&
    s.type === 'composite' &&
    (s as IScatterplotSetComposite<T>).subType === 'scatterplot'
  );
}

export function createScatterplotSetComposite<T>(
  name: string,
  elems: ReadonlyArray<T>,
  x: [number, number],
  y: [number, number]
): IScatterplotSetComposite<T> {
  return {
    name,
    type: 'composite',
    subType: 'scatterplot',
    cardinality: elems.length,
    degree: 0,
    elems,
    sets: new Set(),
    x,
    y,
  };
}

export interface ScatterplotProps<T> extends UpSetPlotProps<T> {
  width: number;
  height: number;

  xAttr: keyof T | ((v: T) => number);
  yAttr: keyof T | ((v: T) => number);
  elems: ReadonlyArray<T>;
}

export default function Scatterplot<T>(props: ScatterplotProps<T>) {
  const full = fillDefaults(props);
  const { xAttr, yAttr, elems, width, height } = props;
  const xName = typeof xAttr === 'function' ? 'x' : xAttr.toString();
  const yName = typeof yAttr === 'function' ? 'y' : yAttr.toString();

  const data = useMemo(() => {
    const xAcc = typeof xAttr === 'function' ? xAttr : (v: T) => v[xAttr];
    const yAcc = typeof yAttr === 'function' ? yAttr : (v: T) => v[yAttr];
    return { table: elems.map((e) => ({ e, x: xAcc(e), y: yAcc(e) })) };
  }, [elems, xAttr, yAttr]);

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
        const elems = data.table
          .filter((d) => d.x >= brush.x[0] && d.x <= brush.x[1] && d.y >= brush.y[0] && d.y <= brush.y[1])
          .map((e) => e.e);
        const set = createScatterplotSetComposite(
          `Brush (${xName}: ${brush.x}, ${yName}: ${brush.y})`,
          elems,
          brush.x,
          brush.y
        );
        onClick(set);
      }, 200);
    }
    return r;
  }, [onClick, data.table, xName, yName]);

  const init = isScatterplotSetComposite(props.selection) ? { x: props.selection.x, y: props.selection.y } : undefined;

  return (
    <VegaLite
      spec={{
        title: full.title,
        description: full.description,
        selection: {
          select: { type: 'interval', empty: 'none', init },
        },
        mark: {
          type: 'point',
        },
        encoding: {
          fill: {
            condition: { selection: 'select', value: full.selectionColor },
            value: full.color,
          },
          x: {
            field: 'x',
            type: 'quantitative',
          },
          y: {
            field: 'y',
            type: 'quantitative',
          },
        },
        data: { name: 'table' },
      }}
      signalListeners={listeners}
      data={data}
      width={width}
      height={height}
      theme={full.theme === 'dark' ? 'dark' : undefined}
    />
  );
}
