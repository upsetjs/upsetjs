import { toJS } from 'mobx';
import { IEmbeddedDumpSchema } from '../dump';
import Store, { stripDefaults } from '../store/Store';
import exportHelper from './exportHelper';
import { compressToEncodedURIComponent } from 'lz-string';

export function toEmbeddedDump(store: Store): IEmbeddedDumpSchema {
  const helper = exportHelper(store);
  const ds = store.dataset!;

  return {
    name: ds.name,
    description: ds.description,
    author: ds.author,
    elements: toJS(helper.elems),
    attrs: toJS(helper.attrs),
    sets: helper.sets.map((set) => ({
      ...set,
      elems: set.elems.map(helper.toElemIndex),
    })),
    combinations: toJS(store.combinationsOptions),
    props: stripDefaults(store.props, store.ui.theme),
    selection: store.hover ? helper.toSetRef(store.hover) : undefined,
    queries: store.visibleQueries.map((q) => ({
      name: q.name,
      color: q.color,
      set: helper.toSetRef(q.set),
    })),
    interactive: true,
  };
}

export default function shareEmbedded(store: Store) {
  const r = toEmbeddedDump(store);
  const arg = compressToEncodedURIComponent(JSON.stringify(r));
  const url = new URL(window.location.toString());
  url.hash = '';
  url.pathname = 'embed.html';
  url.searchParams.set('p', arg);

  if (url.toString().length < 2048) {
    window.open(url.toString(), '_blank');
  } else {
    // send via frame message
    url.searchParams.delete('p');
    const w = window.open(url.toString(), '_blank');
    w?.addEventListener('load', () => {
      w?.postMessage(r, url.origin);
    });
  }

  // const a = document.createElement('a');
  // a.href = url.toString();
  // a.target = '_blank';
  // a.rel = 'noopener noreferrer';
  // document.body.appendChild(a);
  // a.click();
  // a.remove();
}
