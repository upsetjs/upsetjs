import { ISetLike } from '@upsetjs/model';
import { ISetRef } from '../dump';
import Store from '../store/Store';

function toIndex<T>(arr: ReadonlyArray<T>) {
  const r = new Map(arr.map((v, i) => [v, i]));
  return (v: T) => r.get(v)!;
}

export default function exportHelper(store: Store) {
  const toElemIndex = toIndex(store.elems);
  const toSetIndex = toIndex(store.visibleSets);
  const toCombinationIndx = toIndex(store.visibleCombinations);

  const toSetRef = (set: ISetLike<any>): ISetRef => {
    return {
      type: set.type,
      index: set.type === 'set' ? toSetIndex(set) : toCombinationIndx(set),
    };
  };

  return {
    sets: store.visibleSets,
    elems: store.elems,
    attrs: store.dataset?.attrs ?? [],
    toElemIndex,
    toSetIndex,
    toCombinationIndx,
    toSetRef,
  };
}
