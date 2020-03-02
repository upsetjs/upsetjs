# UpSet.js

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

UpSet.js is a React based reimplementation of [UpSetR](https://www.rdocumentation.org/packages/UpSetR/) which itself is based on [UpSet](http://vcg.github.io/upset/about/). The `UpSet` component is implemented as a pure functional component soley depending on the given properties.

![UpSet.js](https://user-images.githubusercontent.com/4129778/75599825-a8a13780-5a76-11ea-8cd4-b775f4791a91.png)

**Interactivity**

By specifying `onHover` and `selection` `UpSet` is fully interactive. As an alternative there is also the `onClick` property.

![Interactive UpSet.js](https://user-images.githubusercontent.com/4129778/75599827-a9d26480-5a76-11ea-9024-e44bc729b741.png)

**Queries**

Similar to the original UpSetR, `UpSet` allows to specify queries by a set of elements which are then highlighted in the plot.
The first query is shown in full detail while others are shown using small indicators.

![Queries UpSet.js](https://user-images.githubusercontent.com/4129778/75599826-a939ce00-5a76-11ea-9f47-6b6f3a076099.png)

## Components

see storybook at https://upsetjs.netlify.com/ for demos and properties.

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

## Usage

```ts
import React from 'react';
import UpSet {extractSets, generateIntersections, ISetLike} from 'upsetjs';

const elems = [
    {name: 'A', sets: ['S1', 'S2']},
    {name: 'B', sets: ['S1']},
    {name: 'C', sets: ['S2']},
    {name: 'D', sets: ['S1', 'S3']}
];

const sets = extractSets(elems);
const combinations = generateIntersections(elems);


<UpSet sets={sets} combinations={combinations} />
```

with stored selection

```ts
const UpSetSelection = (props: any) => {
  [selection, setSelection] = React.useState(null as ISetLike<any> | null);

  return <UpSet {...props} selection={selection} onHover={setSelection} />;
};

<UpSetSelection sets={sets} combinations={combinations} />;
```

## Commands

### Storybook

Run inside another terminal:

```
npm run storybook
```

### Example

```
cd example
npm install
npm start
```

To run tests, use `npm test` or `yarn test`.

## Building

```sh
npm install
npm run build
```

## License

### Commercial license

If you want to use Upset.js for a commercial application the commercial license is the appropriate license. With this option, your source code is kept proprietary. Contact @sgratzl for details

### Open-source license

GNU AGPLv3

[npm-image]: https://badge.fury.io/js/upsetjs.svg
[npm-url]: https://npmjs.org/package/upsetjs
[github-actions-image]: https://github.com/sgratzl/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/sgratzl/upsetjs/actions
