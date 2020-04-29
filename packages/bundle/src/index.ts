/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { render, h, hydrate } from 'preact';
import UpSetElement, {
  UpSetProps as UpSetElementProps,
  fillDefaults as fillDefaultsImpl,
  exportSVG as exportSVGIpml,
  downloadUrl as downloadUrlImpl,
} from '@upsetjs/react';
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
export * from './addons';
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
  UpSetPlainStyleProps<T> &
  UpSetSelectionProps<T>;

export function fillDefaults<T = any>(props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  return fillDefaultsImpl(p) as Required<UpSetDataProps<T>> &
    Required<UpSetSizeProps> &
    Required<UpSetStyleProps> &
    UpSetPlainStyleProps<T> &
    UpSetSelectionProps<T>;
}

export function renderUpSetJS<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  render(h(UpSetElement as any, p), node);
}

/**
 * @deprecated use renderUpSetJS instead
 */
export const renderUpSet = renderUpSetJS;

export function hydrateUpSetJS<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  hydrate(h(UpSetElement as any, p), node);
}

export function exportSVG(
  node: SVGSVGElement,
  options: { type?: 'png' | 'svg'; title?: string; theme?: 'light' | 'dark'; toRemove?: string }
): Promise<void> {
  return exportSVGIpml(node, options);
}

export function downloadUrl(url: string, title: string, doc: Document) {
  downloadUrlImpl(url, title, doc);
}
