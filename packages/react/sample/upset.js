async function loadUpSetJS() {
  document.body.insertAdjacentHTML('afterbegin', '<div id="app"></div>');

  function loadScript(url) {
    const s = document.createElement('script');
    s.crossOrigin = true;
    s.src = url;
    document.head.appendChild(s);
    return new Promise((resolve) => (s.onload = resolve));
  }

  await Promise.all([
    loadScript('https://cdn.jsdelivr.net/npm/react@17/umd/react.development.js'),
    loadScript('https://cdn.jsdelivr.net/npm/react-dom@17/umd/react-dom.development.js'),
    loadScript('https://cdn.jsdelivr.net/npm/lz-string'),
  ]);

  window.UpSetJSModel = window.exports = {};

  let s = document.createElement('script');
  s.src = '../../model/dist/index.js';
  s.type = 'module';
  document.body.appendChild(s);
  await new Promise((resolve) => (s.onload = resolve));

  window.require = function require(id) {
    if (id === 'react') {
      return window.React;
    }
    if (id === 'lz-string') {
      return window.LZString;
    }
    if (id === '@upsetjs/model') {
      return window.UpSetJSModel;
    }
  };
  window.UpSetJS = window.exports = {};

  s = document.createElement('script');
  s.src = '../dist/index.js';
  s.type = 'module';
  document.body.appendChild(s);
  await new Promise((resolve) => (s.onload = resolve));

  const theme =
    new URLSearchParams(window.location.search).get('theme') ||
    (window.matchMedia('prefers-color-scheme: dark').matches ? 'dark' : 'light');

  function render(props, elem, root) {
    props.theme = theme;
    window.ReactDOM.render(
      window.React.createElement(elem || window.exports.default, props),
      root || document.getElementById('app')
    );
  }
  function renderInteractive(props, elem, root) {
    props.onHover = (s) => {
      props.selection = s;
      render(props, elem, root);
    };
    render(props, elem, root);
  }
  document.body.style.backgroundColor = window.exports.getDefaultTheme(theme).backgroundColor;

  const elems = await fetch('../src/__stories__/data/got.json').then((r) => r.json());
  return { UpSetJS: window.exports, UpSetJSModel: window.UpSetJSModel, render, elems, theme, renderInteractive };
}
