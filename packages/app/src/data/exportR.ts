/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import Store, { stripDefaults, UpSetDataQuery } from '../store/Store';
import { ISetLike, isElemQuery, UpSetSetQuery } from '@upsetjs/model';
import { ICustomizeOptions, IElem, IElems } from './interfaces';

declare const __VERSION__: string;

function toRCase(v: string) {
  return v.replace(/([A-Z])/gm, (v) => `.${v.toLowerCase()}`);
}

function str(v: string | readonly string[]): string {
  if (typeof v === 'string') {
    return `"${v}"`;
  }
  return `c(${v.map(str).join(', ')})`;
}

function toSelectionRef(store: Store, s: ISetLike<IElem> | IElems) {
  if (Array.isArray(s)) {
    return `elems=${str(s.map((e) => e.name))}`;
  }
  const set = s as ISetLike<IElem>;
  if (set.type === 'set') {
    return str(set.name);
  }
  const index = store.visibleCombinations.findIndex((d) => d.name === set.name && d.type === set.type);
  if (index < 0) {
    return `elems=${str(set.elems.map((e) => e.name))}`;
  }
  return str(
    Array.from(set.sets)
      .map((d) => d.name)
      .sort()
  );
}

function toQueryRef(store: Store, q: UpSetDataQuery) {
  if (isElemQuery(q)) {
    return `elems=${str(Array.from(q.elems).map((e) => e.name))}`;
  }
  const set = (q as UpSetSetQuery<IElem>).set;
  if (set.type === 'set') {
    return `set=${str(set.name)}`;
  }
  const index = store.visibleCombinations.findIndex((d) => d.name === set.name && d.type === set.type);
  if (index < 0) {
    return `elems=[${str(set.elems.map((e) => e.name))}`;
  }
  return `set=${str(
    Array.from(set.sets)
      .map((d) => d.name)
      .sort()
  )}`;
}

function generateProps(props: ICustomizeOptions) {
  const keys = Object.keys(props);
  if (keys.length === 0) {
    return '';
  }
  const r: string[] = [];
  keys.forEach((key) => {
    const k = key as keyof ICustomizeOptions;
    const v = props[k];
    if (k === 'widthRatios' || k === 'heightRatios') {
      r.push(`${toRCase(k)} = c(${v})`);
    } else if (k === 'fontSizes') {
      r.push(
        `font.sizes = list(${Object.keys(v!)
          .map((fk) => `${toRCase(fk)} = "${(v as any)![fk]}"`)
          .join(', ')})`
      );
    } else {
      r.push(`${toRCase(k)} = ${JSON.stringify(v)}`);
    }
  });
  return ` %>% chartProps(${r.join(', ')})`;
}

function generateSimpleData(store: Store) {
  return `listInput <- list(
${store.visibleSets.map((s) => `   \`${s.name}\`=${str(s.elems.map((e) => e.name))}`).join(',\n')}
)
upsetjs() %>% fromList(listInput)`;
}

function generateAddonData(store: Store) {
  const elems = store.elems;
  const attrs = Array.from(store.selectedAttrs);

  const sets = store.visibleSets.map((s) => {
    const hasElem = new Set(s.elems);
    return `   \`${s.name}\`= c(${elems.map((e) => (hasElem.has(e) ? 1 : 0)).join(',')})`;
  });

  return `df <- data.frame(
${sets.join(',\n')}
)
rownames(df) <- ${str(elems.map((e) => e.name))}
df.attributes <- list(
${attrs.map((attr) => `\`${attr}\` = c(${elems.map((elem) => elem.attrs[attr] ?? 'NULL').join(',')})`).join(',\n')}
)
upsetjs() %>% fromDataFrame(df, attributes=df.attributes)`;
}

export default function exportR(store: Store) {
  const input = store.selectedAttrs.size > 0 ? generateAddonData(store) : generateSimpleData(store);
  const selection = store.selection ? `%>% setSelection(${toSelectionRef(store, store.selection)})` : '';

  const c = store.combinationsOptions;
  const generate = ` %>% generate${c.type[0].toUpperCase()}${c.type.slice(1)}s(min=${c.min}, max=${c.max}, empty=${c.empty ? 'T' : 'F'
    }, limit=${c.limit}, order.by=${str(c.order!)})`;

  const queries = store.visibleQueries
    .map((q) => `%>% addQuery(${str(q.name)}, ${str(q.color)}, ${toQueryRef(store, q)})`)
    .join('');

  const rProps = generateProps(stripDefaults(store.props, store.ui.theme));

  return `
devtools::install_url("https://github.com/upsetjs/upsetjs_r/releases/v${__VERSION__}/download/upsetjs.tar.gz")
library(upsetjs)

${input} ${generate}${selection}${queries}${rProps} %>% interactiveChart()
`;
}
