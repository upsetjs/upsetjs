/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { UpSetJS, VennDiagram, KarnaughMap, extractSets, ISetLike } from '@upsetjs/react';
import './styles.css';

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [selection, setSelection] = React.useState<ISetLike<any> | null>(null);
  const sets = useMemo(
    () =>
      extractSets([
        { name: 'A', sets: ['S1', 'S2'] },
        { name: 'B', sets: ['S1'] },
        { name: 'C', sets: ['S2'] },
        { name: 'D', sets: ['S1', 'S3'] },
      ]),
    []
  );
  return (
    <div>
      <UpSetJS
        sets={sets}
        width={500}
        height={300}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
      <VennDiagram
        sets={sets}
        width={500}
        height={300}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
      <KarnaughMap
        sets={sets}
        width={500}
        height={300}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
    </div>
  );
}

export default function App() {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <UpSetPlot isDarkTheme={isDarkTheme} />
    </div>
  );
}
