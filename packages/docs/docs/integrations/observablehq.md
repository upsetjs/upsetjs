---
title: Observable HQ
---

[![Open Example][example]][example-o-url]

A [ObservableHQ](https://observablehq.com/) wrapper is located at [upset-js](https://observablehq.com/@sgratzl/upset-js)

```js
data = fetch(
  'https://raw.githubusercontent.com/upsetjs/upsetjs/main/packages/bundle/example/got.json'
).then(r => r.json())
}
```

```js
import { extractSets, UpSetJSElement, generateIntersections } from '@sgratzl/upset-js';
```

```js
sets = extractSets(data);
```

```js
intersections = generateIntersections(sets);
```

```js
viewof selection = UpSetJSElement(sets, intersections)
```

```js
selection ? selection.elems.map((d) => d.name) : 'None';
```

[ObservableHQ](https://observablehq.com/@sgratzl/upset-js)

An advanced example showing all datasets from the live UpSet demo is located at [ObservableHQ](https://observablehq.com/@sgratzl/upset-observable-dataset-chooser-example)

[example]: https://img.shields.io/badge/Example-open-red
[example-o-url]: https://observablehq.com/@sgratzl/upset-observable-example
