/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback, useMemo, useState } from 'react';
import { KarnaughMap, extractSets, ISetLike, generateCombinations } from '@upsetjs/react';
import elems, { Row } from './data';
import './styles.css';

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [selection, setSelection] = useState<ISetLike<Row> | null>(null);
  const [value, setValue] = useState(2);
  const changeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.valueAsNumber);
    },
    [setValue]
  );
  const sets = useMemo(() => extractSets(elems).slice(0, value), [value]);
  const combinations = useMemo(
    () =>
      generateCombinations(sets, {
        type: 'distinctIntersection',
      }),
    [sets]
  );
  return (
    <div>
      <KarnaughMap
        sets={sets}
        combinations={combinations}
        width={780}
        height={500}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
      <div>
        Number of Sets: <input type="number" min="1" onChange={changeValue} value={value} />
      </div>
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
