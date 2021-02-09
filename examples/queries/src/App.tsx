/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { UpSetJS, extractCombinations, ISetLike } from '@upsetjs/react';
import elems, { Row } from './data';
import './styles.css';

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [selection, setSelection] = React.useState<ISetLike<Row> | null>(null);
  const { sets, combinations } = useMemo(() => extractCombinations(elems), []);
  const queries = useMemo(
    () => [
      { name: 'test', color: 'red', set: sets[0] },
      { name: 'test2', color: 'blue', set: sets[1] },
    ],
    [sets]
  );
  return (
    <UpSetJS
      sets={sets}
      combinations={combinations}
      width={780}
      height={500}
      queries={queries}
      selection={selection}
      onHover={setSelection}
      theme={isDarkTheme ? 'dark' : 'light'}
    />
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
