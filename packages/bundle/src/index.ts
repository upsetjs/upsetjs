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
  fillDefaults as fillDefaultsImpl,
  exportSVG as exportSVGImpl,
  downloadUrl as downloadUrlImpl,
  toUpSetJSDump as toUpSetJSDumpImpl,
  toUpSetJSStaticDump as toUpSetJSStaticDumpImpl,
  IUpSetDump,
  IUpSetStaticDump,
  IUpSetJSDump,
  IUpSetJSStaticDump,
} from '@upsetjs/react';
import { UpSetCSSStyles, UpSetReactElement } from './react';

export * from './addons';
export * from '@upsetjs/model';
export { propValidators, IUpSetJSDump, IUpSetJSStaticDump, UpSetJSDumpProps } from '@upsetjs/react';

export declare type UpSetProps<T = any> = UpSetPropsG<T, UpSetCSSStyles, UpSetReactElement, string>;
export declare type UpSetFullProps<T = any> = UpSetFullPropsG<T, UpSetCSSStyles, UpSetReactElement, string>;

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillDefaults<T = any>(props: UpSetProps<T>): UpSetFullProps<T> {
  const p: UpSetReactProps<T> = props;
  return fillDefaultsImpl(p) as UpSetFullProps<T>;
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
  options: { type?: 'png' | 'svg'; title?: string; toRemove?: string }
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

export function toUpSetJSDump(
  dump: IUpSetDump,
  elements: ReadonlyArray<number | string | any>,
  props: Partial<UpSetProps<any>>,
  author?: string
): IUpSetJSDump {
  return toUpSetJSDumpImpl(dump, elements, props, author);
}

export function toUpSetJSStaticDump(
  dump: IUpSetStaticDump,
  props: Partial<UpSetProps<any>>,
  author?: string
): IUpSetJSStaticDump {
  return toUpSetJSStaticDumpImpl(dump, props, author);
}
