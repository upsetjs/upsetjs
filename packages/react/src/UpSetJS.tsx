/**
 * @upsetjs/react
 * https://github.com/components/components
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo, forwardRef, Ref, useCallback } from 'react';
import { UpSetProps } from './interfaces';
import { exportSVG, exportVegaLite } from './exporter';
import { exportDump, exportSharedLink } from './exporter/exportDump';
import deriveDataDependent from './derive/deriveDataDependent';
import deriveSizeDependent from './derive/deriveSizeDependent';
import deriveStyleDependent from './derive/deriveStyleDependent';
import ExportButtons from './components/ExportButtons';
import QueryLegend from './components/QueryLegend';
import UpSetAxis from './components/UpSetAxis';
import UpSetChart from './components/UpSetChart';
import UpSetQueries from './components/UpSetQueries';
import UpSetSelection from './components/UpSetSelection';
import { clsx } from './components/utils';
import { generateId } from './derive/utils';
import { fillDefaults } from './fillDefaults';
import { baseRules } from './rules';

export * from './interfaces';

/**
 * UpSetJS main pure functional stateless React component, the generic argument T refers to the type of the elements
 *
 * with React.forwardRef support to specify a reference to the SVG element
 */
const UpSetJS = forwardRef(function UpSetJS<T = any>(props: UpSetProps<T>, ref: Ref<SVGSVGElement>) {
  const {
    id,
    className,
    style,
    width,
    height,
    padding: margin,
    barPadding,
    sets,
    toKey,
    toElemKey,
    combinations,
    selection = null,
    onClick,
    onContextMenu,
    onHover,
    theme,
    dotPadding,
    setChildrenFactory,
    combinationChildrenFactory,
    widthRatios,
    heightRatios,
    queries = [],
    setAddons,
    combinationAddons,
    alternatingBackgroundColor,
    bandScale,
    barLabelOffset,
    classNames,
    color,
    combinationName,
    combinationNameAxisOffset,
    exportButtons,
    fontFamily,
    fontSizes,
    hoverHintColor,
    notMemberColor,
    numericScale,
    queryLegend,
    selectionColor,
    setName,
    setNameAxisOffset,
    styles: cStyles,
    textColor,
    emptySelection,
    title,
    description,
  } = fillDefaults<T>(props);

  // generate a "random" but attribute stable id to avoid styling conflicts
  const {
    axisTick: fontAxisTick,
    barLabel: fontBarLabel,
    chartLabel: fontChartLabel,
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
            fontAxisTick,
            fontBarLabel,
            fontChartLabel,
            fontLegend,
            fontSetLabel,
            fontTitle,
            fontExportLabel,
            fontDescription,
            textColor,
            hoverHintColor,
            color,
            selectionColor,
            notMemberColor,
            alternatingBackgroundColor,
          ]),
    [
      id,
      fontFamily,
      fontAxisTick,
      fontBarLabel,
      fontChartLabel,
      fontLegend,
      fontSetLabel,
      fontTitle,
      fontExportLabel,
      fontDescription,
      textColor,
      hoverHintColor,
      color,
      selectionColor,
      notMemberColor,
      alternatingBackgroundColor,
    ]
  );
  const styleInfo = useMemo(
    () =>
      deriveStyleDependent(
        theme,
        cStyles,
        classNames,
        combinationName,
        combinationNameAxisOffset,
        setName,
        setNameAxisOffset,
        styleId,
        barLabelOffset,
        selectionColor,
        emptySelection,
        title,
        description
      ),
    [
      theme,
      cStyles,
      classNames,
      barLabelOffset,
      combinationName,
      combinationNameAxisOffset,
      setName,
      setNameAxisOffset,
      styleId,
      selectionColor,
      emptySelection,
      title,
      description,
    ]
  );

  const sizeInfo = useMemo(
    () =>
      deriveSizeDependent(
        width,
        height,
        margin,
        barPadding,
        widthRatios,
        heightRatios,
        setAddons,
        combinationAddons,
        id
      ),
    [width, height, margin, barPadding, widthRatios, heightRatios, setAddons, combinationAddons, id]
  );

  const dataInfo = useMemo(
    () =>
      deriveDataDependent(
        sets,
        combinations,
        sizeInfo,
        numericScale,
        bandScale,
        barLabelOffset + Number.parseInt(fontBarLabel ?? '10'),
        dotPadding,
        barPadding,
        Number.parseInt(fontAxisTick ?? '10'),
        toKey,
        toElemKey,
        id
      ),
    [
      sets,
      combinations,
      sizeInfo,
      numericScale,
      bandScale,
      barLabelOffset,
      fontBarLabel,
      dotPadding,
      barPadding,
      fontAxisTick,
      toKey,
      toElemKey,
      id,
    ]
  );

  const rules = `
  ${baseRules(
    styleId,
    textColor,
    color,
    selectionColor,
    fontFamily,
    fontTitle,
    fontDescription,
    fontLegend,
    fontExportLabel
  )}

  .axisTextStyle-${styleId} {
    fill: ${textColor};
    ${fontAxisTick ? `font-size: ${fontAxisTick};` : ''}
    text-anchor: middle;
  }
  .barTextStyle-${styleId} {
    fill: ${textColor};
    ${fontBarLabel ? `font-size: ${fontBarLabel};` : ''}
  }
  .cBarTextStyle-${styleId} {
    fill: ${textColor};
    ${fontBarLabel ? `font-size: ${fontBarLabel};` : ''}
    text-anchor: middle;
  }
  .sBarTextStyle-${styleId} {
    fill: ${textColor};
    ${fontBarLabel ? `font-size: ${fontBarLabel};` : ''}
    text-anchor: end;
    dominant-baseline: central;
  }
  .hoverBarTextStyle-${styleId} {
    ${fontBarLabel ? `font-size: ${fontBarLabel};` : ''}
    fill: ${hoverHintColor};
    display: none;
    text-anchor: middle;
  }
  .setTextStyle-${styleId} {
    fill: ${textColor};
    ${fontSetLabel ? `font-size: ${fontSetLabel};` : ''}
    text-anchor: middle;
    dominant-baseline: central;
  }
  .cChartTextStyle-${styleId} {
    fill: ${textColor};
    ${fontChartLabel ? `font-size: ${fontChartLabel};` : ''}
    text-anchor: middle;
  }
  .sChartTextStyle-${styleId} {
    fill: ${textColor};
    ${fontChartLabel ? `font-size: ${fontChartLabel};` : ''}
    text-anchor: middle;
    dominant-baseline: hanging;
  }

  .fillNotMember-${styleId} { fill: ${notMemberColor}; }
  .fillAlternating-${styleId} { fill: ${alternatingBackgroundColor || 'transparent'}; }

  .axisLine-${styleId} {
    fill: none;
    stroke: ${textColor};
  }
  .hoverBar-${styleId} {
    fill: transparent;
  }

  .interactive-${styleId}:hover > .hoverBar-${styleId} {
    stroke: ${hoverHintColor};
  }
  .interactive-${styleId}:hover > .hoverBarTextStyle-${styleId} {
    display: unset;
  }

  .upsetLine-${dataInfo.id} {
    stroke-width: ${dataInfo.r * 0.6};
    stroke: ${color};
  }

  .upsetSelectionLine-${dataInfo.id} {
    stroke-width: ${dataInfo.r * 0.6 * 1.1};
    stroke: ${selectionColor};
    pointer-events: none;
  }
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
      const type = (evt.currentTarget.dataset.type || 'png') as 'svg' | 'png' | 'vega' | 'dump' | 'share';
      switch (type) {
        case 'vega':
          exportVegaLite(svg);
          break;
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
      <defs>
        <clipPath id={`clip-${sizeInfo.id}`}>
          <rect x={sizeInfo.sets.w} y={0} width={sizeInfo.labels.w} height={sizeInfo.sets.h} />
        </clipPath>
      </defs>
      {queryLegend && <QueryLegend queries={queries} x={sizeInfo.legend.x} style={styleInfo} data={dataInfo} />}
      <ExportButtons
        transform={`translate(${sizeInfo.w - 2},${sizeInfo.h - 3})`}
        styleId={styleId}
        exportButtons={exportButtons}
        exportChart={exportChart}
      />
      <g transform={`translate(${margin},${margin})`} data-upset="base">
        {onClick && (
          <rect
            width={sizeInfo.cs.x}
            height={sizeInfo.sets.y}
            onClick={(evt) => onClick(null, evt.nativeEvent)}
            className={`fillTransparent-${styleId}`}
          />
        )}
        <UpSetAxis size={sizeInfo} style={styleInfo} data={dataInfo} />
        <UpSetChart<T>
          size={sizeInfo}
          style={styleInfo}
          data={dataInfo}
          onClick={onClick}
          onHover={onHover}
          onContextMenu={onContextMenu}
          setChildrenFactory={setChildrenFactory}
          combinationChildrenFactory={combinationChildrenFactory}
        />
        <UpSetSelection size={sizeInfo} style={styleInfo} data={dataInfo} onHover={onHover} selection={selection} />
        <UpSetQueries
          size={sizeInfo}
          style={styleInfo}
          data={dataInfo}
          onHover={onHover}
          queries={queries}
          secondary={onHover != null || selection != null}
        />
      </g>
      {props.children}
    </svg>
  );
});

export { UpSetJS };
