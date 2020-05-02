const elems = [
  {
    name: 'Alton Lannister',
    sets: ['was killed', 'Lannister', 'male'],
  },
  {
    name: 'Arya Stark',
    sets: ['Stark', 'female'],
  },
  {
    name: 'Benjen Stark',
    sets: ['was killed', 'Stark', 'male'],
  },
  {
    name: 'Bran Stark',
    sets: ['royal', 'Stark', 'male'],
  },
  {
    name: 'Brandon Stark',
    sets: ['was killed', 'Stark'],
  },
  {
    name: 'Catelyn Stark',
    sets: ['was killed', 'Stark', 'female'],
  },
  {
    name: 'Cersei Lannister',
    sets: ['royal', 'was killed', 'Lannister', 'female'],
  },
  {
    name: 'Eddard Stark',
    sets: ['was killed', 'Stark', 'male'],
  },
  {
    name: 'Jaime Lannister',
    sets: ['was killed', 'Lannister', 'male'],
  },
  {
    name: 'Jon Snow',
    sets: ['royal', 'was killed', 'Stark', 'male'],
  },
  {
    name: 'Kevan Lannister',
    sets: ['was killed', 'Lannister', 'male'],
  },
  {
    name: 'Lancel Lannister',
    sets: ['was killed', 'Lannister', 'male'],
  },
  {
    name: 'Lyanna Stark',
    sets: ['was killed', 'Stark', 'female'],
  },
  {
    name: 'Martyn Lannister',
    sets: ['was killed', 'Lannister', 'male'],
  },
  {
    name: 'Rickard Stark',
    sets: ['was killed', 'Stark', 'male'],
  },
  {
    name: 'Rickon Stark',
    sets: ['was killed', 'Stark', 'male'],
  },
  {
    name: 'Robb Stark',
    sets: ['royal', 'was killed', 'Stark', 'male'],
  },
  {
    name: 'Sansa Stark',
    sets: ['royal', 'Stark', 'female'],
  },
  {
    name: 'Tyrion Lannister',
    sets: ['Lannister', 'male'],
  },
  {
    name: 'Tywin Lannister',
    sets: ['was killed', 'Lannister', 'male'],
  },
  {
    name: 'Willem Lannister',
    sets: ['was killed', 'Lannister', 'male'],
  },
];

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
  return { UpSetJS: window.exports, render, elems };
}
