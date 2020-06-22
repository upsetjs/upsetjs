/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { isSet } from '@upsetjs/model';
import React, { forwardRef, Ref, useMemo } from 'react';
import ExportButtons from '../components/ExportButtons';
import QueryLegend from '../components/QueryLegend';
import UpSetTitle from '../components/UpSetTitle';
import { fillKarnaughMapDefaults } from '../fillDefaults';
import { KarnaughMapProps } from '../interfaces';
import { clsx } from '../utils';
import { useCreateCommon, useExportChart } from '../venn/hooks';
import VennArcSliceSelection from './components/KMapCell';
import deriveVennDataDependent from './derive/deriveVennDataDependent';

const KarnaughMap = forwardRef(function KarnaughMap<T = any>(props: KarnaughMapProps<T>, ref: Ref<SVGSVGElement>) {
  const p = fillKarnaughMapDefaults<T>(props);
  const { selection = null, queries = [], fontSizes } = p;
  const {
    styleId,
    sizeInfo,
    styleInfo,
    h,
    selectionKey,
    selectionName,
    selectionOverlap,
    exportButtonsPatch,
    qs,
    rulesHelper,
  } = useCreateCommon(p);

  const dataInfo = useMemo(
    () =>
      deriveVennDataDependent(p.sets, p.combinations, sizeInfo, p.layout, p.valueFormat, p.toKey, p.toElemKey, p.id),
    [p.sets, p.combinations, sizeInfo, p.valueFormat, p.toKey, p.toElemKey, p.id, p.layout]
  );

  const exportChart = useExportChart(dataInfo, p);

  const rules = `
  ${rulesHelper.root}
  ${rulesHelper.text}

  .valueTextStyle-${styleId} {
    fill: ${p.valueTextColor};
    ${rulesHelper.p(fontSizes.valueLabel)}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .setTextStyle-${styleId} {
    fill: ${p.textColor};
    ${rulesHelper.p(fontSizes.setLabel)}
    text-anchor: middle;
    dominant-baseline: central;
  }

  .stroke-circle-${styleId} {
    fill: none;
    stroke: ${p.strokeColor};
  }

  .arc-${styleId} {
    fill-rule: evenodd;
  }
  .arcP-${styleId} {
    fill: transparent;
    fill-opacity: ${p.opacity};
  }
  ${rulesHelper.fill}
  ${rulesHelper.export}

  ${rulesHelper.hasSFill ? `.root-${styleId}[data-selection] .arcP-${styleId} { ${rulesHelper.hasSFill} }` : ''}

  ${queries
    .map(
      (q, i) => `.fillQ${i}-${dataInfo.id} {
    fill: ${q.color};
  }`
    )
    .join('\n')}
  `;

  return (
    <svg
      id={p.id}
      className={clsx(`root-${styleId}`, p.className)}
      style={p.style}
      width={p.width}
      height={p.height}
      ref={ref}
      viewBox={`0 0 ${p.width} ${p.height}`}
      data-theme={p.theme ?? 'light'}
      data-selection={selectionName ? selectionName : undefined}
    >
      <style>{rules}</style>
      {p.queryLegend && <QueryLegend queries={queries} x={sizeInfo.legend.x} style={styleInfo} data={dataInfo} />}
      <ExportButtons
        transform={`translate(${sizeInfo.w - 2},${sizeInfo.h - 3})`}
        styleId={styleId}
        exportButtons={exportButtonsPatch}
        exportChart={exportChart}
      />
      <g transform={`translate(${p.padding},${p.padding})`} data-upset="base">
        {p.onClick && (
          <rect width={sizeInfo.w} height={sizeInfo.h} onClick={h.reset} className={`fillTransparent-${styleId}`} />
        )}
        <UpSetTitle style={styleInfo} width={sizeInfo.area.w} />
        <g className={clsx(p.onClick && `clickAble-${styleInfo.id}`)}>
          {dataInfo.sets.d.map((d, i) => (
            <text
              key={d.key}
              x={d.l.text.x}
              y={d.l.text.y}
              onClick={h.onClick(dataInfo.sets.v[i], [])}
              onMouseEnter={h.onMouseEnter(dataInfo.sets.v[i], [])}
              onMouseLeave={h.onMouseLeave}
              onContextMenu={h.onContextMenu(dataInfo.sets.v[i], [])}
              onMouseMove={h.onMouseMove(dataInfo.sets.v[i], [])}
              className={clsx(
                `setTextStyle-${styleInfo.id}`,
                d.l.angle > 200 && `endText-${styleInfo.id}`,
                d.l.angle < 200 && `startText-${styleInfo.id}`
              )}
            >
              {dataInfo.sets.v[i].name}
            </text>
          ))}
        </g>
        <g className={clsx(p.onClick && `clickAble-${styleInfo.id}`)}>
          {dataInfo.cs.d.map((l, i) => (
            <VennArcSliceSelection
              key={l.key}
              d={l.v}
              i={i}
              slice={l.l}
              size={sizeInfo}
              style={styleInfo}
              data={dataInfo}
              h={h}
              selectionName={selectionName}
              selected={selectionKey === l.key || (isSet(selection) && dataInfo.cs.has(l.v, selection))}
              elemOverlap={selectionOverlap}
              queries={queries}
              qs={qs}
            />
          ))}
        </g>
        <g>
          {dataInfo.sets.d.map((l) => (
            <circle
              key={l.key}
              cx={l.l.cx}
              cy={l.l.cy}
              r={l.l.r}
              className={clsx(`stroke-circle-${styleInfo.id}`, styleInfo.classNames.set)}
              style={styleInfo.styles.set}
            />
          ))}
        </g>
      </g>
      {props.children}
    </svg>
  );
});

export { KarnaughMap };
