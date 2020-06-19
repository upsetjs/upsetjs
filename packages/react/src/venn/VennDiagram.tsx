/**
 * @upsetjs/react
 * https://github.com/components/components
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import { queryOverlap, isSet } from '@upsetjs/model';
import React, { forwardRef, Ref, useCallback, useMemo } from 'react';
import ExportButtons from '../components/ExportButtons';
import QueryLegend from '../components/QueryLegend';
import UpSetTitle from '../components/UpSetTitle';
import { wrap } from '../components/utils';
import { exportSVG } from '../exporter';
import { exportDump, exportSharedLink } from '../exporter/exportDump';
import { fillVennDiagramDefaults } from '../fillDefaults';
import { VennDiagramProps } from '../interfaces';
import { baseRules } from '../rules';
import { clsx, generateId, generateSelectionName, generateSelectionOverlap, isSetLike } from '../utils';
import VennArcSliceSelection from './components/VennArcSliceSelection';
import deriveVennDataDependent from './derive/deriveVennDataDependent';
import deriveVennSizeDependent from './derive/deriveVennSizeDependent';
import deriveVennStyleDependent from './derive/deriveVennStyleDependent';

const VennDiagram = forwardRef(function VennDiagram<T = any>(props: VennDiagramProps<T>, ref: Ref<SVGSVGElement>) {
  const p = fillVennDiagramDefaults<T>(props);
  const { selection = null, queries = [], fontSizes } = p;

  // generate a "random" but attribute stable id to avoid styling conflicts
  const styleId = useMemo(
    () =>
      p.id
        ? p.id
        : generateId([
            p.fontFamily,
            fontSizes.valueLabel,
            fontSizes.legend,
            fontSizes.setLabel,
            fontSizes.title,
            fontSizes.exportLabel,
            fontSizes.description,
            p.textColor,
            p.color,
            p.hasSelectionColor,
            p.strokeColor,
            p.valueTextColor,
            p.selectionColor,
            p.opacity,
            p.hasSelectionOpacity,
          ]),
    [
      p.id,
      p.fontFamily,
      fontSizes.valueLabel,
      fontSizes.legend,
      fontSizes.setLabel,
      fontSizes.title,
      fontSizes.exportLabel,
      fontSizes.description,
      p.textColor,
      p.color,
      p.hasSelectionColor,
      p.strokeColor,
      p.valueTextColor,
      p.selectionColor,
      p.opacity,
      p.hasSelectionOpacity,
    ]
  );

  const styleInfo = useMemo(
    () => deriveVennStyleDependent(p.theme, p.styles, p.classNames, styleId, p.selectionColor, p.title, p.description),
    [p.theme, p.styles, p.classNames, styleId, p.selectionColor, p.title, p.description]
  );

  const sizeInfo = useMemo(() => deriveVennSizeDependent(p.width, p.height, p.padding, p.id), [
    p.width,
    p.height,
    p.padding,
    p.id,
  ]);

  const dataInfo = useMemo(
    () =>
      deriveVennDataDependent(p.sets, p.combinations, sizeInfo, p.layout, p.valueFormat, p.toKey, p.toElemKey, p.id),
    [p.sets, p.combinations, sizeInfo, p.valueFormat, p.toKey, p.toElemKey, p.id, p.layout]
  );

  const rulesHelper = baseRules(styleId, p, p.fontFamily, fontSizes);

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
  ${rulesHelper.fill}
  ${rulesHelper.export}

  ${queries
    .map(
      (q, i) => `.fillQ${i}-${dataInfo.id} {
    fill: ${q.color};
  }`
    )
    .join('\n')}
  `;

  const exportChart = useCallback(
    (evt: React.MouseEvent<SVGElement>) => {
      const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
      const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png' | 'dump' | 'share';
      switch (type) {
        case 'dump':
          exportDump(svg, props, dataInfo);
          break;
        case 'share':
          exportSharedLink(props, dataInfo);
          break;
        case 'svg':
        case 'png':
          exportSVG(svg, {
            type,
            toRemove: `.${evt.currentTarget.getAttribute('class')}`,
          });
      }
    },
    [dataInfo, props]
  );
  const [onClickImpl, onMouseEnterImpl, onContextMenuImpl, onMouseLeaveImpl] = React.useMemo(
    () => [
      wrap(p.onClick),
      wrap(p.onHover),
      wrap(p.onContextMenu),
      p.onHover ? (evt: React.MouseEvent) => p.onHover!(null, evt.nativeEvent) : undefined,
    ],
    [p.onClick, p.onHover, p.onContextMenu]
  );

  const selectionKey = selection != null && isSetLike(selection) ? dataInfo.toKey(selection) : null;
  const selectionOverlap = selection == null ? null : generateSelectionOverlap(selection, p.toElemKey);
  const selectionName = generateSelectionName(selection);
  const qs = React.useMemo(() => queries.map((q) => queryOverlap(q, 'intersection', p.toElemKey)), [
    queries,
    p.toElemKey,
  ]);

  const exportButtonsPatch = useMemo(
    () =>
      !p.exportButtons ? false : Object.assign({}, p.exportButtons === true ? {} : p.exportButtons, { vega: false }),
    [p.exportButtons]
  );

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
        <UpSetTitle style={styleInfo} width={sizeInfo.area.w} />
        <g className={clsx(p.onClick && `clickAble-${styleInfo.id}`)}>
          {dataInfo.sets.d.map((d, i) => (
            <text
              key={d.key}
              x={d.l.text.x}
              y={d.l.text.y}
              onClick={onClickImpl(dataInfo.sets.v[i])}
              onMouseEnter={onMouseEnterImpl(dataInfo.sets.v[i])}
              onMouseLeave={onMouseLeaveImpl}
              onContextMenu={onContextMenuImpl(dataInfo.sets.v[i])}
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
              onClick={onClickImpl}
              onMouseEnter={onMouseEnterImpl}
              onMouseLeave={onMouseLeaveImpl}
              onContextMenu={onContextMenuImpl}
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

export { VennDiagram };
