/**
 * @upsetjs/react
 * https://github.com/components/components
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React, { useMemo, forwardRef, Ref, useCallback } from 'react';
import { VennDiagramProps } from './interfaces';
import { fillVennDiagramDefaults } from './fillDefaults';
import { clsx, wrap } from './components/utils';
import { generateId } from './derive/utils';
import deriveVennStyleDependent from './derive/deriveVennStyleDependent';
import deriveVennSizeDependent from './derive/deriveVennSizeDependent';
import deriveVennDataDependent from './derive/deriveVennDataDependent';
import ExportButtons from './components/ExportButtons';
import QueryLegend from './components/QueryLegend';
import { exportSVG } from './exporter';
import { baseRules } from './rules';
import UpSetTitle from './components/UpSetTitle';
import VennCircle from './components/VennCircle';
import VennArcSlice from './components/VennArcSlice';
import VennUniverse from './components/VennUniverse';
import { isSetLike } from '@upsetjs/model';

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

  .circle-${styleId} {
    fill: ${color};
    stroke: black;
    fill-opacity: 0.5;
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

  const selectionKey = selection != null && isSetLike(selection) ? dataInfo.toKey(selection) : null;

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
        <g className={clsx(onClick && `clickAble-${styleId}`)}>
          <VennUniverse
            data={dataInfo}
            style={styleInfo}
            selected={dataInfo.universe.key === selectionKey}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            onContextMenu={onContextMenuImpl}
          />
          {dataInfo.sets.l.map((l, i) => (
            <VennCircle
              key={dataInfo.sets.keys[i]}
              d={dataInfo.sets.v[i]}
              circle={l}
              style={styleInfo}
              data={dataInfo}
              selected={dataInfo.sets.keys[i] === selectionKey}
              onClick={onClickImpl}
              onMouseEnter={onMouseEnterImpl}
              onMouseLeave={onMouseLeaveImpl}
              onContextMenu={onContextMenuImpl}
            />
          ))}
          {dataInfo.cs.l.map((l, i) => (
            <VennArcSlice
              key={dataInfo.cs.keys[i]}
              d={dataInfo.cs.v[i]}
              slice={l}
              style={styleInfo}
              data={dataInfo}
              selected={dataInfo.cs.keys[i] === selectionKey}
              onClick={onClickImpl}
              onMouseEnter={onMouseEnterImpl}
              onMouseLeave={onMouseLeaveImpl}
              onContextMenu={onContextMenuImpl}
            />
          ))}
        </g>
      </g>
      {props.children}
    </svg>
  );
});

export { VennDiagram };
