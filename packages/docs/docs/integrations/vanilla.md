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

```jsx
import { extractSets, generateCombinations, renderUpSetJS } from '@upsetjs/bundle';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];
const sets = useMemo(() => extractSets(elems), [elems]);
const combinations = useMemo(() => generateCombinations(sets), [sets]);

let selection = null;

function onHover(set) {
  selection = set;
  rerender();
}

function rerender() {
  const props = { sets, combinations, width: 780, height: 400, selection, onHover };
  renderUpSetJS(document.body, props);
}

rerender();
```
