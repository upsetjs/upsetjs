/**
 * @upsetjs/react
 * https://github.com/components/components
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React, { useMemo, forwardRef, Ref, useCallback } from 'react';
import { VennDiagramProps } from '../interfaces';
import { fillVennDiagramDefaults } from '../fillDefaults';
import { clsx, generateId } from '../utils';
import deriveVennStyleDependent from './derive/deriveVennStyleDependent';
import deriveVennSizeDependent from './derive/deriveVennSizeDependent';
import deriveVennDataDependent from './derive/deriveVennDataDependent';
import ExportButtons from '../components/ExportButtons';
import QueryLegend from '../components/QueryLegend';
import { exportSVG } from '../exporter';
import { baseRules } from '../rules';
import UpSetTitle from '../components/UpSetTitle';
import VennChartLabels from './components/VennChartLabels';
import { wrap } from '../components/utils';
import VennArcSliceSelection from './components/VennArcSliceSelection';
import { generateSelectionOverlap, generateSelectionName } from '../utils';
import { queryOverlap, ISetLike } from '@upsetjs/model';
import { ICircle, IArcSlice } from './layout/interfaces';

const VennDiagram = forwardRef(function VennDiagram<T = any>(props: VennDiagramProps<T>, ref: Ref<SVGSVGElement>) {
  const {
    id,
    className,
    style,
    width,
    height,
    padding: margin,
    sets,
    toKey,
    toElemKey,
    selection = null,
    onClick,
    onContextMenu,
    onHover,
    theme,
    queries = [],
    exportButtons,
    fontFamily,
    fontSizes,
    queryLegend,
    selectionColor,
    textColor,
    title,
    description,
    classNames,
    color,
    strokeColor,
    valueTextColor,
    styles,
    valueFormat,
  } = fillVennDiagramDefaults<T>(props);

  // generate a "random" but attribute stable id to avoid styling conflicts
  const {
    valueLabel: fontValueLabel,
    legend: fontLegend,
    setLabel: fontSetLabel,
    description: fontDescription,
    title: fontTitle,
    exportLabel: fontExportLabel,
  } = fontSizes;

  const styleId = useMemo(
    () =>
      id
        ? id
        : generateId([
            fontFamily,
            fontValueLabel,
            fontLegend,
            fontSetLabel,
            fontTitle,
            fontExportLabel,
            fontDescription,
            textColor,
            color,
            strokeColor,
            valueTextColor,
            selectionColor,
          ]),
    [
      id,
      fontFamily,
      fontValueLabel,
      fontLegend,
      fontSetLabel,
      fontTitle,
      fontExportLabel,
      fontDescription,
      textColor,
      color,
      strokeColor,
      valueTextColor,
      selectionColor,
    ]
  );

  const styleInfo = useMemo(
    () => deriveVennStyleDependent(theme, styles, classNames, styleId, selectionColor, title, description),
    [theme, styles, classNames, styleId, selectionColor, title, description]
  );

  const sizeInfo = useMemo(() => deriveVennSizeDependent(width, height, margin, id), [width, height, margin, id]);

  const dataInfo = useMemo(() => deriveVennDataDependent(sets, sizeInfo, valueFormat, toKey, toElemKey, id), [
    sets,
    sizeInfo,
    valueFormat,
    toKey,
    toElemKey,
    id,
  ]);

  const rulesHelper = baseRules(
    styleId,
    textColor,
    color,
    selectionColor,
    fontFamily,
    fontTitle,
    fontDescription,
    fontLegend,
    fontExportLabel
  );

  const rules = `
  ${rulesHelper.root}
  ${rulesHelper.text}

  .valueTextStyle-${styleId} {
    fill: ${valueTextColor};
    ${fontValueLabel ? `font-size: ${fontValueLabel};` : ''}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .setTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSetLabel ? `font-size: ${fontSetLabel};` : ''}
    text-anchor: middle;
    dominant-baseline: central;
  }

  .stroke-circle-${styleId} {
    fill: transparent;
    stroke: ${strokeColor};
  }
  .query-circle-${styleId} {
    fill-opacity: 0.5;
  }
  ${rulesHelper.fill}
  ${rulesHelper.export}

  ${queries
    .map(
      (q, i) => `.fillQ${i}-${dataInfo.id} {
    fill: ${q.color};
  } .strokeQ${i}-${dataInfo.id} {
    stroke: ${q.color};
    fill: transparent;
  } .strokePatternQ${i}-${dataInfo.id} {
    stroke: ${q.color};
    stroke-width: 0.01;
    fill: transparent;
  }`
    )
    .join('\n')}
  `;

  const exportChart = useCallback((evt: React.MouseEvent<SVGElement>) => {
    const svg = evt.currentTarget.closest('svg') as SVGSVGElement;
    const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png' | 'vega' | 'dump' | 'share';
    switch (type) {
      case 'svg':
      case 'png':
        exportSVG(svg, {
          type,
          toRemove: `.${evt.currentTarget.getAttribute('class')}`,
        });
    }
  }, []);
  const [onClickImpl, onMouseEnterImpl, onContextMenuImpl, onMouseLeaveImpl] = React.useMemo(
    () => [
      wrap(onClick),
      wrap(onHover),
      wrap(onContextMenu),
      onHover ? (evt: React.MouseEvent) => onHover(null, evt.nativeEvent) : undefined,
    ],
    [onClick, onHover, onContextMenu]
  );

  const selectionOverlap = selection == null ? null : generateSelectionOverlap(selection, dataInfo.toElemKey);
  const selectionName = generateSelectionName(selection);
  const qs = React.useMemo(() => queries.map((q) => queryOverlap(q, 'intersection', dataInfo.toElemKey)), [
    queries,
    dataInfo.toElemKey,
  ]);

  const data = dataInfo.sets.l
    .map((l, i) => ({
      l: l as ICircle | IArcSlice,
      key: dataInfo.sets.keys[i],
      d: dataInfo.sets.v[i] as ISetLike<T>,
    }))
    .concat(
      dataInfo.cs.l.map((l, i) => ({
        l: l as ICircle | IArcSlice,
        key: dataInfo.cs.keys[i],
        d: dataInfo.cs.v[i] as ISetLike<T>,
      }))
    );

  return (
    <svg
      id={id}
      className={clsx(`root-${styleId}`, className)}
      style={style}
      width={width}
      height={height}
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      data-theme={theme ?? 'light'}
    >
      <style>{rules}</style>
      {queryLegend && <QueryLegend queries={queries} x={sizeInfo.legend.x} style={styleInfo} data={dataInfo} />}
      <ExportButtons
        transform={`translate(${sizeInfo.w - 2},${sizeInfo.h - 3})`}
        styleId={styleId}
        exportButtons={exportButtons}
        exportChart={exportChart}
      />
      <g transform={`translate(${margin},${margin})`} data-upset="base">
        <UpSetTitle style={styleInfo} width={sizeInfo.area.w} />
        <g className={clsx(onClick && `clickAble-${styleInfo.id}`)}>
          {data.map((l, i) => (
            <VennArcSliceSelection
              key={l.key}
              d={l.d}
              i={i}
              slice={l.l}
              style={styleInfo}
              data={dataInfo}
              onClick={onClickImpl}
              onMouseEnter={onMouseEnterImpl}
              onMouseLeave={onMouseLeaveImpl}
              onContextMenu={onContextMenuImpl}
              selectionName={selectionName}
              elemOverlap={selectionOverlap}
              qs={qs}
            />
          ))}
        </g>
        <VennChartLabels data={dataInfo} style={styleInfo} />
      </g>
      {props.children}
    </svg>
  );
});

export { VennDiagram };
