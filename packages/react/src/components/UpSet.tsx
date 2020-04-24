import React, { PropsWithChildren, useMemo } from 'react';
import { fillDefaults, UpSetProps } from './config';
import deriveDataDependent from './upset/deriveDataDependent';
import defineSizeDependent from './upset/deriveSizeDependent';
import deriveStyleDependent from './upset/deriveStyleDependent';
import ExportButtons from './upset/ExportButtons';
import QueryLegend from './upset/QueryLegend';
import UpSetAxis from './upset/UpSetAxis';
import UpSetChart from './upset/UpSetChart';
import UpSetQueries from './upset/UpSetQueries';
import UpSetSelection from './upset/UpSetSelection';
import { clsx, generateId } from './upset/utils';

export default React.forwardRef(function UpSet<T>(
  props: PropsWithChildren<UpSetProps<T>>,
  ref: React.Ref<SVGSVGElement>
) {
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
    childrenFactories,
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
  } = fillDefaults(props);

  // generate a "random" but attribute stable id to avoid styling conflicts
  const {
    axisTick: fontAxisTick,
    barLabel: fontBarLabel,
    chartLabel: fontChartLabel,
    legend: fontLegend,
    setLabel: fontSetLabel,
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
        emptySelection
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
    ]
  );

  const sizeInfo = useMemo(
    () =>
      defineSizeDependent(
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
  .root-${styleId} {
    ${fontFamily ? `font-family: ${fontFamily};` : ''}
  }
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
  .exportTextStyle-${styleId} {
    fill: ${textColor};
    ${fontBarLabel ? `font-size: ${fontBarLabel};` : ''}
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
  .fillNotMember-${styleId} { fill: ${notMemberColor}; }
  .fillAlternating-${styleId} { fill: ${alternatingBackgroundColor || 'transparent'}; }
  .fillTransparent-${styleId} { fill: transparent; }

  .selectionHint-${styleId} {
    fill: transparent;
    pointer-events: none;
    stroke: ${selectionColor};
  }

  .axisLine-${styleId} {
    fill: none;
    stroke: ${textColor};
  }
  .clickAble-${styleId} {
    cursor: pointer;
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
      {queryLegend && <QueryLegend queries={queries} size={sizeInfo} style={styleInfo} data={dataInfo} />}
      {exportButtons && (
        <ExportButtons transform={`translate(${sizeInfo.w - 2},${sizeInfo.h - 3})`} styleId={styleId} />
      )}
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
        <UpSetChart
          size={sizeInfo}
          style={styleInfo}
          data={dataInfo}
          onClick={onClick}
          onHover={onHover}
          onContextMenu={onContextMenu}
          childrens={childrenFactories}
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
}) as <T>(p: UpSetProps<T> & React.RefAttributes<SVGSVGElement>) => React.ReactElement;
