/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, IUpSetDumpRef } from '@upsetjs/model';
import { compressElems } from '../dump';
import Store from '../store/Store';

function toIndex<T>(arr: ReadonlyArray<T>) {
  const r = new Map(arr.map((v, i) => [v, i]));
  return (v: T) => r.get(v)!;
}

export default function exportHelper(store: Store, options: { all?: boolean; maxCompress?: boolean } = {}) {
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

  const toSetRef = (set: ISetLike<any>): IUpSetDumpRef => {
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
    elems: compressElems(elems, attrs, options.maxCompress),
    attrs,
    toElemIndex,
    toSetIndex,
    toCombinationIndx: toCombinationIndex,
    toSetRef,
  };
}
