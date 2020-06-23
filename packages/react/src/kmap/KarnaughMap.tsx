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
import D3Axis from '../components/D3Axis';
import deriveKarnaughDataDependent, { KMapDataInfo } from './derive/deriveDataDependent';
import deriveKarnaughStyleDependent, { KMapStyleInfo } from './derive/deriveStyleDependent';
import { clsx, generateId, isSetLike, generateSelectionOverlap, generateSelectionName, parseFontSize } from '../utils';
import useHandler from '../hooks/useHandler';
import deriveVennSizeDependent from '../venn/derive/deriveVennSizeDependent';
import { queryOverlap } from '../../../model/dist';
import { baseRules } from '../rules';
import { useExportChart } from '../venn/hooks';

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

const KarnaughMap = forwardRef(function KarnaughMap<T = any>(props: KarnaughMapProps<T>, ref: Ref<SVGSVGElement>) {
  const p = fillKarnaughMapDefaults<T>(props);
  const { queries = [], fontSizes, selection = null } = p;
  // generate a "random" but attribute stable id to avoid styling conflicts
  const styleId = useMemo(
    () =>
      p.id
        ? p.id
        : generateId([
            p.fontFamily,
            fontSizes.axisTick,
            fontSizes.barLabel,
            fontSizes.legend,
            fontSizes.setLabel,
            fontSizes.title,
            fontSizes.exportLabel,
            fontSizes.description,
            p.textColor,
            p.color,
            p.hasSelectionColor,
            p.strokeColor,
            p.selectionColor,
            p.opacity,
            p.hasSelectionOpacity,
          ]),
    [
      p.id,
      p.fontFamily,
      fontSizes.axisTick,
      fontSizes.barLabel,
      fontSizes.legend,
      fontSizes.setLabel,
      fontSizes.title,
      fontSizes.exportLabel,
      fontSizes.description,
      p.textColor,
      p.color,
      p.hasSelectionColor,
      p.strokeColor,
      p.selectionColor,
      p.opacity,
      p.hasSelectionOpacity,
    ]
  );

  const style = useMemo(
    () =>
      deriveKarnaughStyleDependent(
        p.theme,
        p.styles,
        p.classNames,
        styleId,
        p.barLabelOffset,
        p.selectionColor,
        p.emptySelection,
        p.title,
        p.description,
        p.tooltips
      ),
    [
      p.theme,
      p.styles,
      p.classNames,
      styleId,
      p.barLabelOffset,
      p.selectionColor,
      p.emptySelection,
      p.title,
      p.description,
      p.tooltips,
    ]
  );

  const size = useMemo(() => deriveVennSizeDependent(p.width, p.height, p.padding, p.id), [
    p.width,
    p.height,
    p.padding,
    p.id,
  ]);

  const data = useMemo(
    () =>
      deriveKarnaughDataDependent(
        p.sets,
        p.combinations,
        size,
        p.numericScale,
        p.barLabelOffset + parseFontSize(fontSizes.barLabel),
        p.barPadding,
        parseFontSize(fontSizes.setLabel),
        parseFontSize(fontSizes.axisTick),
        p.toKey,
        p.toElemKey,
        p.id
      ),
    [
      p.sets,
      p.combinations,
      size,
      p.numericScale,
      p.barLabelOffset,
      fontSizes.barLabel,
      p.barPadding,
      fontSizes.axisTick,
      fontSizes.setLabel,
      p.toKey,
      p.toElemKey,
      p.id,
    ]
  );

  const h = useHandler(p);
  const selectionKey = selection != null && isSetLike(selection) ? p.toKey(selection) : null;
  const selectionOverlap = selection == null ? null : generateSelectionOverlap(selection, p.toElemKey);
  const selectionName = generateSelectionName(selection);
  const qs = React.useMemo(() => queries.map((q) => queryOverlap(q, 'intersection', p.toElemKey)), [
    queries,
    p.toElemKey,
  ]);

  const exportButtons = useMemo(
    () =>
      !p.exportButtons ? false : Object.assign({}, p.exportButtons === true ? {} : p.exportButtons, { vega: false }),
    [p.exportButtons]
  );

  const rulesHelper = baseRules(styleId, p, p.fontFamily, fontSizes);

  const rules = `
  ${rulesHelper.root}
  ${rulesHelper.text}

  .axisTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.axisTick)}
    text-anchor: middle;
  }
  .barTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.barLabel)}
    text-anchor: middle;
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

  .not-${style.id} {
    font-weight: bold;
  }
  .axisLine-${styleId} {
    fill: none;
    stroke: ${p.textColor};
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
  const exportChart = useExportChart(data, p);

  return (
    <SVGWrapper
      rules={rules}
      style={style}
      size={size}
      p={p}
      data={data}
      tRef={ref}
      selectionName={selectionName}
      h={h}
      exportChart={exportChart}
    >
      <D3Axis scale={data.cs.scale} orient="left" size={data.cell} shift={0} style={style} />
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
          const hi = data.cs.scale(c.cardinality);
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
