/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { UpSetJS, VennDiagram, KarnaughMap, extractCombinations, ISetLike } from '@upsetjs/react';
import './styles.css';

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [selection, setSelection] = React.useState<ISetLike<unknown> | null>(null);
  const { sets, combinations } = useMemo(
    () =>
      extractCombinations(
        [
          { name: 'A', sets: ['S1', 'S2'] },
          { name: 'B', sets: ['S1'] },
          { name: 'C', sets: ['S2'] },
          { name: 'D', sets: ['S1', 'S3'] },
        ],
        {
          type: 'distinctIntersection',
        }
      ),
    []
  );
  return (
    <div>
      <UpSetJS
        sets={sets}
        combinations={combinations}
        width={500}
        height={300}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
      <VennDiagram
        sets={sets}
        combinations={combinations}
        width={500}
        height={300}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
      <KarnaughMap
        sets={sets}
        combinations={combinations}
        width={500}
        height={300}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
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
