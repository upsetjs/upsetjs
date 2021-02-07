/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback, useMemo, useState } from 'react';
import { VennDiagram, asSets, ISetLike } from '@upsetjs/react';
import './styles.css';

const baseSets = [
  { name: 'A', elems: [1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18] },
  { name: 'B', elems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23] },
  { name: 'C', elems: [1, 11, 12, 4, 5, 24, 25, 26, 27, 28, 29, 30] },
];

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [selection, setSelection] = useState<ISetLike<any> | any[] | null>(null);
  const [value, setValue] = useState(3);
  const changeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.valueAsNumber);
    },
    [setValue]
  );
  const select = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelection(
        Array.from(e.target.closest('div')!.querySelectorAll<HTMLInputElement>('input:checked')).map(
          (d) => d.valueAsNumber
        )
      );
    },
    [setSelection]
  );

  const sets = useMemo(() => asSets(baseSets).slice(0, value), [value]);
  const queries = useMemo(
    () => [
      { name: 'test', color: 'red', elems: baseSets.slice(0, 10) },
      { name: 'test2', color: 'blue', set: sets[1] },
    ],
    [sets]
  );

  return (
    <div>
      <VennDiagram
        sets={sets}
        queries={queries}
        width={780}
        height={500}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
      />
      <div>
        Number of Sets: <input type="number" min="1" onChange={changeValue} value={value} />
      </div>
      <div>
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <label key={i}>
              <input type="checkbox" name="s" value={i} onChange={select} />
              {i}
            </label>
          ))}
      </div>
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
