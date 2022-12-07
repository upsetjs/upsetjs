/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo, useState } from 'react';
import { VennDiagram, asSets, ISetLike } from '@upsetjs/react';
import './styles.css';

const sets = asSets([
  { name: 'A', elems: [1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18] },
  { name: 'B', elems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23] },
  { name: 'C', elems: [1, 11, 12, 4, 5, 24, 25, 26, 27, 28, 29, 30] },
]);

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [selection, setSelection] = useState<ISetLike<unknown> | unknown[] | null>(null);
  const labels = useMemo(
    () => [
      { x: 10, y: 10 },
      { x: 0, y: 0 },
      { x: 100, y: -200 },
    ],
    []
  );

  return (
    <div>
      <VennDiagram
        sets={sets}
        width={780}
        height={500}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
        setLabelOffsets={labels}
      />
    </div>
  );
}

export default function App(): JSX.Element {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <UpSetPlot isDarkTheme={isDarkTheme} />
    </div>
  );
}
