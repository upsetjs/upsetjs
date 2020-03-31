import Store from '../store/Store';

import LZString from 'lz-string';

const HTML_CODE = `<div id="app"></div>`;
const CSS_CODE = `#app {
  width: 100vw;
  height: 100vh;
}`;

function jsCode(store: Store, prefix = 'UpSetJS.') {
  return `
const root = document.getElementById("app");
const props = Object.assign({
  width: root.clientWidth,
  height: root.clientHeight,
}, {
  sets: [],
  title: "${store.title}"
});
${prefix}renderUpSet(root, props);
`;
}

export function exportJSFiddle(store: Store) {
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
  setInput('html', HTML_CODE);
  setInput('css', CSS_CODE);
  setInput('js', jsCode(store));
  setInput('resources', 'https://unpkg.com/@upsetjs/bundle');

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

export function exportCodeSandbox(store: Store) {
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
      'index.js': {
        content: `
import {renderUpSet} from "@upsetjs/bundle";
import "./main.css";

${jsCode(store, '')}
`,
      },
      'package.json': {
        content: {
          name: store.dataset!.name,
          description: store.dataset!.description,
          dependencies: {
            '@upsetjs/bundle': 'latest',
          },
        },
      },
    },
  };

  // based on codesandbox-import-utils
  const json = LZString.compressToBase64(JSON.stringify(parameters))
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
  const data = {
    title: store.title,
    description: store.dataset!.description,
    html: HTML_CODE,
    css: CSS_CODE,
    css_pre_processor: 'scss',
    css_starter: 'normalize',
    js: jsCode(store),
    js_pre_processor: 'babel',
    js_modernizr: false,
    js_external: `https://unpkg.com/@upsetjs/bundle`,
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
