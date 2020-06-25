/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  UpSetFontSizes,
  UpSetMultiStyle,
  UpSetExportOptions,
  VennDiagramFontSizes,
  VennDiagramMultiStyle,
  KarnaughMapMultiStyle,
  KarnaughMapFontSizes,
} from './interfaces';
import { GenerateSetCombinationsOptions } from '@upsetjs/model';
import { createVennDiagramLayoutFunction } from './venn/layout/vennDiagramLayout';

export const EMPTY_OBJECT = {};
export const EMPTY_ARRAY: any[] = [];
export const DEFAULT_FONT_SIZES: Required<UpSetFontSizes & VennDiagramFontSizes & KarnaughMapFontSizes> = {
  setLabel: '16px',
  axisTick: '10px',
  chartLabel: '16px',
  barLabel: '10px',
  legend: '10px',
  description: '16px',
  title: '24px',
  valueLabel: '12px',
  exportLabel: '10px',
};
export const DEFAULT_WIDTH_RATIO = [0.18, 0.12, 0.7];
export const DEFAULT_HEIGHT_RATIO = [0.6, 0.4];
export const DEFAULT_COMBINATIONS: GenerateSetCombinationsOptions = {
  type: 'intersection',
  order: ['cardinality:desc', 'name:asc'],
};

export const FONT_SIZES_KEYS = /* #__PURE__ */ Object.keys(DEFAULT_FONT_SIZES) as (keyof (
  | UpSetFontSizes
  | VennDiagramFontSizes
  | KarnaughMapFontSizes
))[];
export const MULTI_STYLE_KEYS: (
  | keyof UpSetMultiStyle<any>
  | keyof VennDiagramMultiStyle<any>
  | keyof KarnaughMapMultiStyle<any>
)[] = [
  'axisTick',
  'bar',
  'barLabel',
  'chartLabel',
  'dot',
  'legend',
  'title',
  'description',
  'setLabel',
  'set',
  'valueLabel',
];
export const EXPORT_OPTION_KEYS: (keyof UpSetExportOptions)[] = ['dump', 'png', 'share', 'svg', 'vega'];

export const DEFAULT_VENN_LAYOUT = createVennDiagramLayoutFunction();
