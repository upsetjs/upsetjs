/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import { common, darkBackgroundColor, colors, sets, mergeColors } from '../data';
import { InteractiveKarnaughMap } from '../Interactive';
import { KarnaughMap } from '../../kmap/KarnaughMap';

export default {
  component: KarnaughMap,
  title: 'Karnaugh Map/Themes+Colors',
};

export const Default = () => {
  return <InteractiveKarnaughMap {...common} />;
};

export const DarkTheme = () => {
  return <InteractiveKarnaughMap {...common} theme="dark" style={{ backgroundColor: darkBackgroundColor }} />;
};

export const VegaTheme = () => {
  return <InteractiveKarnaughMap {...common} theme="vega" />;
};

export const CustomTheming = () => {
  return (
    <InteractiveKarnaughMap {...common} color="darkorchid" selectionColor="darkorchid" hasSelectionOpacity={0.6} />
  );
};

export const SetColors = () => {
  return (
    <InteractiveKarnaughMap
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
