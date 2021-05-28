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

function UpSetPlot() {
  const [selection, setSelection] = React.useState<ISetLike<Row> | null>(null);
  const sets = useMemo(() => {
    const sets = extractSets(elems);
    (sets[0] as { color: string }).color = 'red';
    (sets[1] as { color: string }).color = 'steelblue';
    (sets[2] as { color: string }).color = 'green';
    (sets[3] as { color: string }).color = 'blue';
    (sets[4] as { color: string }).color = 'cyan';
    (sets[5] as { color: string }).color = 'yellow';
    return sets;
  }, []);
  return (
    <UpSetJS
      sets={sets}
      width={780}
      height={500}
      selection={selection}
      onHover={setSelection}
      selectionColor=""
      hasSelectionOpacity={0.5}
      combinations={{
        mergeColors,
      }}
    />
  );
}

export default function App(): JSX.Element {
  // const isDarkTheme = window.matchMedia != null && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return (
    <div className="App">
      <UpSetPlot />
    </div>
  );
}
