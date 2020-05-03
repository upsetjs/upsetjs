/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { DARK_BACKGROUND_COLOR } from '../defaults';

/**
 * helper method to export an download an SVG image
 * @param node the SVG element to download
 * @param options additional options
 */
export function exportSVG(
  node: SVGSVGElement,
  { type = 'png', title = 'UpSet', toRemove }: { type?: 'png' | 'svg'; title?: string; toRemove?: string }
): Promise<void> {
  const theme = node.dataset.theme;
  const clone = node.cloneNode(true) as SVGSVGElement;
  clone.style.backgroundColor = theme === 'dark' ? DARK_BACKGROUND_COLOR : 'white';

  if (toRemove) {
    Array.from(clone.querySelectorAll(toRemove)).forEach((d) => d.remove());
  }

  const b = new Blob([new XMLSerializer().serializeToString(clone)], {
    type: 'image/svg+xml;charset=utf-8',
  });

  const url = URL.createObjectURL(b);
  if (type === 'svg') {
    downloadUrl(url, `${title}.${type}`, node.ownerDocument!);
    URL.revokeObjectURL(url);
    return Promise.resolve();
  }
  return toPNG(url, node).then((purl) => {
    downloadUrl(purl, `${title}.${type}`, node.ownerDocument!);
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
  document.body.appendChild(a);
  a.click();
  a.remove();
}
