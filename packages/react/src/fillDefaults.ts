/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombinations, GenerateSetCombinationsOptions, toKey } from '@upsetjs/model';
import {
  DEFAULT_COMBINATIONS,
  DEFAULT_HEIGHT_RATIO,
  EMPTY_ARRAY,
  DEFAULT_FONT_SIZES,
  EMPTY_OBJECT,
  DEFAULT_WIDTH_RATIO,
} from './defaults';
import type {
  UpSetThemeProps,
  UpSetProps,
  UpSetFullProps,
  UpSetFullPropsG,
  VennDiagramProps,
  VennDiagramFullProps,
  VennDiagramFullPropsG,
  UpSetPropsG,
  VennDiagramPropsG,
  VennDiagramThemeProps,
  UpSetThemes,
  KarnaughMapPropsG,
  KarnaughMapFullPropsG,
  KarnaughMapProps,
  KarnaughMapFullProps,
} from './interfaces';
import { vennDiagramLayout } from './venn/layout/vennDiagramLayout';

export declare type UpSetExtraTheme = {
  backgroundColor: string;
};

const lightTheme: Required<UpSetThemeProps & VennDiagramThemeProps & UpSetExtraTheme> = {
  selectionColor: '#ffa500',
  color: '#000000',
  hasSelectionColor: '',
  opacity: 1,
  hasSelectionOpacity: -1,
  textColor: '#000000',
  hoverHintColor: '#cccccc',
  notMemberColor: '#d3d3d3',
  alternatingBackgroundColor: 'rgba(0,0,0,0.05)',
  valueTextColor: '#000000',
  strokeColor: '#000000',
  backgroundColor: '#ffffff',
  filled: false,
};

const darkTheme: Required<UpSetThemeProps & VennDiagramThemeProps & UpSetExtraTheme> = {
  selectionColor: '#ffa500',
  color: '#cccccc',
  hasSelectionColor: '',
  opacity: 1,
  hasSelectionOpacity: -1,
  textColor: '#ffffff',
  hoverHintColor: '#d9d9d9',
  notMemberColor: '#666666',
  alternatingBackgroundColor: 'rgba(255, 255, 255, 0.2)',
  valueTextColor: '#ffffff',
  strokeColor: '#ffffff',
  backgroundColor: '#303030',
  filled: false,
};

const vegaTheme: Readonly<Required<UpSetThemeProps & VennDiagramThemeProps & UpSetExtraTheme>> = {
  selectionColor: '#4c78a8',
  color: '#4c78a8',
  hasSelectionColor: '#c9d6e5',
  opacity: 1,
  hasSelectionOpacity: -1,
  textColor: '#000000',
  hoverHintColor: '#cccccc',
  notMemberColor: '#d3d3d3',
  alternatingBackgroundColor: 'rgba(0,0,0,0.05)',
  valueTextColor: '#000000',
  strokeColor: '#000000',
  backgroundColor: '#ffffff',
  filled: true,
};

export function getDefaultTheme(
  theme?: UpSetThemes
): Readonly<Required<UpSetThemeProps & VennDiagramThemeProps & UpSetExtraTheme>> {
  return theme === 'vega' ? vegaTheme : theme === 'dark' ? darkTheme : lightTheme;
}
function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

function fillGeneric<T extends {}>(
  base: T,
  props: { theme?: UpSetThemes; fontSizes?: {}; queries?: readonly unknown[] },
  others = {}
) {
  const theme = getDefaultTheme(props.theme);
  return Object.assign(
    base,
    {
      queryLegend: props.queries != null && props.queries.length > 0,
      theme: 'light',
      padding: 20,
      selection: null,
      title: '',
      description: '',
      fontFamily: 'sans-serif',
      queries: EMPTY_ARRAY,
      exportButtons: true,
      className: '',
      fontSizes: DEFAULT_FONT_SIZES,
      classNames: EMPTY_OBJECT,
      style: EMPTY_OBJECT,
      styles: EMPTY_OBJECT,
      toKey,
      tooltips: true,
    },
    theme,
    props,
    others,
    props.fontSizes
      ? {
          fontSizes: Object.assign({}, DEFAULT_FONT_SIZES, props.fontSizes),
        }
      : EMPTY_OBJECT
  );
}

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillDefaultsG<T, C, N, L = N>(props: UpSetPropsG<T, C, N, L>): UpSetFullPropsG<T, C, N, L> {
  return fillGeneric(
    {
      barPadding: 0.3,
      dotPadding: 0.7,
      combinations: DEFAULT_COMBINATIONS,
      combinationName:
        props.combinations != null && !areCombinations(props.combinations) && props.combinations.type === 'union'
          ? 'Union Size'
          : 'Intersection Size',
      barLabelOffset: 2,
      setNameAxisOffset: 'auto',
      combinationNameAxisOffset: 'auto',
      setName: 'Set Size',
      widthRatios: DEFAULT_WIDTH_RATIO,
      heightRatios: DEFAULT_HEIGHT_RATIO,
      setLabelAlignment: 'center',
      numericScale: 'linear',
      bandScale: 'band',
      childrenFactories: EMPTY_OBJECT,
      setAddons: EMPTY_ARRAY,
      combinationAddons: EMPTY_ARRAY,
      setAddonPadding: 1,
      combinationAddonPadding: 1,
      emptySelection: true,
    },
    props
  );
}

function valueFormat(v: number) {
  return v.toLocaleString();
}

export function fillDefaults<T = any>(props: UpSetProps<T>): UpSetFullProps<T> {
  return fillDefaultsG<T, React.CSSProperties, React.ReactNode, React.ReactNode>(props);
}

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillVennDiagramDefaultsG<T, C, N, L = N>(
  props: VennDiagramPropsG<T, C, N, L>
): VennDiagramFullPropsG<T, C, N, L> {
  return fillGeneric(
    {
      valueFormat,
      layout: vennDiagramLayout,
    },
    props,
    {
      exportButtons:
        props.exportButtons === false
          ? false
          : Object.assign({}, props.exportButtons === true ? {} : props.exportButtons, { vega: false }),
    }
  );
}

export function fillVennDiagramDefaults<T = any>(props: VennDiagramProps<T>): VennDiagramFullProps<T> {
  return fillVennDiagramDefaultsG<T, React.CSSProperties, React.ReactNode, React.ReactNode>(props);
}

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillKarnaughMapDefaultsG<T, C, N, L = N>(
  props: KarnaughMapPropsG<T, C, N, L>
): KarnaughMapFullPropsG<T, C, N, L> {
  return fillGeneric(
    {
      numericScale: 'linear',
      barPadding: 0.3,
      barLabelOffset: 2,
      combinationName: 'Intersection Size',
      combinationNameAxisOffset: 'auto',
    },
    props,
    {
      exportButtons:
        props.exportButtons === false
          ? false
          : Object.assign({}, props.exportButtons === true ? {} : props.exportButtons, { vega: false }),
    }
  );
}

export function fillKarnaughMapDefaults<T = any>(props: KarnaughMapProps<T>): KarnaughMapFullProps<T> {
  return fillKarnaughMapDefaultsG<T, React.CSSProperties, React.ReactNode, React.ReactNode>(props);
}
