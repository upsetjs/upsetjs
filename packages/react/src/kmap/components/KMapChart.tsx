/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import D3Axis from '../../components/D3Axis';
import { Handlers } from '../../hooks/useHandler';
import { clsx } from '../../utils';
import { KMapDataInfo } from '../derive/deriveDataDependent';
import { KMapStyleInfo } from '../derive/deriveStyleDependent';
import KMapCell from './KMapCell';
import { VennDiagramSizeInfo } from '../../venn/derive/deriveVennSizeDependent';

function generateGridPath<T>(data: KMapDataInfo<T>) {
  const x = data.grid.x;
  const y = data.grid.y;
  const x2 = x + data.cell * data.grid.hCells;
  const y2 = y + data.cell * data.grid.vCells;
  let p = `M${x},${y} L${x2},${y} L${x2},${y2} L${x},${y2} L${x},${y}`;
  // generate grid lines
  for (let i = 1; i < data.grid.hCells; i++) {
    p += ` M${x + data.cell * i},${y} l0,${y2 - y}`;
  }
  for (let i = 1; i < data.grid.vCells; i++) {
    p += ` M${x},${y + data.cell * i} l${x2 - x},0`;
  }
  return p;
}

export default React.memo(function KMapChart<T>({
  data,
  style,
  size,
  h,
}: {
  style: KMapStyleInfo;
  data: KMapDataInfo<T>;
  size: VennDiagramSizeInfo;
  h: Handlers;
}) {
  const grid = generateGridPath(data);
  const csNameOffset = style.cs.offset === 'auto' ? data.cs.labelOffset : style.cs.offset;
  return (
    <>
      <g transform={`translate(${size.w - csNameOffset - 2}, ${size.h - data.cell - 50})`}>
        <D3Axis scale={data.cs.scale} orient="left" size={data.cell} shift={data.cs.barLabelFontSize} style={style} />
        <text
          className={clsx(`cChartTextStyle-${style.id}`, style.classNames.chartLabel)}
          style={style.styles.chartLabel}
          transform={`translate(${-csNameOffset}, ${data.cell})rotate(-90)`}
        >
          {style.cs.name}
        </text>
      </g>
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
          <g key={name}>
            {l.notText.map((p, i) => (
              <text
                key={i}
                transform={`translate(${p.x},${p.y})${!l.hor ? 'rotate(-90)' : ''}`}
                className={clsx(`setTextStyle-${style.id}`, `not-${style.id}`)}
              >
                {name}
              </text>
            ))}
          </g>
        );
      })}
      <g className={clsx(h.hasClick && `clickAble-${style.id}`)}>
        {data.cs.v.map((c, i) => {
          return <KMapCell key={data.cs.keys[i]} d={c} i={i} h={h} style={style} data={data} />;
        })}
      </g>
      <path d={grid} className={`gridStyle-${style.id}`} />
    </>
  );
});
