/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  UpSetThemeProps,
  UpSetProps,
  UpSetDataProps,
  UpSetSizeProps,
  UpSetStyleProps,
  UpSetReactStyleProps,
  UpSetSelectionProps,
} from './UpSetJS';
import { ISetCombinations, GenerateSetCombinationsOptions, toKey } from '@upsetjs/model';
import {
  DEFAULT_COMBINATIONS,
  DEFAULT_HEIGHT_RATIO,
  EMPTY_ARRAY,
  DEFAULT_FONTSIZES,
  EMPTY_OBJECT,
  DEFAULT_WIDTH_RATIO,
} from './defaults';

const lightTheme: Required<UpSetThemeProps> = {
  selectionColor: '#ffa500',
  color: '#000000',
  textColor: '#000000',
  hoverHintColor: '#cccccc',
  notMemberColor: '#d3d3d3',
  alternatingBackgroundColor: '#0000000d',
};
const darkTheme: Required<UpSetThemeProps> = {
  selectionColor: '#ffa500',
  color: '#cccccc',
  textColor: '#ffffff',
  hoverHintColor: '#d9d9d9',
  notMemberColor: '#666666',
  alternatingBackgroundColor: '#ffffff33',
};

function getTheme(theme?: 'light' | 'dark') {
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
export function fillDefaults<T = any>(
  props: UpSetProps<T>
): Required<UpSetDataProps<T>> &
  Required<UpSetSizeProps> &
  Required<UpSetStyleProps> &
  Required<UpSetReactStyleProps<T>> &
  UpSetSelectionProps<T> {
  const theme = getTheme(props.theme);
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
      fontFamily: 'sans-serif',
      widthRatios: DEFAULT_WIDTH_RATIO,
      heightRatios: DEFAULT_HEIGHT_RATIO,
      queries: EMPTY_ARRAY,
      queryLegend: props.queries != null && props.queries.length > 0,
      exportButtons: true,
      numericScale: 'linear',
      bandScale: 'band',
      className: '',
      fontSizes: DEFAULT_FONTSIZES,
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
          fontSizes: Object.assign({}, DEFAULT_FONTSIZES, props.fontSizes),
        }
      : EMPTY_OBJECT
  );
}
