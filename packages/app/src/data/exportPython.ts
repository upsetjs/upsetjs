import Store, { stripDefaults } from '../store/Store';
import { ISetLike } from '@upsetjs/model';
import { ICustomizeOptions } from './interfaces';

function toSnakeCase(v: string) {
  return v.replace(/\W/gm, (v) => `_${v.toLowerCase()}`);
}

export default function exportPython(store: Store) {
  // support addons
  // TODO support props

  const toRef = (s: ISetLike<any>) => {
    return `next(s for s in w.${s.type === 'set' ? 'sets' : 'combinations'} if s.name == "${s.name}")`;
  };

  const c = store.combinationsOptions;
  const generate = `w.generate_${c.type}s(min_degree=${c.min}, max_degree=${c.max}, empty=${
    c.empty ? 'True' : 'False'
  }, limit=${c.limit})\n`;
  const selection = store.selection ? `w.selection = ${toRef(store.selection)}\n` : null;
  const queries = store.visibleQueries.map((q) => `w.append_query("${q.name}", "${q.color}", upset=${toRef(q.set)})\n`);

  const props: string[] = [];
  const p = stripDefaults(store.props, store.ui.theme);
  Object.keys(p).forEach((key) => {
    const k = key as keyof ICustomizeOptions;
    const v = p[k];
    props.push(`w.${toSnakeCase(k)} = ${JSON.stringify(v)}\n`);
    // TODO special cases font_sizes and widht height ratios
  });

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
          'from upsetjs_jupyter_widget import UpSetWidget\n',
          'import pandas as pd',
        ],
      },
      {
        cell_type: 'code',
        execution_count: 40,
        metadata: {},
        outputs: [],
        source: [
          'dict_input = {\n',
          ...store.visibleSets.map(
            (s, i) =>
              `   "${s.name}": ${JSON.stringify(s.elems.map((e) => e.name))}${
                i < store.visibleSets.length - 1 ? ',' : ''
              }\n`
          ),
          '}\n',
          '\n',
          'w = UpSetWidget[str]()\n',
          'w.from_dict(dict_input)\n',
          generate,
          selection,
          ...queries,
          ...props,
          'w',
        ].filter(Boolean),
      },
    ],
  };
  return JSON.stringify(nb, null, 2);
}
