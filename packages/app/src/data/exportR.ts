import Store from '../store/Store';
import { ISetLike } from '@upsetjs/model';

declare const __VERSION__: string;

function str(v: string | ReadonlyArray<string>): string {
  if (typeof v === 'string') {
    return `"${v}"`;
  }
  return `c(${v.map(str).join(', ')})`;
}

function toRef(s: ISetLike<any>) {
  if (s.type === 'set') {
    return s.name;
  }
  return Array.from(s.sets)
    .map((s) => s.name)
    .sort();
}

export default function exportR(store: Store) {
  // support addons
  // TODO support props
  const selection = store.selection ? `%>% setSelection(${str(toRef(store.selection))})` : '';

  const c = store.combinationsOptions;
  const generate = ` %>% generate${c.type[0].toUpperCase()}${c.type.slice(1)}s(min=${c.min}, max=${c.max}, empty=${
    c.empty ? 'T' : 'F'
  }, limit=${c.limit}, order.by=${str(c.order!)})`;

  const queries = store.visibleQueries
    .map((q) => `%>% addQuery(${str(q.name)}, ${str(q.color)}, set=${str(toRef(q.set))})`)
    .join('');

  // const props = stripDefaults(store.props, store.ui.theme);

  return `
devtools::install_url("https://github.com/upsetjs/upsetjs_r/releases/v${__VERSION__}/download/upsetjs.tar.gz")
library(upsetjs)

listInput <- list(
${store.visibleSets.map((s) => `   \`${s.name}\`=${str(s.elems.map((e) => e.name))}`).join(',\n')}
)
upsetjs() %>% fromList(listInput) ${generate}${selection}${queries} %>% interactiveChart()
`;
}
