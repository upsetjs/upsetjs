/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { useState } from 'react';
import { boxplotAddon } from './Boxplot';
import { categoricalAddon } from './Categorical';
import UpSetJS, { extractSets, ISetLike, UpSetProps } from '@upsetjs/react';

const stories = {
  title: 'UpSetJS Addons',
};
export default stories;

interface IElem {
  name: string;
  sets: string[];
  value: number;
}

interface ICatElem {
  name: string;
  sets: string[];
  value: string;
}

function InteractiveUpSet<T>(props: UpSetProps<T>) {
  const [selection, setSelection] = useState(null as ISetLike<T> | null);

  return <UpSetJS selection={selection} onHover={setSelection} {...props} />;
}

export const BoxPlot = () => {
  const elems: IElem[] = [
    { name: '1', sets: ['one', 'two', 'three'], value: Math.random() },
    { name: '2', sets: ['one', 'two'], value: Math.random() },
    { name: '3', sets: ['one'], value: Math.random() },
    { name: '4', sets: ['two'], value: Math.random() },
    { name: '5', sets: ['one', 'two', 'three'], value: Math.random() },
    { name: '6', sets: ['three'], value: Math.random() },
    { name: '7', sets: ['one', 'three'], value: Math.random() },
    { name: '8', sets: ['one', 'three'], value: Math.random() },
    { name: '9', sets: ['three'], value: Math.random() },
    { name: '10', sets: ['two', 'three'], value: Math.random() },
    { name: '11', sets: ['one'], value: Math.random() },
    { name: '12', sets: ['one', 'three'], value: Math.random() },
    { name: '13', sets: ['one', 'three'], value: Math.random() },
  ];
  const sets = extractSets(elems);

  return (
    <InteractiveUpSet
      sets={sets}
      width={1200}
      height={500}
      setAddons={[boxplotAddon('value', elems)]}
      combinationAddons={[boxplotAddon('value', elems, { orient: 'vertical' })]}
    />
  );
};

export const BoxPlotQueries = () => {
  const elems: IElem[] = [
    { name: '1', sets: ['one', 'two', 'three'], value: Math.random() },
    { name: '2', sets: ['one', 'two'], value: Math.random() },
    { name: '3', sets: ['one'], value: Math.random() },
    { name: '4', sets: ['two'], value: Math.random() },
    { name: '5', sets: ['one', 'two', 'three'], value: Math.random() },
    { name: '6', sets: ['three'], value: Math.random() },
    { name: '7', sets: ['one', 'three'], value: Math.random() },
    { name: '8', sets: ['one', 'three'], value: Math.random() },
    { name: '9', sets: ['three'], value: Math.random() },
    { name: '10', sets: ['two', 'three'], value: Math.random() },
    { name: '11', sets: ['one'], value: Math.random() },
    { name: '12', sets: ['one', 'three'], value: Math.random() },
    { name: '13', sets: ['one', 'three'], value: Math.random() },
  ];
  const sets = extractSets(elems);

  return (
    <InteractiveUpSet
      sets={sets}
      width={1200}
      height={500}
      queries={[{ name: 'Q1', color: 'green', set: sets[0] }]}
      setAddons={[boxplotAddon('value', elems)]}
      combinationAddons={[boxplotAddon('value', elems, { orient: 'vertical' })]}
    />
  );
};

export const Categorical = () => {
  const categories = ['c1', 'c2', 'c3'];
  const elems: ICatElem[] = [
    { name: '1', sets: ['one', 'two', 'three'], value: categories[0] },
    { name: '2', sets: ['one', 'two'], value: categories[1] },
    { name: '3', sets: ['one'], value: categories[2] },
    { name: '4', sets: ['two'], value: categories[0] },
    { name: '5', sets: ['one', 'two', 'three'], value: categories[1] },
    { name: '6', sets: ['three'], value: categories[2] },
    { name: '7', sets: ['one', 'three'], value: categories[0] },
    { name: '8', sets: ['one', 'three'], value: categories[1] },
    { name: '9', sets: ['three'], value: categories[2] },
    { name: '10', sets: ['two', 'three'], value: categories[0] },
    { name: '11', sets: ['one'], value: categories[1] },
    { name: '12', sets: ['one', 'three'], value: categories[2] },
    { name: '13', sets: ['one', 'three'], value: categories[0] },
  ];
  const sets = extractSets(elems);

  return (
    <InteractiveUpSet
      sets={sets}
      width={1200}
      height={500}
      setAddons={[categoricalAddon('value', elems)]}
      combinationAddons={[categoricalAddon('value', elems, { orient: 'vertical' })]}
    />
  );
};

export const CategoricalQueries = () => {
  const categories = ['c1', 'c2', 'c3'];
  const elems: ICatElem[] = [
    { name: '1', sets: ['one', 'two', 'three'], value: categories[0] },
    { name: '2', sets: ['one', 'two'], value: categories[1] },
    { name: '3', sets: ['one'], value: categories[2] },
    { name: '4', sets: ['two'], value: categories[0] },
    { name: '5', sets: ['one', 'two', 'three'], value: categories[1] },
    { name: '6', sets: ['three'], value: categories[2] },
    { name: '7', sets: ['one', 'three'], value: categories[0] },
    { name: '8', sets: ['one', 'three'], value: categories[1] },
    { name: '9', sets: ['three'], value: categories[2] },
    { name: '10', sets: ['two', 'three'], value: categories[0] },
    { name: '11', sets: ['one'], value: categories[1] },
    { name: '12', sets: ['one', 'three'], value: categories[2] },
    { name: '13', sets: ['one', 'three'], value: categories[0] },
  ];
  const sets = extractSets(elems);

  return (
    <InteractiveUpSet
      sets={sets}
      width={1200}
      height={500}
      queries={[{ name: 'Q1', color: 'green', set: sets[0] }]}
      setAddons={[categoricalAddon('value', elems)]}
      combinationAddons={[categoricalAddon('value', elems, { orient: 'vertical' })]}
    />
  );
};
