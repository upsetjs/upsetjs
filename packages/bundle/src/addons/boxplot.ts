import { BoxplotStatsOptions } from '@upsetjs/math';
import { UpSetCSSStyles } from '../react';
import { UpSetAddon } from '../interfaces';
import { boxplotAddon as boxplotAddonImpl } from '@upsetjs/addons';
import { ISetLike } from '@upsetjs/model';

export interface IBoxplotStyleProps extends BoxplotStatsOptions {
  theme?: 'light' | 'dark';
  mode?: 'normal' | 'box' | 'indicator';
  orient?: 'horizontal' | 'vertical';
  boxStyle?: UpSetCSSStyles;
  lineStyle?: UpSetCSSStyles;
  outlierStyle?: UpSetCSSStyles;
  boxPadding?: number;
  outlierRadius?: number;
  numberFormat?(v: number): string;
}

export function boxplotAddon<T>(
  prop: keyof T | ((v: T) => number),
  elems: ReadonlyArray<T> | { min: number; max: number },
  options: Partial<Pick<UpSetAddon<ISetLike<T>, T>, 'size' | 'position' | 'name'>> & IBoxplotStyleProps = {}
): UpSetAddon<ISetLike<T>, T> {
  return boxplotAddonImpl(prop, elems, options);
}
