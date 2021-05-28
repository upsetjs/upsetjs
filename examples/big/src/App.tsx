/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { UpSetJS, extractCombinations, ISetLike } from '@upsetjs/react';
import base, { Row } from './data';
import './styles.css';

const elems = base.slice();
for (let i = 0; i < 100; i++) {
  elems.push(...base.map((s) => Object.assign({}, s, { name: `${s.name}_${i}` })));
}

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [selection, setSelection] = React.useState<ISetLike<Row> | null>(null);
  const { sets, combinations } = useMemo(() => extractCombinations(elems), []);
  return (
    <UpSetJS
      sets={sets}
      combinations={combinations}
      width={780}
      height={500}
      selection={selection}
      onHover={setSelection}
      theme={isDarkTheme ? 'dark' : 'light'}
    />
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
