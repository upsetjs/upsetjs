import { toJS } from 'mobx';
import { IEmbeddedDumpSchema } from '../embed/interfaces';
import Store, { stripDefaults } from '../store/Store';
import exportHelper from './exportHelper';

export function toEmbeddedDump(store: Store): IEmbeddedDumpSchema {
  const helper = exportHelper(store);
  const ds = store.dataset!;

  return {
    name: ds.name,
    description: ds.description,
    author: ds.author,
    elements: helper.elems,
    sets: helper.sets.map((set) => ({
      ...set,
      elems: set.elems.map(helper.toElemIndex),
    })),
    combinations: toJS(store.combinationsOptions),
    props: stripDefaults(store.props),
    selection: store.hover ? helper.toSetRef(store.hover) : undefined,
    queries: store.visibleQueries.map((q) => ({
      name: q.name,
      color: q.color,
      set: helper.toSetRef(q.set),
    })),
  };
}

export default function exportEmbedded(store: Store) {
  const r = toEmbeddedDump(store);
  return JSON.stringify(r);
}
