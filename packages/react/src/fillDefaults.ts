/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
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
import {
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
} from './interfaces';

const lightTheme: Required<UpSetThemeProps & VennDiagramThemeProps> = {
  selectionColor: '#ffa500',
  color: '#000000',
  textColor: '#000000',
  hoverHintColor: '#cccccc',
  notMemberColor: '#d3d3d3',
  alternatingBackgroundColor: '#0000000d',
  valueTextColor: '#000000',
  strokeColor: '#000000',
};
const darkTheme: Required<UpSetThemeProps & VennDiagramThemeProps> = {
  selectionColor: '#ffa500',
  color: '#cccccc',
  textColor: '#ffffff',
  hoverHintColor: '#d9d9d9',
  notMemberColor: '#666666',
  alternatingBackgroundColor: '#ffffff33',
  valueTextColor: '#ffffff',
  strokeColor: '#ffffff',
};

export function getDefaultTheme(theme?: 'light' | 'dark'): Readonly<Required<UpSetThemeProps>> {
  return theme === 'dark' ? darkTheme : lightTheme;
}
function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillDefaultsG<T, C, N, L = N>(props: UpSetPropsG<T, C, N, L>): UpSetFullPropsG<T, C, N, L> {
  const theme = getDefaultTheme(props.theme);
  return Object.assign(
    {
      theme: 'light',
      padding: 20,
      barPadding: 0.3,
      dotPadding: 0.7,
      combinations: DEFAULT_COMBINATIONS,
      selection: null,
      combinationName:
        props.combinations != null && !areCombinations(props.combinations) && props.combinations.type === 'union'
          ? 'Union Size'
          : 'Intersection Size',
      barLabelOffset: 2,
      setNameAxisOffset: 'auto',
      combinationNameAxisOffset: 'auto',
      setName: 'Set Size',
      title: '',
      description: '',
      fontFamily: 'sans-serif',
      widthRatios: DEFAULT_WIDTH_RATIO,
      heightRatios: DEFAULT_HEIGHT_RATIO,
      queries: EMPTY_ARRAY,
      queryLegend: props.queries != null && props.queries.length > 0,
      exportButtons: true,
      numericScale: 'linear',
      bandScale: 'band',
      className: '',
      fontSizes: DEFAULT_FONT_SIZES,
      classNames: EMPTY_OBJECT,
      style: EMPTY_OBJECT,
      styles: EMPTY_OBJECT,
      childrenFactories: EMPTY_OBJECT,
      setAddons: EMPTY_ARRAY,
      combinationAddons: EMPTY_ARRAY,
      emptySelection: true,
      toKey,
    },
    theme,
    props,
    props.fontSizes
      ? {
          fontSizes: Object.assign({}, DEFAULT_FONT_SIZES, props.fontSizes),
        }
      : EMPTY_OBJECT
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
  const theme = getDefaultTheme(props.theme);
  return Object.assign(
    {
      theme: 'light',
      padding: 20,
      selection: null,
      title: '',
      description: '',
      fontFamily: 'sans-serif',
      queries: EMPTY_ARRAY,
      queryLegend: props.queries != null && props.queries.length > 0,
      exportButtons: true,
      valueFormat,
      className: '',
      fontSizes: DEFAULT_FONT_SIZES,
      classNames: EMPTY_OBJECT,
      style: EMPTY_OBJECT,
      styles: EMPTY_OBJECT,
      toKey,
    },
    theme,
    props,
    props.fontSizes
      ? {
          fontSizes: Object.assign({}, DEFAULT_FONT_SIZES, props.fontSizes),
        }
      : EMPTY_OBJECT
  );
}

export function fillVennDiagramDefaults<T = any>(props: VennDiagramProps<T>): VennDiagramFullProps<T> {
  return fillVennDiagramDefaultsG<T, React.CSSProperties, React.ReactNode, React.ReactNode>(props);
}
