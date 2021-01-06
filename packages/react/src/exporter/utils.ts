/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

export function extractStyleId(node: SVGSVGElement) {
  return Array.from(node.classList)
    .find((d) => d.startsWith('root-'))!
    .slice('root-'.length);
}

export function extractTitle(node: SVGSVGElement, styleId: string) {
  return node.querySelector(`titleTextStyle-${styleId}`)?.textContent ?? 'UpSetJS';
}

export function extractDescription(node: SVGSVGElement, styleId: string) {
  return node.querySelector(`descTextStyle-${styleId}`)?.textContent ?? '';
}
