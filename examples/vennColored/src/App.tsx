/**
 * @upsetjs/examples
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useCallback, useMemo, useState } from 'react';
import { VennDiagram, asSets, ISetLike } from '@upsetjs/react';
import './styles.css';
import { lab } from 'd3-color';

function mergeColors(colors: readonly (string | undefined)[]) {
  if (colors.length === 0) {
    return undefined;
  }
  if (colors.length === 1) {
    return colors[0];
  }
  const cc = colors.reduce(
    (acc, d) => {
      const c = lab(d || 'transparent');
      return {
        l: acc.l + c.l,
        a: acc.a + c.a,
        b: acc.b + c.b,
      };
    },
    { l: 0, a: 0, b: 0 }
  );
  return lab(cc.l / colors.length, cc.a / colors.length, cc.b / colors.length).toString();
  // return null;
}

const baseSets = [
  { name: 'A', elems: [1, 2, 3, 4, 11, 12, 13, 14, 15, 16, 17, 18], color: 'red' },
  { name: 'B', elems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 19, 20, 21, 22, 23], color: 'blue' },
  { name: 'C', elems: [1, 11, 12, 4, 5, 24, 25, 26, 27, 28, 29, 30], color: 'green' },
];

function UpSetPlot({ isDarkTheme }: { isDarkTheme: boolean }) {
  const [value, setValue] = useState(3);
  const changeValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.valueAsNumber);
    },
    [setValue]
  );
  const [selection, setSelection] = useState<ISetLike<unknown> | unknown[] | null>(null);
  const select = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelection(
        Array.from(e.target.closest('div')?.querySelectorAll<HTMLInputElement>('input:checked') ?? []).map(
          (d) => d.valueAsNumber
        )
      );
    },
    [setSelection]
  );
  const sets = useMemo(() => asSets(baseSets).slice(0, value), [value]);
  return (
    <div>
      <VennDiagram
        sets={sets}
        width={780}
        height={500}
        selection={selection}
        onHover={setSelection}
        theme={isDarkTheme ? 'dark' : 'light'}
        combinations={{
          mergeColors,
        }}
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

export default function App(): JSX.Element {
  const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <UpSetPlot isDarkTheme={isDarkTheme} />
    </div>
  );
}
