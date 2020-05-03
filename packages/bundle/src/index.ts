/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { render as renderPreact, h, hydrate as hydratePreact } from 'preact';
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

/**
 * utilities to validate properties, e.g., for Vue
 */
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

/**
 * the UpSetJS component properties, separated in multiple semantic sub interfaces
 */
export declare type UpSetProps<T = any> = UpSetDataProps<T> &
  UpSetSizeProps &
  UpSetStyleProps &
  UpSetPlainStyleProps<T> &
  UpSetSelectionProps<T>;

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillDefaults<T = any>(props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  return fillDefaultsImpl(p) as Required<UpSetDataProps<T>> &
    Required<UpSetSizeProps> &
    Required<UpSetStyleProps> &
    UpSetPlainStyleProps<T> &
    UpSetSelectionProps<T>;
}

/**
 * renders the UpSetJS component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function render<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  renderPreact(h(UpSetElement as any, p), node);
}
/**
 * renders the UpSetJS component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export const renderUpSet = render;

/**
 * hydrates the UpSetJS component when applied on a server rendered version
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function hydrate<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetElementProps<T> = props;
  hydratePreact(h(UpSetElement as any, p), node);
}

/**
 * hydrates the UpSetJS component when applied on a server rendered version
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export const hydrateUpSet = hydrate;

/**
 * helper method to export an download an SVG image
 * @param node the SVG element to download
 * @param options additional options
 */
export function exportSVG(
  node: SVGSVGElement,
  options: { type?: 'png' | 'svg'; title?: string; theme?: 'light' | 'dark'; toRemove?: string }
): Promise<void> {
  return exportSVGIpml(node, options);
}

/**
 * helper method to download a given url in the browser
 * @param url the url to download
 * @param title the desired file name
 * @param doc the root document
 */
export function downloadUrl(url: string, title: string, doc: Document) {
  downloadUrlImpl(url, title, doc);
}
