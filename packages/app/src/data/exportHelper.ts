import { ISetLike } from '@upsetjs/model';
import { ISetRef } from '../dump';
import Store from '../store/Store';

function toIndex<T>(arr: ReadonlyArray<T>) {
  const r = new Map(arr.map((v, i) => [v, i]));
  return (v: T) => r.get(v)!;
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

  const attrs = (store.dataset?.attrs ?? []).filter((a) => store.selectedAttrs.has(a));

  return {
    all,
    sets,
    elems: elems.map((elem) => {
      if (attrs.length === 0) {
        return elem.name;
      }
      const r: any = { name: elem.name };
      attrs.forEach((attr) => (r[attr] = elem.attrs[attr]));
      return r;
    }),
    attrs,
    toElemIndex,
    toSetIndex,
    toCombinationIndx: toCombinationIndex,
    toSetRef,
  };
}
