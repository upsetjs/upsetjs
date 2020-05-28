import { UpSetFontSizes, UpSetMultiStyle } from './interfaces';

export const fontSizesKeys: (keyof UpSetFontSizes)[] = ['axisTick', 'barLabel', 'chartLabel', 'legend', 'setLabel'];
export const multiStyleKeys: (keyof UpSetMultiStyle<any>)[] = [
  'axisTick',
  'bar',
  'barLabel',
  'chartLabel',
  'dot',
  'legend',
  'setLabel',
];
