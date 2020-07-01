/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { render as renderPreact, h, hydrate as hydratePreact } from 'preact';
import UpSetElement, {
  UpSetPropsG,
  VennDiagramPropsG,
  KarnaughMapPropsG,
  UpSetFullPropsG,
  VennDiagramFullPropsG,
  KarnaughMapFullPropsG,
  UpSetProps as UpSetReactProps,
  VennDiagramProps as VennDiagramReactProps,
  KarnaughMapProps as KarnaughMapReactProps,
  fillDefaults as fillDefaultsImpl,
  fillVennDiagramDefaults as fillVennDiagramDefaultsImpl,
  fillKarnaughMapDefaults as fillKarnaughMapDefaultsImpl,
  exportSVG as exportSVGImpl,
  downloadUrl as downloadUrlImpl,
  toUpSetJSDump as toUpSetJSDumpImpl,
  toUpSetJSStaticDump as toUpSetJSStaticDumpImpl,
  IUpSetDump,
  IUpSetStaticDump,
  IUpSetJSDump,
  IUpSetJSStaticDump,
  UpSetMultiStyle,
  VennDiagram as VennDiagramElement,
  VennDiagramMultiStyle,
  KarnaughMap as KarnaughMapElement,
  KarnaughMapMultiStyle,
  UpSetJSSkeletonProps as UpSetJSSkeletonPropsImpl,
  VennDiagramSkeleton,
  KarnaughMapSkeleton,
  UpSetJSSkeleton,
} from '@upsetjs/react';
import { UpSetReactElement } from './react';

export * from './addons';
export * from '@upsetjs/model';
export {
  propValidators,
  IUpSetJSDump,
  IUpSetJSStaticDump,
  UpSetJSDumpProps,
  UpSetThemeProps,
  UpSetThemes,
  UpSetStyleProps,
  UpSetFontSizes,
  VennDiagramFontSizes,
  KarnaughMapFontSizes,
  UpSetLayoutProps,
  VennDiagramLayoutProps,
  KarnaughMapLayoutProps,
  UpSetSelectionProps,
  VennDiagramThemeProps,
  KarnaughMapThemeProps,
  UpSetStyleClassNames,
  UpSetExportOptions,
  createVennJSAdapter,
  getDefaultTheme,
  UpSetAddonHandlerInfo,
  UpSetAddonHandlerInfos,
} from '@upsetjs/react';

export * from './react';

export declare type UpSetJSSkeletonProps = {
  background?: string;
  color?: string;
  secondaryColor?: string;
  // any other property will be forwarded to the SVG element
  [key: string]: any;
};

export declare type UpSetProps<T = any> = UpSetPropsG<T, CSSStyleDeclaration, UpSetReactElement, string>;
export declare type UpSetFullProps<T = any> = UpSetFullPropsG<T, CSSStyleDeclaration, UpSetReactElement, string>;
export declare type VennDiagramProps<T = any> = VennDiagramPropsG<T, CSSStyleDeclaration, UpSetReactElement, string>;
export declare type VennDiagramFullProps<T = any> = VennDiagramFullPropsG<
  T,
  CSSStyleDeclaration,
  UpSetReactElement,
  string
>;
export declare type KarnaughMapProps<T = any> = KarnaughMapPropsG<T, CSSStyleDeclaration, UpSetReactElement, string>;
export declare type KarnaughMapFullProps<T = any> = KarnaughMapFullPropsG<
  T,
  CSSStyleDeclaration,
  UpSetReactElement,
  string
>;

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillDefaults<T = any>(props: UpSetProps<T>): UpSetFullProps<T> {
  const p: UpSetReactProps<T> = props as UpSetProps<T> & { style: any; styles: UpSetMultiStyle<any> };
  return fillDefaultsImpl(p) as UpSetFullProps<T>;
}

/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillVennDiagramDefaults<T = any>(props: VennDiagramProps<T>): VennDiagramFullProps<T> {
  const p: VennDiagramReactProps<T> = props as VennDiagramProps<T> & { style: any; styles: VennDiagramMultiStyle<any> };
  return fillVennDiagramDefaultsImpl(p) as VennDiagramFullProps<T>;
}
/**
 * helper methods to fill up partial UpSet.js properties with their default values
 */
export function fillKarnaughMapDefaults<T = any>(props: KarnaughMapProps<T>): KarnaughMapFullProps<T> {
  const p: KarnaughMapReactProps<T> = props as KarnaughMapProps<T> & { style: any; styles: KarnaughMapMultiStyle<any> };
  return fillKarnaughMapDefaultsImpl(p) as KarnaughMapFullProps<T>;
}

/**
 * renders the UpSetJS component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function render<T = any>(node: HTMLElement, props: UpSetProps<T>) {
  const p: UpSetReactProps<T> = props as UpSetProps<T> & { style: any; styles: UpSetMultiStyle<any> };
  renderPreact(h(UpSetElement as any, p), node);
}

/**
 * renders the VennDiagram component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function renderVennDiagram<T = any>(node: HTMLElement, props: VennDiagramProps<T>) {
  const p: VennDiagramReactProps<T> = props as VennDiagramProps<T> & { style: any; styles: VennDiagramMultiStyle<any> };
  renderPreact(h(VennDiagramElement as any, p), node);
}
/**
 * renders the KarnaughMap component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function renderKarnaughMap<T = any>(node: HTMLElement, props: KarnaughMapProps<T>) {
  const p: KarnaughMapReactProps<T> = props as KarnaughMapProps<T> & { style: any; styles: KarnaughMapMultiStyle<any> };
  renderPreact(h(KarnaughMapElement as any, p), node);
}

/**
 * renders the UpSetJS skeleton component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function renderSkeleton(node: HTMLElement, props: UpSetJSSkeletonProps) {
  const p: UpSetJSSkeletonPropsImpl = props;
  renderPreact(h(UpSetJSSkeleton as any, p), node);
}

/**
 * renders the VennDiagram skeleton component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function renderVennDiagramSkeleton(node: HTMLElement, props: UpSetJSSkeletonProps) {
  const p: UpSetJSSkeletonPropsImpl = props;
  renderPreact(h(VennDiagramSkeleton as any, p), node);
}
/**
 * renders the KarnaughMap skeleton component
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function renderKarnaughMapSkeleton(node: HTMLElement, props: UpSetJSSkeletonProps) {
  const p: UpSetJSSkeletonPropsImpl = props;
  renderPreact(h(KarnaughMapSkeleton as any, p), node);
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
  const p: UpSetReactProps<T> = props as UpSetProps<T> & { style: any; styles: UpSetMultiStyle<any> };
  hydratePreact(h(UpSetElement as any, p), node);
}

/**
 * hydrates the VennDiagram component when applied on a server rendered version
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function hydrateVennDiagram<T = any>(node: HTMLElement, props: VennDiagramProps<T>) {
  const p: VennDiagramReactProps<T> = props as VennDiagramProps<T> & { style: any; styles: VennDiagramMultiStyle<any> };
  hydratePreact(h(VennDiagramElement as any, p), node);
}
/**
 * hydrates the KarnaughMap component when applied on a server rendered version
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function hydrateKarnaughMap<T = any>(node: HTMLElement, props: KarnaughMapProps<T>) {
  const p: KarnaughMapReactProps<T> = props as KarnaughMapProps<T> & { style: any; styles: KarnaughMapMultiStyle<any> };
  hydratePreact(h(KarnaughMapElement as any, p), node);
}

/**
 * hydrates the UpSetJS Skeleton component when applied on a server rendered version
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function hydrateSkeleton(node: HTMLElement, props: UpSetJSSkeletonProps) {
  const p: UpSetJSSkeletonPropsImpl = props;
  hydratePreact(h(UpSetJSSkeleton as any, p), node);
}

/**
 * hydrates the VennDiagram Skeleton component when applied on a server rendered version
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function hydrateVennDiagramSkeleton(node: HTMLElement, props: UpSetJSSkeletonProps) {
  const p: UpSetJSSkeletonPropsImpl = props;
  hydratePreact(h(VennDiagramSkeleton as any, p), node);
}

/**
 * hydrates the KarnaughMap Skeleton component when applied on a server rendered version
 * @param node the DOM node to render the component into
 * @param props the properties of the component
 */
export function hydrateKarnaughMapSkeleton(node: HTMLElement, props: UpSetJSSkeletonProps) {
  const p: UpSetJSSkeletonPropsImpl = props;
  hydratePreact(h(KarnaughMapSkeleton as any, p), node);
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
  elements: readonly (number | string | any)[],
  props: Partial<UpSetProps<any>>,
  author?: string,
  mode?: 'upset' | 'venn' | 'kmap'
): IUpSetJSDump {
  return toUpSetJSDumpImpl(
    dump,
    elements,
    props as Partial<UpSetProps<any> & { style: any; styles: UpSetMultiStyle<any> }>,
    author,
    mode
  );
}

export function toUpSetJSStaticDump(
  dump: IUpSetStaticDump,
  props: Partial<UpSetProps<any>>,
  author?: string,
  mode?: 'upset' | 'venn' | 'kmap'
): IUpSetJSStaticDump {
  return toUpSetJSStaticDumpImpl(
    dump,
    props as Partial<UpSetProps<any> & { style: any; styles: UpSetMultiStyle<any> }>,
    author,
    mode
  );
}
