# UpSet.js

[![NPM Package][npm-image]][npm-url] [![Github Actions][github-actions-image]][github-actions-url]

This package is part of the UpSet.js ecosystem located at the main [Github Monorepo](https://github.com/upsetjs/upsetjs).

## Installation

```sh
npm install @upsetjs/react react react-dom
```

## Usage

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

If you want to use Upset.js for a commercial application the commercial license is the appropriate license. Contact [@sgratzl](mailto:sam@sgratzl.com) for details.

### Open-source license

This library is released under the `GNU AGPLv3` version to be used for private and academic purposes. In case of a commercial use, please get in touch regarding a commercial license.

[npm-image]: https://badge.fury.io/js/@upsetjs/react.svg
[npm-url]: https://npmjs.org/package/@upsetjs/react
[github-actions-image]: https://github.com/sgratzl/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/sgratzl/upsetjs/actions
