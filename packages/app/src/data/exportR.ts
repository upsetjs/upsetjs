import Store, { stripDefaults } from '../store/Store';
import { ISetLike } from '@upsetjs/model';
import { ICustomizeOptions } from './interfaces';

declare const __VERSION__: string;

function toRCase(v: string) {
  return v.replace(/([A-Z])/gm, (v) => `.${v.toLowerCase()}`);
}

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

  const rProps = generateProps(stripDefaults(store.props, store.ui.theme));

  return `
devtools::install_url("https://github.com/upsetjs/upsetjs_r/releases/v${__VERSION__}/download/upsetjs.tar.gz")
library(upsetjs)

listInput <- list(
${store.visibleSets.map((s) => `   \`${s.name}\`=${str(s.elems.map((e) => e.name))}`).join(',\n')}
)
upsetjs() %>% fromList(listInput) ${generate}${selection}${queries}${rProps} %>% interactiveChart()
`;
}
