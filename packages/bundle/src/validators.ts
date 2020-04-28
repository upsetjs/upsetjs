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
  validators,
} from '@upsetjs/model';
import { UpSetStyleClassNames, UpSetStyleFontSizes, UpSetCSSStyles } from './interfaces';

export function widthRatios(value?: [number, number, number]) {
  return value == null || (Array.isArray(value) && value.length === 3 && value.every((v) => typeof v === 'number'));
}
export function heightRatios(value?: [number, number]) {
  return value == null || (Array.isArray(value) && value.length === 2 && value.every((v) => typeof v === 'number'));
}
export function sets(value: ISets<any>) {
  return Array.isArray(value) && value.every(validators.isSet);
}

export function combinations(value?: ISetCombinations<any> | GenerateSetCombinationsOptions<any>) {
  return (
    value == null ||
    (Array.isArray(value) && value.every(validators.isSetCombination)) ||
    validators.isGenerateSetCombinationOptions(value)
  );
}

export function selection(value?: ISetLike<any> | ReadonlyArray<any>) {
  return value == null || Array.isArray(value) || validators.isSetLike(value);
}

export function onHover(value?: (selection: ISetLike<any> | null) => void) {
  return value == null || typeof value === 'function';
}

export function onClick(value?: (selection: ISetLike<any> | null) => void) {
  return value == null || typeof value === 'function';
}

export function queries(value?: UpSetQuery<any>[]) {
  return !value || (Array.isArray(value) && value.every(validators.isSetQuery));
}

export function stringOrFalse(value?: string | false) {
  return value == null || typeof value === 'string' || value === false;
}

export function theme(value?: 'light' | 'dark') {
  return value == null || value === 'light' || value === 'dark';
}

export function classNames(value?: UpSetStyleClassNames) {
  const keys: (keyof UpSetStyleClassNames)[] = [
    'axisTick',
    'bar',
    'barLabel',
    'chartLabel',
    'dot',
    'legend',
    'setLabel',
  ];
  return (
    value == null ||
    Object.keys(value).every((k) => keys.includes(k as keyof UpSetStyleClassNames) && typeof k === 'string')
  );
}

export function fontSizes(value?: UpSetStyleFontSizes) {
  const keys: (keyof UpSetStyleFontSizes)[] = ['axisTick', 'barLabel', 'chartLabel', 'legend', 'setLabel'];
  return (
    value == null ||
    Object.keys(value).every((k) => keys.includes(k as keyof UpSetStyleFontSizes) && typeof k === 'string')
  );
}

export function numericScale(value?: 'linear' | 'log' | NumericScaleFactory) {
  return value == null || value === 'linear' || value === 'log' || typeof value === 'function';
}
export function bandScale(value?: 'band' | BandScaleFactory) {
  return value == null || value === 'band' || typeof value === 'function';
}

export function style(value?: UpSetCSSStyles) {
  return value == null || typeof value === 'object';
}

export function styles(value?: UpSetCSSStyles) {
  return value == null || typeof value === 'object';
}
