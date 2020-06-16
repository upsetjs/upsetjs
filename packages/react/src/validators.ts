/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  ISets,
  ISetCombinations,
  GenerateSetCombinationsOptions,
  ISetLike,
  UpSetQuery,
  NumericScaleFactory,
  BandScaleFactory,
  isSet,
  isSetCombination,
  isGenerateSetCombinationOptions,
  isSetLike,
  isUpSetQuery,
} from '@upsetjs/model';
import {
  UpSetStyleClassNames,
  UpSetFontSizes,
  UpSetMultiStyle,
  UpSetExportOptions,
  UpSetThemes,
  VennDiagramMultiStyle,
  VennDiagramFontSizes,
} from './interfaces';
import { FONT_SIZES_KEYS, MULTI_STYLE_KEYS, EXPORT_OPTION_KEYS } from './defaults';

export function widthRatios(value?: [number, number, number]) {
  return value == null || (Array.isArray(value) && value.length === 3 && value.every((v) => typeof v === 'number'));
}
export function heightRatios(value?: [number, number]) {
  return value == null || (Array.isArray(value) && value.length === 2 && value.every((v) => typeof v === 'number'));
}
export function sets(value: ISets<any>) {
  return Array.isArray(value) && value.every(isSet);
}

export function combinations(value?: ISetCombinations<any> | GenerateSetCombinationsOptions<any>) {
  return (
    value == null || (Array.isArray(value) && value.every(isSetCombination)) || isGenerateSetCombinationOptions(value)
  );
}

export function selection(value?: ISetLike<any> | ReadonlyArray<any>) {
  return value == null || Array.isArray(value) || isSetLike(value);
}

export function onHover(value?: (selection: ISetLike<any> | null) => void) {
  return value == null || typeof value === 'function';
}

export function onClick(value?: (selection: ISetLike<any> | null) => void) {
  return value == null || typeof value === 'function';
}

export function queries(value?: UpSetQuery<any>[]) {
  return !value || (Array.isArray(value) && value.every(isUpSetQuery));
}

export function stringOrFalse(value?: string | false) {
  return value == null || typeof value === 'string' || value === false;
}

export function theme(value?: UpSetThemes) {
  return value == null || value === 'light' || value === 'dark' || value === 'vega';
}

export function classNames(value?: UpSetStyleClassNames | VennDiagramMultiStyle<string>) {
  return (
    value == null ||
    (Object.keys(value) as (keyof (UpSetStyleClassNames | VennDiagramMultiStyle<string>))[]).every(
      (k) => MULTI_STYLE_KEYS.includes(k) && typeof value[k] === 'string'
    )
  );
}

export function fontSizes(value?: UpSetFontSizes | VennDiagramFontSizes) {
  return (
    value == null ||
    (Object.keys(value) as (keyof (UpSetFontSizes | VennDiagramFontSizes))[]).every(
      (k) => FONT_SIZES_KEYS.includes(k) && typeof value[k] === 'string'
    )
  );
}

export function numericScale(value?: 'linear' | 'log' | NumericScaleFactory) {
  return value == null || value === 'linear' || value === 'log' || typeof value === 'function';
}

export function bandScale(value?: 'band' | BandScaleFactory) {
  return value == null || value === 'band' || typeof value === 'function';
}

export function axisOffset(value?: 'auto' | number) {
  return value == null || value === 'auto' || typeof value === 'number';
}

export function style(value?: any) {
  return value == null || typeof value === 'object';
}

export function styles(value?: UpSetMultiStyle<any> | VennDiagramMultiStyle<any>) {
  return (
    value == null ||
    Object.keys(value).every((k) =>
      MULTI_STYLE_KEYS.includes(k as keyof (UpSetMultiStyle<any> | VennDiagramMultiStyle<any>))
    )
  );
}

export function exportButtons(value?: boolean | UpSetExportOptions) {
  return (
    value == null ||
    typeof value === 'boolean' ||
    (Object.keys(value) as (keyof UpSetExportOptions)[]).every(
      (k) => EXPORT_OPTION_KEYS.includes(k) && typeof value[k] === 'boolean'
    )
  );
}
