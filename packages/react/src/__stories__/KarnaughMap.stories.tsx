/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { asSets, ISetLike } from '@upsetjs/model';
import React from 'react';
import { KarnaughMap } from '../kmap/KarnaughMap';
import { common, queries, sets } from './data';
import { KarnaughMapSkeleton } from '../kmap/KarnaughMapSkeleton';

const stories = {
  component: KarnaughMap,
  title: 'Karnaugh Map',
};
export default stories;

export const Default = () => {
  return <KarnaughMap sets={sets} width={1200} height={500} />;
};

export const Skeleton = () => {
  return <KarnaughMapSkeleton width={1200} height={500} />;
};

export const Title = () => {
  return (
    <KarnaughMap
      {...common}
      title="Game of Thrones"
      description="Information about the characters of the tv series Game of Thrones"
    />
  );
};

export const Interactivity = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return <KarnaughMap {...common} selection={selection} onHover={setSelection} />;
};

export const Click = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return <KarnaughMap {...common} selection={selection} onClick={setSelection} />;
};

export const Queries = () => {
  return <KarnaughMap {...common} queries={queries} queryLegend />;
};

export const SmallSets = () => {
  return (
    <div>
      <KarnaughMap
        {...common}
        sets={asSets([
          { name: 'one', elems: [1, 2, 3, 5, 7, 8, 11, 12, 13] },
          { name: 'two', elems: [1, 2, 4, 5, 10] },
          { name: 'three', elems: [1, 5, 6, 7, 8, 9, 10, 12, 13] },
        ])}
      />
      <KarnaughMap
        {...common}
        sets={asSets([
          { name: 'one', elems: [1, 2, 3] },
          { name: 'two', elems: [1, 2, 4, 5] },
          { name: 'three', elems: [1, 5] },
        ])}
      />
    </div>
  );
};
