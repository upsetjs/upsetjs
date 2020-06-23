/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React, { forwardRef, Ref, useMemo } from 'react';
import { fillKarnaughMapDefaults } from '../fillDefaults';
import { KarnaughMapProps } from '../interfaces';
import SVGWrapper from '../venn/components/SVGWrapper';
import { useCreateCommon } from '../venn/hooks';
import deriveKarnaughDataDependent, { KarnaughMapDataInfo } from './derive/deriveKarnaughDataDependent';
import { clsx } from '../utils';
import useHandler from '../hooks/useHandler';

function generateGridPath<T>(data: KarnaughMapDataInfo<T>) {
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

const KarnaughMap = forwardRef(function KarnaughMap<T = any>(props: KarnaughMapProps<T>, ref: Ref<SVGSVGElement>) {
  const p = fillKarnaughMapDefaults<T>(props);
  const { queries = [], fontSizes } = p;
  // selection = null,
  const v = useCreateCommon(p);
  const { size, style, rulesHelper } = v;

  const data = useMemo(
    () => deriveKarnaughDataDependent(p.sets, p.combinations, size, p.numericScale, p.toKey, p.toElemKey, p.id),
    [p.sets, p.combinations, size, p.numericScale, p.toKey, p.toElemKey, p.id]
  );

  const rules = `
  ${rulesHelper.root}
  ${rulesHelper.text}

  .valueTextStyle-${style.id} {
    fill: ${p.valueTextColor};
    ${rulesHelper.p(fontSizes.valueLabel)}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .setTextStyle-${style.id} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.setLabel)}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .verticalText-${style.id} {
    transform: rotate(-90)
  }

  .not {
    font-weight: bold;
  }

  .gridStyle-${style.id} {
    fill: none;
    stroke: ${p.strokeColor};
  }

  ${rulesHelper.fill}
  ${rulesHelper.export}

  ${queries
    .map(
      (q, i) => `.fillQ${i}-${data.id} {
    fill: ${q.color};
  }`
    )
    .join('\n')}
  `;

  const grid = generateGridPath(data);

  const h = useHandler(p);

  return (
    <SVGWrapper p={p} v={v} data={data} rules={rules} tRef={ref}>
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
            className={clsx(p.onClick && `clickAble-${style.id}`)}
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
                className={clsx(`setTextStyle-${style.id}`, 'not')}
              >
                {name}
              </text>
            ))}
          </g>
        );
      })}
      <g className={clsx(p.onClick && `clickAble-${style.id}`)}>
        {data.cs.l.map((l, i) => {
          const c = data.cs.v[i];
          const hi = data.cs.scale(c);
          return (
            <g
              key={c.name}
              onClick={h.onClick(c, [])}
              onMouseEnter={h.onMouseEnter(c, [])}
              onMouseLeave={h.onMouseLeave}
              onContextMenu={h.onContextMenu(c, [])}
              onMouseMove={h.onMouseMove(c, [])}
            >
              {p.tooltips && (
                <title>
                  {c.name}: {data.sets.format(c.cardinality)}
                </title>
              )}
              <rect
                x={l.x - data.cell / 2}
                y={l.y - data.cell / 2}
                width={data.cell}
                height={data.cell}
                className={`fillTransparent-${style.id}`}
              />
              <rect
                x={l.x - data.cell / 2 + 1}
                y={l.y + data.cell / 2 - hi}
                width={data.cell - 2}
                height={hi}
                className={`fillPrimary-${style.id}`}
              />
              {/* <text x={l.x} y={l.y} width={data.cell} height={data.cell} className={`valueTextStyle-${style.id}`}>
                {data.cs.v[i].cardinality.toLocaleString()}
              </text> */}
            </g>
          );
        })}
      </g>
      <path d={grid} className={`gridStyle-${style.id}`} />
    </SVGWrapper>
  );
});

export { KarnaughMap };
