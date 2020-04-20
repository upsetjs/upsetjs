import { toJS } from 'mobx';
import { IEmbeddedDumpSchema } from '../dump';
import Store, { stripDefaults } from '../store/Store';
import exportHelper from './exportHelper';
import { toIndicesArray } from '@upsetjs/model';
import { compressToEncodedURIComponent } from 'lz-string';

export function toEmbeddedDump(store: Store, options: { all?: boolean } = {}): IEmbeddedDumpSchema {
  const helper = exportHelper(store, options);
  const ds = store.dataset!;

  return {
    name: ds.name,
    description: ds.description,
    author: ds.author,
    elements: toJS(helper.elems),
    attrs: toJS(helper.attrs),
    sets: helper.sets.map((set) => ({
      ...set,
      elems: toIndicesArray(set.elems, helper.toElemIndex, true),
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
  if (url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}embed.html`;
  } else if (url.pathname.endsWith('index.html')) {
    url.pathname = url.pathname.replace('index.html', 'embed.html');
  } else {
    url.pathname = `${url.pathname}/embed.html`;
  }
  url.search = '?';
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
