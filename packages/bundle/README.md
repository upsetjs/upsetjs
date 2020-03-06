# UpSet.js Bundle

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

UpSet.js is a JavaScript reimplementation of [UpSetR](https://www.rdocumentation.org/packages/UpSetR/) which itself is based on [UpSet](http://vcg.github.io/upset/about/). The library is written in React. This repository contains a bundled version of it that has no dependencies and uses [Preact](https://preactjs.com/) in the background.

A detailed description can be found at the README on the main [Github Monorepo](https://github.com/upsetjs/upsetjs).

![UpSet.js](https://user-images.githubusercontent.com/4129778/75599825-a8a13780-5a76-11ea-8cd4-b775f4791a91.png)

## Usage

```sh
npm install @upsetjs/bundle
```

```js
import * as UpSetJS from '@upsetjs/bundle';

const elems = [...];

const sets = UpSetJS.extractSets(elems);
const combinations = UpSetJS.generateIntersections(elems);

UpSetJS.renderUpSet(document.body, {sets, combinations, width: 500, height: 300});
```

with stored selection

```js
let selection = null;

function onHover(set) {
  selection = set;
  render();
}

function render() {
  const props = { sets, combinations, width: 500, height: 300, selection, onHover };
  UpSetJS.renderUpSet(document.body, props);
}

render();
```

see also [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/bGdYBzL)

## License

### Commercial license

If you want to use Upset.js for a commercial application the commercial license is the appropriate license. With this option, your source code is kept proprietary. Contact @sgratzl for details

### Open-source license

GNU AGPLv3

[npm-image]: https://badge.fury.io/js/@upsetjs/bundle.svg
[npm-url]: https://npmjs.org/package/@upsetjs/bundle
[github-actions-image]: https://github.com/sgratzl/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/sgratzl/upsetjs/actions
