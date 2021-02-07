/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useMemo } from 'react';
import { UpSetJS, extractSets, ISetLike } from '@upsetjs/react';
import elems, { Row } from './data';
import './styles.css';

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [selection, setSelection] = React.useState<ISetLike<Row> | null>(null);
  const sets = useMemo(() => extractSets(elems), []);
  return (
    <UpSetJS
      sets={sets}
      width={780}
      height={500}
      title="Text text text text abc this a is dime dime qer asdf qr asdf qr asdf q3r afd q3 asefa4 aaf34r asdf 4q fa 4 af4adfsfdsfdfasfsdfasdfadfasdfadf"
      description="adf aas dfa fda fa fd"
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
