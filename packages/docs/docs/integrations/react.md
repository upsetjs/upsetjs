---
title: React.js
---

## Install

```sh
npm install @upsetjs/react react react-dom
```

or

```sh
yarn add @upsetjs/react react react-dom
```

## Example

```jsx live
// import React from 'react';
// import { extractSets, generateCombinations, UpSetJS } from '@upsetjs/react';

function GettingStarted() {
  const elems = useMemo(
    () => [
      { name: 'A', sets: ['S1', 'S2'] },
      { name: 'B', sets: ['S1'] },
      { name: 'C', sets: ['S2'] },
      { name: 'D', sets: ['S1', 'S3'] },
    ],
    []
  );

  const sets = useMemo(() => extractSets(elems), [elems]);
  const combinations = useMemo(() => generateCombinations(sets), [sets]);

  const [selection, setSelection] = React.useState(null);
  return (
    <UpSetJS
      sets={sets}
      combinations={combinations}
      width={780}
      height={400}
      selection={selection}
      onHover={setSelection}
    />
  );
}
```

## Properties

The most relevant and required properties of the `UpSetJS` component are:

```ts
interface UpSetJSProps {
  width: number;
  height: number;

  sets: ISet<T>[];
  combinations?: ISetCombination<T>[] | GenerateCombinationOptions<T>;

  selection?: ISetLike<T> | readonly T[] | null;

  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T> | null): void;

  queries?: UpSetQuery<T>[];
}
```
