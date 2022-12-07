/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import { toJS } from 'mobx';
import type Store from '../store/Store';
import exportHelper from './exportHelper';
import { toDump, toStaticDump } from '@upsetjs/model';
import { compressToEncodedURIComponent } from 'lz-string';
import { toUpSetJSDump, toUpSetJSStaticDump, IUpSetJSDump, IUpSetJSStaticDump } from '@upsetjs/react';

export function toEmbeddedDump(
  store: Store,
  options: { all?: boolean; compress?: 'yes' | 'no' | 'auto' } = {}
): IUpSetJSDump {
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

  return Object.assign({}, toUpSetJSDump(dump, toJS(helper.elems), toJS(store.props), ds.author), {
    name: ds.name,
    description: ds.description,
    author: ds.author,
    attrs: toJS(helper.attrs),
  });
}

export function toEmbeddedStaticDump(
  store: Store,
  options: { compress?: 'yes' | 'no' | 'auto' } = {}
): IUpSetJSStaticDump {
  const ds = store.dataset!;
  const dump = toStaticDump(
    {
      sets: store.visibleSets,
      combinations: store.visibleCombinations,
      selection: store.selection ?? undefined,
      queries: store.visibleQueries,
    },
    options
  );

  return Object.assign({}, toUpSetJSStaticDump(dump, toJS(store.props), ds.author), {
    name: ds.name,
    description: ds.description,
    author: ds.author,
  });
}

export const MAX_URL_LENGTH = 2048 * 2;

export default function shareEmbedded(store: Store) {
  const r: any = toEmbeddedDump(store, { compress: 'yes' });
  delete r.$schema;
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

  if (url.toString().length < MAX_URL_LENGTH) {
    window.open(url.toString(), '_blank');
    return true;
  }
  if (store.selectedAttrs.size === 0) {
    // try other compression
    const r: any = toEmbeddedStaticDump(store, { compress: 'yes' });
    delete r.$schema;
    const arg = compressToEncodedURIComponent(JSON.stringify(r));
    url.searchParams.set('p', arg);

    if (url.toString().length < MAX_URL_LENGTH) {
      window.open(url.toString(), '_blank');
      return true;
    }
  }

  // send via frame message
  url.searchParams.delete('p');
  const w = window.open(url.toString(), '_blank');
  w?.addEventListener('load', () => {
    w?.postMessage(r, url.origin);
  });
  return false;
}
