/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import Store, { stripDefaults, UpSetDataQuery } from '../store/Store';
import { ISetLike, isElemQuery, UpSetSetQuery } from '@upsetjs/model';
import { ICustomizeOptions, IElem, IElems } from './interfaces';

function toSnakeCase(v: string) {
  return v.replace(/([A-Z])/gm, (v) => `_${v.toLowerCase()}`);
}

function generateProps(store: Store) {
  const props: string[] = [];
  const p = stripDefaults(store.props, store.ui.theme);
  Object.keys(p).forEach((key) => {
    const k = key as keyof ICustomizeOptions;
    const v = p[k];
    if (k === 'heightRatios' || k === 'widthRatios') {
      props.push(`w.${toSnakeCase(k)} = (${v})\n`);
    } else if (k === 'fontSizes') {
      Object.keys(v as object).forEach((fk) => {
        props.push(`w.font_sizes.${toSnakeCase(fk)} = "${(v as any)[fk]}"\n`);
      });
    } else {
      props.push(`w.${toSnakeCase(k)} = ${JSON.stringify(v)}\n`);
    }
  });
  return props;
}

function generateSimpleData(store: Store) {
  return [
    'dict_input = OrderedDict([\n',
    ...store.visibleSets.map(
      (s, i) =>
        `   ("${s.name}", ${JSON.stringify(s.elems.map((e) => e.name))})${i < store.visibleSets.length - 1 ? ',' : ''
        }\n`
    ),
    '])\n',
    '\n',
    'w = UpSetJSWidget[str]().from_dict(dict_input)\n',
  ];
}

function generateAddonData(store: Store) {
  const r: string[] = [];
  const attrs = Array.from(store.selectedAttrs);
  r.push(`df = pd.DataFrame({\n`);
  const lastComma = store.visibleSets.length + attrs.length - 1;
  store.visibleSets.forEach((set, i) => {
    const hasElem = new Set(set.elems);
    r.push(
      `  "${set.name}": ${JSON.stringify(store.elems.map((elem) => (hasElem.has(elem) ? 1 : 0)))}${i < lastComma ? ',' : ''
      }\n`
    );
  });
  attrs.forEach((attr, i) => {
    r.push(
      `  "${attr}": ${JSON.stringify(store.elems.map((elem) => elem.attrs[attr]))}${i < attrs.length - 1 ? ',' : ''
        }\n`.replace(/null/g, 'None')
    );
  });
  r.push(`}, index=${JSON.stringify(store.elems.map((e) => e.name))}`);
  r.push(')\n');
  r.push('\n');
  r.push(
    `w = UpSetJSWidget[str]().from_dataframe(df${attrs.length > 0 ? `, attributes=${JSON.stringify(attrs)}` : ''})\n`
  );
  return r;
}

export default function exportPython(store: Store) {
  // support addons
  const data = store.selectedAttrs.size > 0 ? generateAddonData(store) : generateSimpleData(store);

  const toSelectionRef = (s: ISetLike<IElem> | IElems) => {
    if (Array.isArray(s)) {
      return `[${s.map((e) => `"${e.name}"`).join(', ')}]`;
    }
    const set = s as ISetLike<IElem>;
    if (set.type === 'set') {
      return `next(s for s in w.sets if s.name == "${set.name}")`;
    }
    const index = store.visibleCombinations.findIndex((d) => d.name === set.name && d.type === set.type);
    if (index < 0) {
      return `[${set.elems.map((e) => `"${e.name}"`).join(', ')}]`;
    }
    return `next(s for s in w.combinations if s.name == "${set.name}")`;
  };

  const toQueryRef = (q: UpSetDataQuery) => {
    if (isElemQuery(q)) {
      return `elems=[${Array.from(q.elems)
        .map((e) => `"${e.name}"`)
        .join(', ')}]`;
    }
    const set = (q as UpSetSetQuery<IElem>).set;
    if (set.type === 'set') {
      return `upset=next(s for s in w.sets if s.name == "${set.name}")`;
    }
    const index = store.visibleCombinations.findIndex((d) => d.name === set.name && d.type === set.type);
    if (index < 0) {
      return `elems=[${set.elems.map((e) => `"${e.name}"`).join(', ')}]`;
    }
    return `upset=next(s for s in w.combinations if s.name == "${set.name}")`;
  };

  const c = store.combinationsOptions;
  const generate = `w.generate_${c.type}s(min_degree=${c.min}, max_degree=${c.max}, empty=${c.empty ? 'True' : 'False'
    }, limit=${c.limit})\n`;
  const selection = store.selection ? `w.selection = ${toSelectionRef(store.selection)}\n` : null;
  const queries = store.visibleQueries.map((q) => `w.append_query("${q.name}", "${q.color}", ${toQueryRef(q)})\n`);
  const props = generateProps(store);

  const nb = {
    nbformat: 4,
    nbformat_minor: 2,
    metadata: {
      language_info: {
        name: 'python',
        codemirror_mode: {
          name: 'ipython',
          version: 3,
        },
      },
      orig_nbformat: 2,
      file_extension: '.py',
      mimetype: 'text/x-python',
      name: 'python',
      npconvert_exporter: 'python',
      pygments_lexer: 'ipython3',
      version: 3,
    },
    cells: [
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          `# ${store.title}`,
          '\n',
          'Please make sure the jupyter extension is installed:\n',
          '```bash\n',
          'pip install upsetjs_jupyter_widget\n',
          'jupyter labextension install @jupyter-widgets/jupyterlab-manager@3.0.0-alpha.0\n',
          '```\n',
        ],
      },
      {
        cell_type: 'code',
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          'from ipywidgets import interact\n',
          'from collections import OrderedDict\n',
          'from upsetjs_jupyter_widget import UpSetJSWidget\n',
          'import pandas as pd',
        ],
      },
      {
        cell_type: 'code',
        execution_count: 40,
        metadata: {},
        outputs: [],
        source: [...data, generate, selection, ...queries, ...props, 'w'].filter(Boolean),
      },
    ],
  };
  return JSON.stringify(nb, null, 2);
}
