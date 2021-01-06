/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { common, darkBackgroundColor, sets, colors, mergeColors } from '../data';
import { InteractiveVennDiagram } from '../Interactive';
import { VennDiagram } from '../../venn/VennDiagram';

const stories = {
  component: VennDiagram,
  title: 'Venn Diagram/Themes+Colors',
};
export default stories;

export const Default = () => {
  return <InteractiveVennDiagram {...common} />;
};

export const DarkTheme = () => {
  return <InteractiveVennDiagram {...common} theme="dark" style={{ backgroundColor: darkBackgroundColor }} />;
};

export const VegaTheme = () => {
  return <InteractiveVennDiagram {...common} theme="vega" />;
};

export const CustomTheming = () => {
  return (
    <InteractiveVennDiagram
      {...common}
      color="darkorchid"
      selectionColor="darkorchid"
      hasSelectionOpacity={0.6}
      filled
    />
  );
};

export const SetColors = () => {
  return (
    <InteractiveVennDiagram
      {...common}
      sets={sets.map((s, i) => ({ ...s, color: colors[i] }))}
      combinations={{
        mergeColors,
      }}
      hasSelectionOpacity={0.6}
      selectionColor=""
    />
  );
};
