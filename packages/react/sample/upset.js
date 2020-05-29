async function loadUpSetJS() {
  document.body.style.backgroundColor = 'black';
  document.body.insertAdjacentHTML('afterend', '<div id="app"></div>');

  function loadScript(url) {
    const s = document.createElement('script');
    s.crossOrigin = true;
    s.src = url;
    document.head.appendChild(s);
    return new Promise((resolve) => (s.onload = resolve));
  }

  await Promise.all([
    loadScript('https://unpkg.com/react@16/umd/react.development.js'),
    loadScript('https://unpkg.com/react-dom@16/umd/react-dom.development.js'),
    loadScript('https://unpkg.com/lz-string'),
  ]);

  window.UpSetJSModel = window.exports = {};

  let s = document.createElement('script');
  s.src = '../../model/dist/model.cjs.development.js';
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
  s.src = '../dist/react.cjs.development.js';
  document.body.appendChild(s);
  await new Promise((resolve) => (s.onload = resolve));

  function render(props) {
    window.ReactDOM.render(window.React.createElement(window.exports.default, props), document.getElementById('app'));
  }

  const elems = await fetch('../src/data/got.json').then((r) => r.json());
  return { UpSetJS: window.exports, render, elems };
}
