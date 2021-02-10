/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ReactElement } from 'react';
import Axis from '../../components/Axis';
import type { Handlers } from '../../hooks/useHandler';
import { clsx } from '../../utils';
import type { KMapDataInfo } from '../derive/deriveDataDependent';
import type { KMapStyleInfo } from '../derive/deriveStyleDependent';
import KMapCell from './KMapCell';
import type { VennDiagramSizeInfo } from '../../venn/derive/deriveVennSizeDependent';

export function generateGridPath(cell: number, vCells: number, hCells: number, level: { x: number[]; y: number[] }) {
  const h = cell * vCells;
  const w = cell * hCells;
  return [level.x.map((x) => `M ${x * cell},0 l0,${h}`), level.y.map((y) => `M 0,${y * cell} l${w},0`)]
    .flat()
    .join(' ');
}

export type KMapChartProps<T> = {
  style: KMapStyleInfo;
  data: KMapDataInfo<T>;
  size: VennDiagramSizeInfo;
  h: Handlers;
};

const KMapChart = /*!#__PURE__*/ React.memo(function KMapChart<T>({ data, style, size, h }: KMapChartProps<T>) {
  const csNameOffset = style.cs.offset === 'auto' ? data.cs.labelOffset : style.cs.offset;
  return (
    <g>
      <g transform={`translate(${size.w - csNameOffset - 2}, ${size.h - data.cell - 50})`}>
        <Axis scale={data.cs.scale} orient="left" size={data.cell} start={data.cs.barLabelFontSize} style={style} />
        <text
          className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${-csNameOffset}, ${data.cell})rotate(-90)`}
        >
          {style.cs.name}
        </text>
      </g>
      <g>
        {data.sets.l.map((l, i) => {
          const s = data.sets.v[i];
          const name = s.name;
          return (
            <g
              key={name}
              onClick={h.onClick(s, [])}
              onMouseEnter={h.onMouseEnter(s, [])}
              onMouseLeave={h.onMouseLeave}
              onContextMenu={h.onContextMenu(s, [])}
              onMouseMove={h.onMouseMove(s, [])}
              className={clsx(h.hasClick && `clickAble-${style.id}`)}
            >
              {l.text.map((p, i) => (
                <text
                  key={i}
                  transform={`translate(${p.x},${p.y})${!l.hor ? 'rotate(-90)' : ''}`}
                  className={clsx(`setTextStyle-${style.id}`)}
                >
                  {name}
                </text>
              ))}
            </g>
          );
        })}
        {data.sets.l.map((l, i) => {
          const name = data.sets.v[i].name;
          return (
            <React.Fragment key={name}>
              {l.notText.map((p, i) => (
                <text
                  key={i}
                  transform={`translate(${p.x},${p.y})${!l.hor ? 'rotate(-90)' : ''}`}
                  className={clsx(`setTextStyle-${style.id}`, `not-${style.id}`)}
                >
                  {name}
                </text>
              ))}
            </React.Fragment>
          );
        })}
      </g>
      <g className={clsx(h.hasClick && `clickAble-${style.id}`)}>
        {data.cs.v.map((c, i) => {
          return <KMapCell key={data.cs.keys[i]} d={c} i={i} h={h} style={style} data={data} />;
        })}
      </g>
      <g transform={`translate(${data.grid.x}, ${data.grid.y})`}>
        {data.grid.levels.map((l, i) => (
          <path
            key={i}
            d={generateGridPath(data.cell, data.grid.vCells, data.grid.hCells, l)}
            className={`gridStyle-${style.id} gridStyle-${style.id}-${i}`}
          />
        ))}
      </g>
    </g>
  );
});

export default KMapChart as <T>(props: KMapChartProps<T>) => ReactElement;
