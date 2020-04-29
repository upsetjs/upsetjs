/**
 * @upsetjs/addons
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import React from 'react';
import { boxplotAddon } from './Boxplot';
import UpSetJS, { extractSets } from '@upsetjs/react';

export default {
  title: 'UpSet.js Box plot Addon',
  parameters: {
    docs: {
      container: DocsContainer,
      page: DocsPage,
    },
  },
};

interface IElem {
  name: string;
  sets: string[];
  value: number;
}

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

export const Default = () => {
  return (
    <UpSetJS
      sets={sets}
      width={1200}
      height={500}
      setAddons={[boxplotAddon('value', elems)]}
      combinationAddons={[boxplotAddon('value', elems, { orient: 'vertical' })]}
    />
  );
};
