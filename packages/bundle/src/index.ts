import { render, h, hydrate } from 'preact';
import UpSetElement, { UpSetProps as UpSetElementProps, fillDefaults as fillDefaultsImpl } from '@upsetjs/react';
import {
  bandScale,
  classNames,
  combinations,
  fontSizes,
  heightRatios,
  numericScale,
  onClick,
  onHover,
  queries,
  selection,
  sets,
  stringOrFalse,
  style,
  styles,
  theme,
  widthRatios,
} from './validators';
import {
  UpSetDataProps,
  UpSetPlainStyleProps,
  UpSetSelectionProps,
  UpSetSizeProps,
  UpSetStyleProps,
} from './interfaces';

export * from './interfaces';
export * from '@upsetjs/model';

export const propValidators = {
  bandScale,
  classNames,
  combinations,
  fontSizes,
  heightRatios,
  numericScale,
  onClick,
  onHover,
  queries,
  selection,
  sets,
  stringOrFalse,
  style,
  styles,
  theme,
  widthRatios,
};

export declare type UpSetProps<T = any> = UpSetDataProps<T> &
  UpSetSizeProps &
  UpSetStyleProps &
  UpSetPlainStyleProps &
  UpSetSelectionProps<T>;

export function fillDefaults<T = any>(props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  return fillDefaultsImpl(p) as Required<UpSetDataProps<T>> &
    Required<UpSetSizeProps> &
    Required<UpSetStyleProps> &
    UpSetPlainStyleProps &
    UpSetSelectionProps<T>;
}

export function renderUpSet<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  render(h(UpSetElement as any, p), node);
}

export function hydrateUpSet<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  hydrate(h(UpSetElement as any, p), node);
}
