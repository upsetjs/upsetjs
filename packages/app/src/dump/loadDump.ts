/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

export { fromDump as default } from '@upsetjs/model';

interface IElem {
  name: string;
  attrs: { [key: string]: number };
}

export function compressElems(elems: readonly IElem[], attrs: readonly string[], max = false) {
  return elems.map((elem) => {
    if (attrs.length === 0) {
      return elem.name;
    }
    if (max) {
      return [elem.name as string | number].concat(attrs.map((attr) => elem.attrs[attr]));
    }
    const r: any = { name: elem.name };
    attrs.forEach((attr) => (r[attr] = elem.attrs[attr]));
    return r;
  });
}

export function decompressElems(elems: readonly any[], attrNames: readonly string[]): IElem[] {
  return elems.map(
    (elem): IElem => {
      if (typeof elem === 'string' || typeof elem === 'number') {
        return { name: String(elem), attrs: {} };
      }
      const attrs: { [key: string]: number } = elem.attrs ?? {};
      if (Array.isArray(elem)) {
        // max compression mode
        attrNames.forEach((attr, i) => (attrs[attr] = elem[i + 1]));
        return { name: elem[0], attrs };
      }
      attrNames.forEach((attr) => {
        if (typeof elem[attr] !== 'undefined') {
          attrs[attr] = elem[attr];
        }
      });
      return { name: elem.name, attrs };
    }
  );
}
