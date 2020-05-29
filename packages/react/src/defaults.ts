/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { UpSetFontSizes, UpSetMultiStyle } from './interfaces';

export const EMPTY_OBJECT = {};
export const EMPTY_ARRAY: any[] = [];
export const DEFAULT_FONT_SIZES: Required<UpSetFontSizes> = {
  setLabel: '16px',
  axisTick: '10px',
  chartLabel: '16px',
  barLabel: '10px',
  legend: '10px',
  description: '16px',
  title: '24px',
};
export const DEFAULT_WIDTH_RATIO = [0.18, 0.12, 0.7];
export const DEFAULT_HEIGHT_RATIO = [0.6, 0.4];
export const DEFAULT_COMBINATIONS = { type: 'intersection' };

export const DARK_BACKGROUND_COLOR = '#303030';

export const FONT_SIZES_KEYS = /* #__PURE__ */ Object.keys(DEFAULT_FONT_SIZES) as (keyof UpSetFontSizes)[];
export const MULTI_STYLE_KEYS: (keyof UpSetMultiStyle<any>)[] = [
  'axisTick',
  'bar',
  'barLabel',
  'chartLabel',
  'dot',
  'legend',
  'setLabel',
];
