async function loadUpSetJS() {
  document.body.style.backgroundColor = 'black';
  document.body.insertAdjacentHTML('afterend', '<div id="app"></div>');

  const react = document.createElement('script');
  react.crossOrigin = true;
  react.src = 'https://unpkg.com/react@16/umd/react.development.js';
  document.head.appendChild(react);
  await new Promise((resolve) => (react.onload = resolve));
  const reactDOM = document.createElement('script');
  reactDOM.crossOrigin = true;
  reactDOM.src = 'https://unpkg.com/react-dom@16/umd/react-dom.development.js';
  document.head.appendChild(reactDOM);
  await new Promise((resolve) => (reactDOM.onload = resolve));

  window.UpSetJSModel = window.exports = {};

  let s = document.createElement('script');
  s.src = '../../model/dist/model.cjs.development.js';
  document.body.appendChild(s);
  await new Promise((resolve) => (s.onload = resolve));

  window.require = function require(id) {
    if (id === 'react') {
      return window.React;
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
  return { UpSetJS: window.exports, render };
}
