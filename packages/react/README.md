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
import UpSetJS, { extractCombinations, ISetLike } from '@upsetjs/react';

const elems = [
  { name: 'A', sets: ['S1', 'S2'] },
  { name: 'B', sets: ['S1'] },
  { name: 'C', sets: ['S2'] },
  { name: 'D', sets: ['S1', 'S3'] },
];

const { sets, combinations } = useMemo(() => extractCombinations(elems), [elems]);

<UpSetJS sets={sets} combinations={combinations} width={500} height={300} />;
```

with stored selection

```ts
const UpSetSelection = (props: any) => {
  [selection, setSelection] = React.useState(null as ISetLike<any> | null);

  return <UpSetJS {...props} selection={selection} onHover={setSelection} />;
};

<UpSetSelection sets={sets} combinations={combinations} width={500} height={300} />;
```

## Privacy Policy

UpSet.js is a client only library. The library or any of its integrations doesn't track you or transfers your data to any server. The uploaded data in the app are stored in your browser only using IndexedDB. The Tableau extension can run in a sandbox environment prohibiting any server requests. However, as soon as you export your session within the app to an external service (e.g., Codepen.io) your data will be transferred.

## License / Terms of Service

### Commercial license

If you want to use UpSet.js for a commercial application the commercial license is the appropriate license. Contact [@sgratzl](mailto:sam@sgratzl.com) for details.

### Open-source license

This library is released under the `GNU AGPLv3` version to be used for private and academic purposes. In case of a commercial use, please get in touch regarding a commercial license.

[npm-image]: https://badge.fury.io/js/%40upsetjs%2Freact.svg
[npm-url]: https://npmjs.org/package/@upsetjs/react
[github-actions-image]: https://github.com/upsetjs/upsetjs/workflows/nodeci/badge.svg
[github-actions-url]: https://github.com/upsetjs/upsetjs/actions
