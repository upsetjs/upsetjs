import { toJS } from 'mobx';
import { IEmbeddedDumpSchema } from '../dump';
import Store, { stripDefaults } from '../store/Store';
import exportHelper from './exportHelper';
import { toDump } from '@upsetjs/model';
import { compressToEncodedURIComponent } from 'lz-string';

export function toEmbeddedDump(
  store: Store,
  options: { all?: boolean; compress?: 'yes' | 'no' | 'auto' } = {}
): IEmbeddedDumpSchema {
  const helper = exportHelper(store, options);
  const ds = store.dataset!;

  const dump = toDump(
    {
      sets: helper.sets,
      queries: store.visibleQueries,
      toElemIndex: helper.toElemIndex,
      selection: store.selection || undefined,
      combinations: store.visibleCombinations,
      combinationOptions: toJS(store.combinationsOptions),
    },
    {
      compress: options.compress ?? 'auto',
    }
  );

  return {
    ...dump,
    name: ds.name,
    description: ds.description,
    author: ds.author,
    elements: toJS(helper.elems),
    attrs: toJS(helper.attrs),
    props: stripDefaults(store.props, store.ui.theme),
  };
}

export default function shareEmbedded(store: Store) {
  const r = toEmbeddedDump(store, { compress: 'yes' });
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
