/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState, Suspense } from 'react';
// import { useData } from './bench2';
import { sets } from './data';
import './styles.css';
import { UpSetJS, UpSetSelection } from '@upsetjs/react';

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  // const { sets, combinations } = useData();
  const [selection, setSelection] = useState<UpSetSelection<unknown>>(null);
  return (
    <UpSetJS
      sets={sets}
      // combinations={combinations}
      width={1900}
      height={1200}
      theme={isDarkTheme ? 'dark' : 'light'}
      selection={selection}
      onHover={setSelection}
    />
  );
}

export default function App(): JSX.Element {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <Suspense fallback="Loading...">
        <UpSetPlot isDarkTheme={isDarkTheme} />
      </Suspense>
    </div>
  );
}
