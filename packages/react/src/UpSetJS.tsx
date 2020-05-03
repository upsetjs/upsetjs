/**
 * @upsetjs/react
 * https://github.com/components/components
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo, ReactNode, CSSProperties, forwardRef, Ref } from 'react';
import { UpSetAddon, UpSetReactStyles, UpSetStyleClassNames, UpSetFontSizes } from './interfaces';
import deriveDataDependent from './components/deriveDataDependent';
import defineSizeDependent from './components/deriveSizeDependent';
import deriveStyleDependent from './components/deriveStyleDependent';
import ExportButtons from './components/ExportButtons';
import QueryLegend from './components/QueryLegend';
import UpSetAxis from './components/UpSetAxis';
import UpSetChart from './components/UpSetChart';
import UpSetQueries from './components/UpSetQueries';
import UpSetSelection from './components/UpSetSelection';
import { clsx, generateId } from './components/utils';

import {
  ISetLike,
  BandScaleFactory,
  NumericScaleFactory,
  UpSetQuery,
  ISet,
  ISetCombination,
  ISetCombinations,
  GenerateSetCombinationsOptions,
  ISets,
} from '@upsetjs/model';
import { fillDefaults } from './fillDefaults';

export * from './interfaces';

export interface UpSetDataProps<T> {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the combinations to visualize by default all combinations
   */
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions<T>;

  /**
   * optional function to identify the same sets
   * @param set the set to generate a key for
   */
  toKey?: (set: ISetLike<T>) => string;

  /**
   * optional function to identify the same elem
   * @param elem the element the key for
   */
  toElemKey?: (elem: T) => string;
}

export interface UpSetSizeProps {
  /**
   * width of the chart
   */
  width: number;
  /**
   * height of the chart
   */
  height: number;
  /**
   * padding within the svg
   * @default 5
   */
  padding?: number;
  /**
   * padding argument for scaleBand
   * @default 0.1
   */
  barPadding?: number;

  /**
   * padding factor the for dots
   * @default 0.7
   */
  dotPadding?: number;
  /**
   * width ratios for different plots
   * [set chart, set labels, intersection chart]
   * @default [0.21, 0.19, 0.7]
   */
  widthRatios?: [number, number, number];
  /**
   * height ratios for different plots
   * [intersection chart, set chart]
   * @default [0.6, 0.4]
   */
  heightRatios?: [number, number];
}

declare type UpSetQueries<T> = ReadonlyArray<UpSetQuery<T>>;

export interface UpSetSelectionProps<T> {
  selection?: ISetLike<T> | null | ReadonlyArray<T> | ((s: ISetLike<T>) => number);
  onHover?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;
  onClick?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;
  onContextMenu?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;

  queries?: UpSetQueries<T>;
}

export declare type UpSetAddons<S extends ISetLike<T>, T> = ReadonlyArray<UpSetAddon<S, T>>;

export interface UpSetReactStyleProps<T> {
  style?: CSSProperties;
  styles?: UpSetReactStyles;
  setAddons?: UpSetAddons<ISet<T>, T>;
  combinationAddons?: UpSetAddons<ISetCombination<T>, T>;
  setChildrenFactory?: (set: ISet<T>) => ReactNode;
  combinationChildrenFactory?: (combination: ISetCombination<T>) => ReactNode;
}

export interface UpSetThemeProps {
  selectionColor?: string;
  /**
   * set to false to disable alternating pattern
   */
  alternatingBackgroundColor?: string | false;
  color?: string;
  textColor?: string;
  hoverHintColor?: string;
  notMemberColor?: string;
}

export interface UpSetStyleProps extends UpSetThemeProps {
  id?: string;
  className?: string;
  classNames?: UpSetStyleClassNames;
  theme?: 'light' | 'dark';
  barLabelOffset?: number;
  setNameAxisOffset?: number | 'auto';
  combinationNameAxisOffset?: number | 'auto';
  /**
   * show a legend of queries
   * enabled by default when queries are set
   */
  queryLegend?: boolean;
  /**
   * show export buttons
   * @default true
   */
  exportButtons?: boolean;

  /**
   * set to false to use the default font family
   * @default sans-serif
   */
  fontFamily?: string | false;

  fontSizes?: UpSetFontSizes;

  numericScale?: NumericScaleFactory | 'linear' | 'log';
  bandScale?: BandScaleFactory | 'band';

  setName?: ReactNode;
  combinationName?: ReactNode;

  /**
   * render empty selection for better performance
   * @default true
   */
  emptySelection?: boolean;
}

export interface UpSetProps<T>
  extends UpSetDataProps<T>,
    UpSetSizeProps,
    UpSetStyleProps,
    UpSetReactStyleProps<T>,
    UpSetSelectionProps<T> {
  children?: ReactNode;
}

/**
 * UpSetJS main React component 2
 */
const UpSetJS = forwardRef(function UpSetJS<T>(props: UpSetProps<T>, ref: Ref<SVGSVGElement>) {
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
