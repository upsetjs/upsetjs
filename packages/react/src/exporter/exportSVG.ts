/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { extractStyleId, extractTitle } from './utils';
import { getDefaultTheme } from '../fillDefaults';
import type { UpSetThemes } from '../interfaces';

export function createSVG(node: SVGSVGElement, toRemove?: string) {
  const clone = node.cloneNode(true) as SVGSVGElement;
  clone.style.backgroundColor = getDefaultTheme(node.dataset.theme as UpSetThemes).backgroundColor;

  if (toRemove) {
    Array.from(clone.querySelectorAll(toRemove)).forEach((d) => d.remove());
  }
  return new XMLSerializer().serializeToString(clone);
}

/**
 * helper method to export an download an SVG image
 * @param node the SVG element to download
 * @param options additional options
 */
export function exportSVG(
  node: SVGSVGElement,
  { type = 'png', title, toRemove }: { type?: 'png' | 'svg'; title?: string; toRemove?: string }
): Promise<void> {
  const b = new Blob([createSVG(node, toRemove)], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const styleId = extractStyleId(node);

  const chartTitle = title ?? extractTitle(node, styleId);
  const url = URL.createObjectURL(b);
  if (type === 'svg') {
    downloadUrl(url, `${chartTitle}.${type}`, node.ownerDocument!);
    URL.revokeObjectURL(url);
    return Promise.resolve();
  }
  return toPNG(url, node).then((purl) => {
    downloadUrl(purl, `${chartTitle}.${type}`, node.ownerDocument!);
    URL.revokeObjectURL(url);
  });
}

function toPNG(url: string, node: SVGGElement) {
  const canvas = node.ownerDocument!.createElement('canvas');
  const bb = node.getBoundingClientRect();
  canvas.width = bb.width;
  canvas.height = bb.height;
  const ctx = canvas.getContext('2d')!;
  const img = new Image(canvas.width, canvas.height);

  return new Promise<string>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL('image/png');
      resolve(png);
    };
    img.src = url;
  });
}

/**
 * helper method to download a given url in the browser
 * @param url the url to download
 * @param title the desired file name
 * @param doc the root document
 */
export function downloadUrl(url: string, title: string, doc: Document) {
  const a = doc.createElement('a');
  a.href = url;
  a.style.position = 'absolute';
  a.style.left = '-10000px';
  a.style.top = '-10000px';
  a.download = title;
  doc.body.appendChild(a);
  a.click();
  a.remove();
}
