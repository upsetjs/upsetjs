---
title: Vanilla Bundle
---

## Install

```sh
npm install @upsetjs/bundle
```

or

```sh
yarn add @upsetjs/bundle
```

## Example

```js
import { extractCombinations, renderUpSet } from '@upsetjs/bundle';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];
const { sets, combinations } = extractCombinations(elems);

let selection = null;

function onHover(set) {
  selection = set;
  rerender();
}

function rerender() {
  const props = { sets, combinations, width: 780, height: 400, selection, onHover };
  renderUpSet(document.body, props);
}

rerender();
```
