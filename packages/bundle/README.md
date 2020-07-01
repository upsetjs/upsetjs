# UpSet.js Bundle

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

This package is part of the UpSet.js ecosystem located at the main [Github Monorepo](https://github.com/upsetjs/upsetjs).

## Usage

```sh
npm install @upsetjs/bundle
```

```js
import * as UpSetJS from '@upsetjs/bundle';

const elems = [...];

const sets = UpSetJS.extractSets(elems);
const combinations = UpSetJS.generateIntersections(elems);

UpSetJS.render(document.body, {sets, combinations, width: 500, height: 300});
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
  UpSetJS.render(document.body, props);
}

render();
```

see also [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/bGdYBzL)

## Privacy Policy

UpSet.js is a client only library. The library or any of its integrations doesn't track you or transfers your data to any server. The uploaded data in the app are stored in your browser only using IndexedDB. The Tableau extension can run in a sandbox environment prohibiting any server requests. However, as soon as you export your session within the app to an external service (e.g., Codepen.io) your data will be transferred.

## License / Terms of Service

### Commercial license

If you want to use Upset.js for a commercial application the commercial license is the appropriate license. Contact [@sgratzl](mailto:sam@sgratzl.com) for details.

### Open-source license

This library is released under the `GNU AGPLv3` version to be used for private and academic purposes. In case of a commercial use, please get in touch regarding a commercial license.

[npm-image]: https://badge.fury.io/js/%40upsetjs%2Fbundle.svg
[npm-url]: https://npmjs.org/package/@upsetjs/bundle
[github-actions-image]: https://github.com/upsetjs/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/upsetjs/upsetjs/actions
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
