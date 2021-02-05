/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { sets } from './data';
import './styles.css';
import { UpSetJS } from '@upsetjs/react';

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  return <UpSetJS sets={sets} width={1200} height={500} theme={isDarkTheme ? 'dark' : 'light'} />;
}

export default function App() {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <UpSetPlot isDarkTheme={isDarkTheme} />
    </div>
  );
}
