/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import Store, { stripDefaults } from '../store/Store';

import { toIndicesArray, ISetLike } from '@upsetjs/model';
import { compressToBase64 } from 'lz-string';
import { toJS } from 'mobx';
import exportHelper from './exportHelper';

declare const __VERSION__: string;

const HTML_CODE = `<div id="app"></div>`;
const CSS_CODE = `#app {
  width: 100vw;
  height: 100vh;
}`;

function toJSCode(store: Store, prefix = 'UpSetJS.') {
  const helper = exportHelper(store);
  const setElems = store.visibleSets.map((s) => toIndicesArray(s.elems, helper.toElemIndex, { sortAble: true }));
  const sets = store.visibleSets.map((s, i) => ({
    name: s.name,
    elems: `CC${prefix}fromIndicesArray(${JSON.stringify(setElems[i]).replace(/"/gm, "'")}, elems)CC`,
  }));

  const needSetRef = store.visibleQueries.length > 0 || store.selection != null;

  const toSetRef = (v: ISetLike<any>) => {
    const ref = helper.toSetRef(v);
    return `{ type: '${ref.type}', index: ${ref.index} }`;
  };

  const addons =
    helper.attrs.length > 0
      ? `
  setAddons: ${JSON.stringify(
    helper.attrs.map((attr) => `CC${prefix}boxplotAddon((v) => v['${attr}'], elems, { name: '${attr}' })CC`).join(',')
  )},
  combinationAddons: ${JSON.stringify(
    helper.attrs
      .map((attr) => `CC${prefix}boxplotAddon((v) => v['${attr}'], elems, { orient: 'vertical', name: '${attr}' })CC`)
      .join(',')
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

let selection = ${store.selection ? `CCfromSetRef(${toSetRef(store.selection)})CC` : null};
const queries = ${JSON.stringify(
    store.visibleQueries.map((q) => ({
      name: q.name,
      color: q.color,
      set: `CCfromSetRef(${toSetRef(q.set)})CC`,
    })),
    null,
    2
  )};

const props = Object.assign({
  width: root.clientWidth,
  height: root.clientHeight,
}, {
  sets: sets,
  combinations: combinations,
  selection: selection,
  queries: queries,${addons}
}, ${JSON.stringify(stripDefaults(store.props, store.ui.theme), null, 2)});

function render() {
  ${prefix}renderUpSet(root, props);
}

// uncomment for interactivity
props.onHover = (s) => {
  props.selection = s;
  render();
}
//props.onClick = (s) => {
//  console.log(s);
//}

render();

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
  setInput('resources', `https://unpkg.com/@upsetjs/bundle@${encodeURIComponent('^')}${__VERSION__}`);

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

export function exportCodeSandbox(store: Store) {
  const { elems, js } = toJSCode(store, '');
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
import {renderUpSet, generateCombinations, fromIndexArray, asSets} from "@upsetjs/bundle";
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
    js_external: `https://unpkg.com/@upsetjs/bundle@${encodeURIComponent('^')}${__VERSION__}`,
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
