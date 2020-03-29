# UpSet.js

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url] [![Netlify Status][netlify-image]][netlify-url]

UpSet.js is a JavaScript reimplementation of [UpSetR](https://www.rdocumentation.org/packages/UpSetR/) which itself is based on [UpSet](http://vcg.github.io/upset/about/). The core library is written in React but provides also bundle editions for plain JavaScript use. The `UpSet` React component is implemented as a pure functional component soley depending on the given properties.

![UpSet.js](https://user-images.githubusercontent.com/4129778/75599825-a8a13780-5a76-11ea-8cd4-b775f4791a91.png)

## Usage

### React

see https://github.com/upsetjs/upsetjs/tree/master/packages/react

```sh
npm install @upsetjs/react react react-dom
```

```ts
import React from 'react';
import UpSet, { extractSets, generateIntersections, ISetLike } from '@upsetjs/react';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const sets = extractSets(elems);
const combinations = generateIntersections(sets);

<UpSet sets={sets} combinations={combinations} width={500} height={300} />;
```

with stored selection

```ts
const UpSetSelection = (props: any) => {
  [selection, setSelection] = React.useState(null as ISetLike<any> | null);

  return <UpSet {...props} selection={selection} onHover={setSelection} />;
};

<UpSetSelection sets={sets} combinations={combinations} />;
```

### Bundle

see https://github.com/upsetjs/upsetjs/tree/master/packages/bundle

```sh
npm install @upsetjs/bundle
```

```js
import * as UpSetJS from '@upsetjs/bundle';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const sets = UpSetJS.extractSets(elems);
const combinations = UpSetJS.generateIntersections(sets);

UpSetJS.renderUpSet(document.body, { sets, combinations, width: 500, height: 300 });
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

**Interactivity**

By specifying `onHover` and `selection` `UpSet` is fully interactive. As an alternative there is also the `onClick` property.

![Interactive UpSet.js](https://user-images.githubusercontent.com/4129778/75599827-a9d26480-5a76-11ea-9024-e44bc729b741.png)

**Queries**

Similar to the original UpSetR, `UpSet` allows to specify queries by a set of elements which are then highlighted in the plot.
The first query is shown in full detail while others are shown using small indicators.

![Queries UpSet.js](https://user-images.githubusercontent.com/4129778/75599826-a939ce00-5a76-11ea-9f47-6b6f3a076099.png)

```ts
const queries = [
  { name: 'Q1', color: 'steelblue', elems: elems.filter(() => Math.random() > 0.7) },
  { name: 'Q2', color: 'red', elems: elems.filter(() => Math.random() > 0.8) },
];

UpSetJS.renderUpSet(document.body, { sets, combinations, width: 500, height: 300, queries });
```

see also [![Open in CodePen][codepen]](https://codepen.io/sgratzl/pen/BaNmpJq)

## Components

see storybook at https://upsetjs.netlify.com/api/?path=/docs/upset--default for demos and properties.

### UpSet

The most relevant and required properties of the `UpSet` component are:

```ts
{
  width: number;
  height: number;

  sets: ISet<T>[];
  combinations?: ISetCombination<T>[];

  selection?: ISetLike<T> | null;

  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T>): void;

  queries?: {name: string, color: string, elems: T[]}[];
}
```

## Data

`UpSet` requires sets and optionally intersection of sets as input. There are some utility function to help creating the required data structures:

- `extractSets<T extends { sets: string[] }>(elements: ReadonlyArray<T>): ISet<T>[]`
  given an array of elements where each is having a property called `.sets` containing a list of set names in which this element is part of. e.g. `{ sets: ['Blue Hair', 'Female']}`. The return value is a list of sets in the required data structures and having a `.elems` with an array of the input elements.
- `asSets<T, S extends { name: string; elems: ReadonlyArray<T> }>(sets: ReadonlyArray<S>): (S & ISet<T>)[]`
  extends the given basic set objects (`name` and `elems`) with the required attributes for `UpSet`
- `generateIntersections<T>(sets: ISets<T>, { min = 0, max = Infinity, empty = false } = {}): ISetIntersection<T>[]`
  one needs to generate the list of the intersections to show in case of customized sorting or filtering. This function takes the array of sets as input and computed all possible set intersections (aka. power set). The options allow to limit the generation to skip `empty` set intersections or enforce a minimum/maximum amount of sets in the intersection.
- `generateUnions<T>(sets: ISets<T>, { min = 2, max = Infinity } = {}): ISetUnion<T>[]`
  one needs to generate the list of the unions to show in case of customized sorting or filtering. This function takes the array of sets as input and computed all possible set unions (aka. power set). The options allow to enforce a minimum/maximum amount of sets in the union.

## Integration

### Observable HQ

A [ObservableHQ](https://observablehq.com/) wrapper is located at [upset-observable-library](https://observablehq.com/@sgratzl/upset-observable-library).

```js
data = fetch(
  'https://raw.githubusercontent.com/upsetjs/upsetjs/master/packages/bundle/example/simpsons.json'
).then(r => r.json())
}
```

```js
import { extractSets, UpSet, generateIntersections } from '@sgratzl/upset-observable-library';
```

```js
sets = extractSets(data);
```

```js
intersections = generateIntersections(sets);
```

```js
viewof selection = UpSet(sets, intersections)
```

```js
selection ? selection.elems.map((d) => d.name) : 'None';
```

[ObservableHQ](https://observablehq.com/@sgratzl/upset-observable-example)

An advanced example showing all datasets from the live UpSet demo is located at [ObservableHQ](https://observablehq.com/@sgratzl/upset-observable-dataset-chooser-example)

### R/RMarkdown/RShiny HTMLWidget

A R wrapper using [HTMLWidgets](https://www.htmlwidgets.org/) is located at [upset_r](https://github.com/upsetjs/upsetjs_r). The API follows the building pattern using the chaining operator `%>%`.
In constrast to the original UpsetR implementation it focusses on the UpSet plot itself only. However it supports interactivity either using custom Shiny events or HTMLWidgets Crosstalk. See also Shiny examples.

```R
devtools::install_github("upsetjs/upsetjs_r")
library(upsetjs)
```

```R
l <- list(one=c(1, 2, 3, 5, 7, 8, 11, 12, 13), two=c(1, 2, 4, 5, 10), three=c(1, 5, 6, 7, 8, 9, 10, 12, 13))
upsetjs() %>% fromList(l) %>% interactiveChart()
```

## Dev Environment

```sh
npm i -g yarn
yarn set version berry
yarn plugin import version
yarn plugin import @yarnpkg/plugin-workspace-tools
yarn install
yarn pnpify --sdk
```

### Commands

### Storybook

Run inside another terminal:

```sh
yarn unplug @storybook/core
yarn workspace @upsetjs/react storybook
```

### Testing

```sh
yarn test
```

### Linting

```sh
yarn lint
```

### Building

```sh
yarn install
yarn build
```

### Release

```sh
yarn workspace @upsetjs/model version patch
yarn workspace @upsetjs/react version patch
yarn workspace @upsetjs/bundle version patch
yarn workspace @upsetjs/app version patch
git commit -am 'release vX.X.X'
git push
git tag vX.X.X
git push --tags
yarn build
yarn workspaces foreach npm publish --access public
```

## License

### Commercial license

If you want to use Upset.js for a commercial application the commercial license is the appropriate license. With this option, your source code is kept proprietary. Contact @sgratzl for details

### Open-source license

GNU AGPLv3

[npm-image]: https://badge.fury.io/js/@upsetjs/react.svg
[npm-url]: https://npmjs.org/package/@upsetjs/react
[github-actions-image]: https://github.com/sgratzl/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/sgratzl/upsetjs/actions
[netlify-image]: https://api.netlify.com/api/v1/badges/22f99fef-9985-46eb-8715-9eb91e16190f/deploy-status
[netlify-url]: https://app.netlify.com/sites/upsetjs/deploys
[codepen]: https://img.shields.io/badge/CodePen-open-blue?logo=codepen
