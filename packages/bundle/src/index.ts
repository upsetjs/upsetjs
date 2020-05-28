/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { render as renderPreact, h, hydrate as hydratePreact } from 'preact';
import UpSetElement, {
  UpSetPropsG,
  UpSetFullPropsG,
  UpSetProps as UpSetReactProps,
  fillDefaultsG,
  exportSVG as exportSVGImpl,
  downloadUrl as downloadUrlImpl,
} from '@upsetjs/react';
export { propValidators } from '@upsetjs/react';
import { UpSetCSSStyles, UpSetReactElement } from './react';

export * from './addons';
export * from '@upsetjs/model';

export declare type UpSetProps<T = any> = UpSetPropsG<T, UpSetCSSStyles, UpSetReactElement, string>;
export declare type UpSetFullProps<T = any> = UpSetFullPropsG<T, UpSetCSSStyles, UpSetReactElement, string>;

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillDefaults<T = any>(props: UpSetProps<T>): UpSetFullProps<T> {
  const p: UpSetReactProps<T> = props;
  return fillDefaultsG<T, UpSetCSSStyles, UpSetReactElement, string>(p);
}

/**
 * renders the UpSetJS component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function render<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetReactProps<T> = props;
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
  const p: UpSetReactProps<T> = props;
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
  return exportSVGImpl(node, options);
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
