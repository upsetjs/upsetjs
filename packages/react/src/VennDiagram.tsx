/**
 * @upsetjs/react
 * https://github.com/components/components
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React, { useMemo, forwardRef, Ref, useCallback } from 'react';
import { VennDiagramProps } from './interfaces';
import { fillVennDiagramDefaults } from './fillDefaults';
import { clsx, generateId } from './components/utils';
import deriveVennStyleDependent from './components/deriveVennStyleDependent';
import deriveVennSizeDependent from './components/deriveVennSizeDependent';
import deriveVennDataDependent from './components/deriveVennDataDependent';
import ExportButtons from './components/ExportButtons';
import QueryLegend from './components/QueryLegend';
import { exportSVG } from './exporter';

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

  const dataInfo = useMemo(() => deriveVennDataDependent(sets, valueFormat, toKey, toElemKey, id), [
    sets,
    valueFormat,
    toKey,
    toElemKey,
    id,
  ]);

  const rules = `
  .root-${styleId} {
    ${fontFamily ? `font-family: ${fontFamily};` : ''}
  }
  .titleTextStyle-${styleId} {
    fill: ${textColor};
    ${fontTitle ? `font-size: ${fontTitle};` : ''}
  }
  .descTextStyle-${styleId} {
    fill: ${textColor};
    ${fontDescription ? `font-size: ${fontDescription};` : ''}
  }
  .valueTextStyle-${styleId} {
    fill: ${valueTextColor};
    ${fontValueLabel ? `font-size: ${fontValueLabel};` : ''}
  }
  .setTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSetLabel ? `font-size: ${fontSetLabel};` : ''}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .legendTextStyle-${styleId} {
    fill: ${textColor};
    ${fontLegend ? `font-size: ${fontLegend};` : ''}
    text-anchor: middle;
    dominant-baseline: hanging;
    pointer-events: none;
  }
  .startText-${styleId} {
    text-anchor: start;
  }
  .endText-${styleId} {
    text-anchor: end;
  }
  .pnone-${styleId} {
    pointer-events: none;
  }
  .fillPrimary-${styleId} { fill: ${color}; }
  .fillSelection-${styleId} { fill: ${selectionColor}; }
  .fillTransparent-${styleId} { fill: transparent; }

  .selectionHint-${styleId} {
    fill: transparent;
    pointer-events: none;
    stroke: ${selectionColor};
  }

  .clickAble-${styleId} {
    cursor: pointer;
  }

  .exportButtons-${styleId} {
    text-anchor: middle;
  }
  .exportButton-${styleId} {
    cursor: pointer;
    opacity: 0.5;
  }
  .exportButton-${styleId}:hover {
    opacity: 1;
  }
  .exportButton-${styleId} > rect {
    fill: none;
    stroke: ${textColor};
  }

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
        {/* {onClick && (
          <rect
            width={sizeInfo.cs.x}
            height={sizeInfo.sets.y}
            onClick={(evt) => onClick(null, evt.nativeEvent)}
            className={`fillTransparent-${styleId}`}
          />
        )} */}
      </g>
      {props.children}
    </svg>
  );
});

export { VennDiagram };
