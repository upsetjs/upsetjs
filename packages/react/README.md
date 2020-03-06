# UpSet.js

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

UpSet.js is a JavaScript reimplementation of [UpSetR](https://www.rdocumentation.org/packages/UpSetR/) which itself is based on [UpSet](http://vcg.github.io/upset/about/). The library is written in React. The `UpSet` React component is implemented as a pure functional component soley depending on the given properties.

A detailed description can be found at the README on the main [Github Monorepo](https://github.com/upsetjs/upsetjs).

![UpSet.js](https://user-images.githubusercontent.com/4129778/75599825-a8a13780-5a76-11ea-8cd4-b775f4791a91.png)

## Usage

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

## License

### Commercial license

If you want to use Upset.js for a commercial application the commercial license is the appropriate license. With this option, your source code is kept proprietary. Contact @sgratzl for details

### Open-source license

GNU AGPLv3

[npm-image]: https://badge.fury.io/js/@upsetjs/react.svg
[npm-url]: https://npmjs.org/package/@upsetjs/react
[github-actions-image]: https://github.com/sgratzl/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/sgratzl/upsetjs/actions
