/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { asSets, ISetLike } from '@upsetjs/model';
import React from 'react';
import { UpSetAddonProps } from '../interfaces';
import { UpSetJS } from '../UpSetJS';
import { common, queries, sets } from './data';
import { UpSetJSSkeleton } from '../UpSetJSSkeleton';

export default {
  component: UpSetJS,
  title: 'UpSetJS',
};

export const Default = () => {
  return <UpSetJS sets={sets} width={1200} height={500} />;
};

export const Skeleton = () => {
  return <UpSetJSSkeleton width={1200} height={500} />;
};

export const Title = () => {
  return (
    <UpSetJS
      sets={sets}
      width={1200}
      height={500}
      title="Game of Thrones"
      description="Information about the characters of the tv series Game of Thrones"
    />
  );
};

export const Interactivity = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return <UpSetJS {...common} selection={selection} onHover={setSelection} />;
};

export const Click = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return <UpSetJS {...common} selection={selection} onClick={setSelection} />;
};

export const Queries = () => {
  return <UpSetJS {...common} queries={queries} queryLegend />;
};

export const SmallSets = () => {
  return (
    <div>
      <UpSetJS
        {...common}
        sets={asSets([
          { name: 'one', elems: [1, 2, 3, 5, 7, 8, 11, 12, 13] },
          { name: 'two', elems: [1, 2, 4, 5, 10] },
          { name: 'three', elems: [1, 5, 6, 7, 8, 9, 10, 12, 13] },
        ])}
      />
      <UpSetJS
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

const SetAddon: React.FC<UpSetAddonProps<ISetLike<any>, any>> = ({ width, height }) => {
  return <rect x={1} y={1} width={width - 2} height={height - 2} fill="red"></rect>;
};

const SetAddon2: React.FC<UpSetAddonProps<ISetLike<any>, any>> = ({ width, height }) => {
  return <rect x={1} y={1} width={width - 2} height={height - 2} fill="green"></rect>;
};

export const Addon = () => {
  const [selection, setSelection] = React.useState(null as ISetLike<any> | null);
  return (
    <UpSetJS
      {...common}
      selection={selection}
      onHover={setSelection}
      setAddons={[
        {
          name: 'red',
          size: 40,
          render: SetAddon,
        },
        {
          name: 'green',
          position: 'before',
          size: 20,
          render: SetAddon2,
        },
      ]}
      combinationAddons={[
        {
          name: 'red',
          size: 40,
          render: SetAddon,
        },
        {
          name: 'green',
          position: 'before',
          size: 20,
          render: SetAddon2,
        },
      ]}
    />
  );
};
