/**
 * @upsetjs/react
 * https://github.com/components/components
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo, forwardRef, Ref } from 'react';
import { UpSetAddons, UpSetReactStyles, UpSetStyleClassNames, UpSetFontSizes } from './interfaces';
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

export interface UpSetDataProps<T = any> {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the set combinations to visualize or the generation options to generate the set combinations
   * by default all set intersections are computed
   */
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions<T>;
  /**
   * optional function to identify the same sets
   * @param set the set to generate a key for
   */
  toKey?: (set: ISetLike<T>) => string;
  /**
   * optional function to identify the same element
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

declare type UpSetQueries<T = any> = ReadonlyArray<UpSetQuery<T>>;

export interface UpSetSelectionProps<T = any> {
  /**
   * the selection of the plot. Can be a set like (set or set combination), an array of elements, or a function to compute the overlap to a given set
   */
  selection?: ISetLike<T> | null | ReadonlyArray<T> | ((s: ISetLike<T>) => number);
  /**
   * mouse hover listener, triggered when the user is over a set (combination)
   */
  onHover?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;
  /**
   * mouse click listener, triggered when the user is clicking on a set (combination)
   */
  onClick?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;
  /**
   * mouse context menu listener, triggered when the user right clicks on a set (combination)
   */
  onContextMenu?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;
  /**
   * list of queries as an alternative to provide a single selection
   */
  queries?: UpSetQueries<T>;
}

export interface UpSetReactStyleProps<T = any> {
  /**
   * style object applied to the SVG element
   */
  style?: React.CSSProperties;
  /**
   * object for applying styles to certain sub elements
   */
  styles?: UpSetReactStyles;
  /**
   * list of addons that should be rendered along the horizontal sets
   */
  setAddons?: UpSetAddons<ISet<T>, T>;
  /**
   * list of addons that should be rendered along the vertical set combinations
   */
  combinationAddons?: UpSetAddons<ISetCombination<T>, T>;
  /**
   * factory to create extra react nodes for each set
   */
  setChildrenFactory?: (set: ISet<T>) => React.ReactNode;
  /**
   * factory to create extra react nodes for each set combination
   */
  combinationChildrenFactory?: (combination: ISetCombination<T>) => React.ReactNode;
  /**
   * set axis label
   * @default Set Size
   */
  setName?: React.ReactNode;
  /**
   * combination axis label
   * @default Intersection Size
   */
  combinationName?: React.ReactNode;
}

export interface UpSetThemeProps {
  /**
   * color used to highlight the selection
   * @default orange
   */
  selectionColor?: string;
  /**
   * color used to highlight alternating background in the sets for easier comparison
   * set to false to disable alternating pattern
   */
  alternatingBackgroundColor?: string | false;
  /**
   * main color to render bars and dark dots
   * @default black
   */
  color?: string;
  /**
   * main color to render text
   * @default black
   */
  textColor?: string;
  /**
   * color for the hover hint rects for set combinations
   */
  hoverHintColor?: string;
  /**
   * color for dots that indicate it is not a member
   */
  notMemberColor?: string;
}

export interface UpSetStyleProps extends UpSetThemeProps {
  /**
   * optional unique id of the set element. Note: if set, it is will also be used as a CSS class suffix
   */
  id?: string;
  /**
   * optional classname for the SVG element
   */
  className?: string;
  /**
   * object of classnames for certain sub elements
   */
  classNames?: UpSetStyleClassNames;
  /**
   * basic theme of the plot either 'light' or 'dark'
   * @default light
   */
  theme?: 'light' | 'dark';
  /**
   * offset of the label on top or left of a bar
   * @default 2
   */
  barLabelOffset?: number;
  /**
   * offset of the set name from the set x axis. 'auto' means that it will be guessed according to the current values
   * @default auto
   */
  setNameAxisOffset?: number | 'auto';
  /**
   * offset of the combination name from the combination y axis. 'auto' means that it will be guessed according to the current values
   * @default auto
   */
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
   * specify the overall font family, set to false to use the default font family
   * @default sans-serif
   */
  fontFamily?: string | false;
  /**
   * specify font sizes for different sub elements
   */
  fontSizes?: UpSetFontSizes;
  /**
   * numeric scale to use, either constants 'linear' or 'log' or a custom factory function
   * @default linear
   */
  numericScale?: NumericScaleFactory | 'linear' | 'log';
  /**
   * band scale to use, either constant 'band' or a custom factory function
   * @default band
   */
  bandScale?: BandScaleFactory | 'band';
  /**
   * render empty selection for better performance
   * @default true
   */
  emptySelection?: boolean;
}

/**
 * the UpSetJS component properties, separated in multiple semantic sub interfaces
 */
export interface UpSetProps<T = any>
  extends UpSetDataProps<T>,
    UpSetSizeProps,
    UpSetStyleProps,
    UpSetReactStyleProps<T>,
    UpSetSelectionProps<T> {
  children?: React.ReactNode;
}

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
