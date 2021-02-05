/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { isSet, isSetCombination, isGenerateSetCombinationOptions, isSetLike, isUpSetQuery } from '@upsetjs/model';
import type {
  UpSetStyleClassNames,
  UpSetFontSizes,
  UpSetMultiStyle,
  UpSetExportOptions,
  UpSetThemes,
  VennDiagramMultiStyle,
  VennDiagramFontSizes,
  UpSetLayoutProps,
  UpSetBaseDataProps,
  UpSetDataProps,
  UpSetSelectionProps,
  KarnaughMapMultiStyle,
  UpSetBaseStyleProps,
  UpSetStyleProps,
  KarnaughMapFontSizes,
} from './interfaces';
import { FONT_SIZES_KEYS, MULTI_STYLE_KEYS, EXPORT_OPTION_KEYS } from './defaults';

export function widthRatios(value?: UpSetLayoutProps['widthRatios']) {
  return value == null || (Array.isArray(value) && value.length >= 2 && value.every((v) => typeof v === 'number'));
}
export function heightRatios(value?: UpSetLayoutProps['heightRatios']) {
  return value == null || (Array.isArray(value) && value.length >= 1 && value.every((v) => typeof v === 'number'));
}
export function setLabelAlignment(value?: UpSetLayoutProps['setLabelAlignment']) {
  return value == null || value === 'left' || value === 'center' || value === 'right';
}

export function sets(value: UpSetBaseDataProps<any>['sets']) {
  return Array.isArray(value) && value.every(isSet);
}

export function combinations(value?: UpSetDataProps<any, any>['combinations']) {
  return (
    value == null || (Array.isArray(value) && value.every(isSetCombination)) || isGenerateSetCombinationOptions(value)
  );
}

export function selection(value?: UpSetSelectionProps<any>['selection']) {
  return value == null || Array.isArray(value) || isSetLike(value);
}

export function onHover(value?: UpSetSelectionProps<any>['onHover']) {
  return value == null || typeof value === 'function';
}

export function onClick(value?: UpSetSelectionProps<any>['onClick']) {
  return value == null || typeof value === 'function';
}
export function onContextMenu(value?: UpSetSelectionProps<any>['onContextMenu']) {
  return value == null || typeof value === 'function';
}
export function onMouseMove(value?: UpSetSelectionProps<any>['onMouseMove']) {
  return value == null || typeof value === 'function';
}

export function queries(value?: UpSetSelectionProps<any>['queries']) {
  return !value || (Array.isArray(value) && value.every(isUpSetQuery));
}

export function stringOrFalse(value?: string | false) {
  return value == null || typeof value === 'string' || value === false;
}

export function theme(value?: UpSetThemes) {
  return value == null || value === 'light' || value === 'dark' || value === 'vega';
}

export function classNames(
  value?: UpSetStyleClassNames | VennDiagramMultiStyle<string> | KarnaughMapMultiStyle<string>
) {
  return (
    value == null ||
    (Object.keys(value) as (keyof (UpSetStyleClassNames | VennDiagramMultiStyle<string>))[]).every(
      (k) => MULTI_STYLE_KEYS.includes(k) && typeof value[k] === 'string'
    )
  );
}

export function fontSizes(value?: UpSetFontSizes | VennDiagramFontSizes | KarnaughMapFontSizes) {
  return (
    value == null ||
    (Object.keys(value) as (keyof (UpSetFontSizes | VennDiagramFontSizes))[]).every(
      (k) => FONT_SIZES_KEYS.includes(k) && typeof value[k] === 'string'
    )
  );
}

export function numericScale(value?: UpSetDataProps<any, any>['numericScale']) {
  return value == null || value === 'linear' || value === 'log' || typeof value === 'function';
}

export function bandScale(value?: UpSetDataProps<any, any>['bandScale']) {
  return value == null || value === 'band' || typeof value === 'function';
}

export function axisOffset(value?: UpSetStyleProps<any>['setNameAxisOffset']) {
  return value == null || value === 'auto' || typeof value === 'number';
}

export function style(value?: any) {
  return value == null || typeof value === 'object';
}

export function styles(value?: UpSetMultiStyle<any> | VennDiagramMultiStyle<any> | KarnaughMapMultiStyle<any>) {
  return (
    value == null ||
    Object.keys(value).every((k) =>
      MULTI_STYLE_KEYS.includes(k as keyof (UpSetMultiStyle<any> | VennDiagramMultiStyle<any>))
    )
  );
}

export function exportButtons(value?: UpSetBaseStyleProps<any>['exportButtons']) {
  return (
    value == null ||
    typeof value === 'boolean' ||
    (Object.keys(value) as (keyof UpSetExportOptions)[]).every(
      (k) => EXPORT_OPTION_KEYS.includes(k) && typeof value[k] === 'boolean'
    )
  );
}
