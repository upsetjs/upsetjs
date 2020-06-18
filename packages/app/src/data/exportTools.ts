/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import Store, { stripDefaults, UpSetDataQuery } from '../store/Store';

import { toIndicesArray, ISetLike, isSetQuery, isSetLike, isElemQuery, UpSetSetQuery } from '@upsetjs/model';
import { compressToBase64 } from 'lz-string';
import { toJS } from 'mobx';
import exportHelper from './exportHelper';
import { IElem, IElems } from './interfaces';

declare const __VERSION__: string;

const HTML_CODE = `<div id="app"></div>`;
const CSS_CODE = `#app {
  width: 100vw;
  height: 100vh;
}`;

export function withColor<T>(v: T, s: { color?: string }): T & { color?: string } {
  if (s.color) {
    (v as T & { color?: string }).color = s.color;
  }
  return v;
}

function toJSCode(store: Store, prefix = 'UpSetJS.') {
  const helper = exportHelper(store);

  function toIndices(arr: IElems | ReadonlySet<IElem>) {
    return `${prefix}fromIndicesArray(${JSON.stringify(
      toIndicesArray(Array.from(arr), helper.toElemIndex, { sortAble: true })
    ).replace(/"/gm, "'")}, elems)`;
  }

  const setElems = store.visibleSets.map((s) => toIndices(s.elems));
  const sets = store.visibleSets.map((s, i) =>
    withColor(
      {
        name: s.name,
        elems: `CC${prefix}fromIndicesArray(${JSON.stringify(setElems[i]).replace(/"/gm, "'")}, elems)CC`,
      },
      s
    )
  );

  const needSetRef = store.visibleQueries.some(isSetQuery) || isSetLike(store.selection);

  const toSetRef = (v: ISetLike<any>) => {
    const ref = helper.toSetRef(v);
    return `fromSetRef({ type: '${ref.type}', index: ${ref.index} })`;
  };

  function toSelectionRef(s: ISetLike<IElem> | IElems) {
    if (Array.isArray(s)) {
      return toIndices(s);
    }
    const set = s as ISetLike<IElem>;
    if (set.type === 'set') {
      return toSetRef(set);
    }
    const index = store.visibleCombinations.findIndex((d) => d.name === set.name && d.type === set.type);
    if (index < 0) {
      return toIndices(set.elems);
    }
    return toSetRef(set);
  }

  function toQueryRef(q: UpSetDataQuery) {
    if (isElemQuery(q)) {
      return {
        name: q.name,
        color: q.color,
        elems: `CC${toIndices(q.elems)}CC`,
      };
    }
    const set = (q as UpSetSetQuery<IElem>).set;
    if (set.type === 'set') {
      return {
        name: q.name,
        color: q.color,
        set: `CC${toSetRef(set)}CC`,
      };
    }
    const index = store.visibleCombinations.findIndex((d) => d.name === set.name && d.type === set.type);
    if (index < 0) {
      return {
        name: q.name,
        color: q.color,
        elems: `CC${toIndices(set.elems)}CC`,
      };
    }
    return {
      name: q.name,
      color: q.color,
      set: `CC${toSetRef(set)}CC`,
    };
  }

  const addons =
    helper.attrs.length > 0
      ? `
  setAddons: ${JSON.stringify(
    helper.attrs.map((attr) => `CC${prefix}boxplotAddon((v) => v['${attr}'], elems, { name: '${attr}' })CC`)
  )},
  combinationAddons: ${JSON.stringify(
    helper.attrs.map(
      (attr) => `CC${prefix}boxplotAddon((v) => v['${attr}'], elems, { orient: 'vertical', name: '${attr}' })CC`
    )
  )}`
      : '';
  const js = `
const root = document.getElementById("app");
const sets = ${prefix}asSets(${JSON.stringify(toJS(sets), null, 2)});

const combinations = ${prefix}generateCombinations(sets, ${JSON.stringify(
    {
      ...store.combinationsOptions,
      elems: 'CCelemsCC',
    },
    null,
    2
  )});

${
  needSetRef
    ? `function fromSetRef(ref) {
  if (ref.type === "set") {
    return sets[ref.index];
  }
  return combinations[ref.index];
}`
    : ''
}

let selection = ${store.selection ? toSelectionRef(store.selection) : null};
const queries = ${JSON.stringify(store.visibleQueries.map(toQueryRef), null, 2)};

const props = Object.assign({
  width: root.clientWidth,
  height: root.clientHeight,
}, {
  sets: sets,
  combinations: combinations,
  selection: selection,
  queries: queries,${addons}
}, ${JSON.stringify(stripDefaults(store.props, store.ui.theme), null, 2)});

function update() {
  ${prefix}render(root, props);
}

// uncomment for interactivity
props.onHover = (s) => {
  props.selection = s;
  update();
}
//props.onClick = (s) => {
//  console.log(s);
//}

update();

`
    .replace(/"CC/gm, '')
    .replace(/CC"/gm, '');
  return { elems: toJS(helper.elems), js };
}

function toEmbeddedCode(store: Store) {
  const { elems, js } = toJSCode(store);
  const html = `${HTML_CODE}
<script id="data" type="application/json">
${JSON.stringify(elems)}
</script>
`;
  return {
    html,
    js: `const elems = JSON.parse(document.getElementById("data").textContent);
${js}`,
  };
}

export function exportJSFiddle(store: Store) {
  const { html, js } = toEmbeddedCode(store);
  const form = document.createElement('form');
  form.method = 'post';
  form.action = 'https://jsfiddle.net/api/post/library/pure/';
  form.target = '_blank';
  form.rel = 'noopener noreferrer';
  form.innerHTML = `<!--https://docs.jsfiddle.net/api/display-a-fiddle-from-post-->
      <input type="hidden" name="title">
      <input type="hidden" name="description">
      <input type="hidden" name="resources">
      <input type="hidden" name="html">
      <input type="hidden" name="css">
      <input type="hidden" name="js">
      <input type="hidden" name="wrap" value="d">
      <input type="hidden" name="normalize_css" value="yes">
      <input type="hidden" name="css_panel" value="1"><!--SCSS-->
      <input type="hidden" name="js_panel" value="2"><!--JS 1.7-->`;

  const setInput = (name: string, value: any) => {
    const input = form.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
    input.value = value.toString();
  };

  setInput('title', store.title);
  setInput('description', store.dataset!.description);
  setInput('html', html);
  setInput('css', CSS_CODE);
  setInput('js', js);
  setInput('resources', `https://cdn.jsdelivr.net/npm/@upsetjs/bundle@${encodeURIComponent('^')}${__VERSION__}`);

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

export function exportCodeSandbox(store: Store) {
  const { elems, js } = toJSCode(store, '');
  const hasAddons = js.includes('boxplotAddon(');
  const hasIndices = js.includes('fromIndicesArray');
  const parameters = {
    files: {
      'index.html': {
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <title>${store.title}</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
</head>
<body>
${HTML_CODE}
</body>
</html>`,
      },
      'main.css': {
        content: CSS_CODE,
      },
      'data.json': {
        content: elems,
      },
      'index.js': {
        content: `
import {render, generateCombinations, ${hasIndices ? 'fromIndicesArray, ' : ''}${
          hasAddons ? 'boxplotAddon, ' : ''
        }asSets)} from "@upsetjs/bundle";
import elems from './data.json';
import "./main.css";

${js}
`,
      },
      'package.json': {
        content: {
          name: store.dataset!.name,
          description: store.dataset!.description,
          dependencies: {
            '@upsetjs/bundle': `^${__VERSION__}`,
          },
        },
      },
    },
  };

  // based on codesandbox-import-utils
  const json = compressToBase64(JSON.stringify(parameters))
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='

  const form = document.createElement('form');
  form.method = 'post';
  form.action = 'https://codesandbox.io/api/v1/sandboxes/define';
  form.target = '_blank';
  form.rel = 'noopener noreferrer';
  form.innerHTML = `<input type="hidden" name="parameters">`;
  (form.firstElementChild as HTMLInputElement).value = json;
  document.body.appendChild(form);
  form.submit();
  form.remove();
}

export function exportCodepen(store: Store) {
  const { html, js } = toEmbeddedCode(store);
  const data = {
    title: store.title,
    description: store.dataset!.description,
    html,
    css: CSS_CODE,
    css_pre_processor: 'scss',
    css_starter: 'normalize',
    js,
    js_pre_processor: 'babel',
    js_modernizr: false,
    js_external: `https://cdn.jsdelivr.net/npm/@upsetjs/bundle@${encodeURIComponent('^')}${__VERSION__}`,
  };

  const json = JSON.stringify(data)
    // Quotes will screw up the JSON
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const form = document.createElement('form');
  form.method = 'post';
  form.action = 'https://codepen.io/pen/define';
  form.target = '_blank';
  form.rel = 'noopener noreferrer';
  form.innerHTML = `<input type="hidden" name="data">`;
  (form.firstElementChild! as HTMLInputElement).value = json;

  document.body.appendChild(form);
  form.submit();
  form.remove();
}
