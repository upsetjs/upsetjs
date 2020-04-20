import { ISetLike } from '@upsetjs/model';
import { ISetRef } from '../dump';
import Store from '../store/Store';
import { IElem, IAttrs } from './interfaces';

function toIndex<T>(arr: ReadonlyArray<T>) {
  const r = new Map(arr.map((v, i) => [v, i]));
  return (v: T) => r.get(v)!;
}

export function compressElems(elems: ReadonlyArray<IElem>, attrs: string[]) {
  return elems.map((elem) => {
    if (attrs.length === 0) {
      return elem.name;
    }
    const r: any = { name: elem.name };
    attrs.forEach((attr) => (r[attr] = elem.attrs[attr]));
    return r;
  });
}

export function uncompressElems(elems: ReadonlyArray<any>, attrNames: string[]): IElem[] {
  return elems.map(
    (elem): IElem => {
      if (typeof elem === 'string' || typeof elem === 'number') {
        return { name: String(elem), attrs: {} };
      }
      const attrs: IAttrs = elem.attrs ?? {};
      attrNames.forEach((attr) => {
        if (typeof elem[attr] !== 'undefined') {
          attrs[attr] = elem[attr];
        }
      });
      return { name: elem.name, attrs };
    }
  );
}

export default function exportHelper(store: Store, options: { all?: boolean } = {}) {
  let elems = store.elems;
  const all = store.combinationsOptions.min === 0;
  const sets = options.all ? store.sortedSets : store.visibleSets;
  if (!all) {
    // we can filter out the members that are not used at all
    const union = new Set(sets.map((s) => s.elems).flat());
    elems = elems.filter((elem) => union.has(elem));
  }
  const toElemIndex = toIndex(elems);
  const toSetIndex = toIndex(sets);
  const toCombinationIndex = toIndex(store.visibleCombinations);

  const toSetRef = (set: ISetLike<any>): ISetRef => {
    return {
      type: set.type,
      index: set.type === 'set' ? toSetIndex(set) : toCombinationIndex(set),
    };
  };

  const allAttrs = store.dataset?.attrs ?? [];
  const attrs = options.all ? allAttrs : allAttrs.filter((a) => store.selectedAttrs.has(a));

  return {
    all,
    sets,
    elems: compressElems(elems, attrs),
    attrs,
    toElemIndex,
    toSetIndex,
    toCombinationIndx: toCombinationIndex,
    toSetRef,
  };
}
