/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ReactNode } from 'react';
import { UpSetAddon } from '../interfaces';
import { generateId } from '../utils';

export default function deriveSizeDependent(
  width: number,
  height: number,
  margin: number,
  barPadding: number,
  widthRatios: [number, number, number],
  heightRatios: [number, number],
  setAddons: readonly UpSetAddon<any, any, ReactNode>[],
  combinationAddons: readonly UpSetAddon<any, any, ReactNode>[],
  id: string,
  setAddonPadding: number,
  combinationAddonPadding: number
) {
  const setAddonsBefore = setAddons.reduce(
    (acc, a) => acc + (a.position === 'before' ? a.size + setAddonPadding : 0),
    0
  );
  const setAddonsAfter = setAddons.reduce(
    (acc, a) => acc + (a.position !== 'before' ? a.size + setAddonPadding : 0),
    0
  );
  const combinationAddonsBefore = combinationAddons.reduce(
    (acc, a) => acc + (a.position === 'before' ? a.size + setAddonPadding : 0),
    0
  );
  const combinationAddonsAfter = combinationAddons.reduce(
    (acc, a) => acc + (a.position !== 'before' ? a.size + setAddonPadding : 0),
    0
  );
  const h = height - 2 * margin - 20 - combinationAddonsAfter - combinationAddonsBefore;
  const w = width - 2 * margin - setAddonsBefore - setAddonsAfter;

  const setWidth = w * widthRatios[0];
  const labelsWidth = w * widthRatios[1];
  const combinationHeight = h * heightRatios[0];
  return {
    id: id ? id : generateId(),
    cs: {
      before: combinationAddonsBefore,
      after: combinationAddonsAfter,
      x: setAddonsBefore + setWidth + labelsWidth,
      y: combinationAddonsBefore,
      w: w - setWidth - labelsWidth,
      h: combinationHeight,
      addons: combinationAddons,
      addonPadding: combinationAddonPadding,
    },
    labels: {
      x: setAddonsBefore + setWidth,
      y: combinationAddonsBefore + combinationHeight,
      w: labelsWidth,
      h: h - combinationHeight,
    },
    sets: {
      before: setAddonsBefore,
      after: setAddonsAfter,
      x: setAddonsBefore,
      y: combinationAddonsBefore + combinationHeight,
      w: setWidth,
      h: h - combinationHeight,
      addons: setAddons,
      addonPadding: setAddonPadding,
    },
    padding: barPadding,
    legend: {
      x: width / 2,
    },
    margin: margin,
    w: width,
    h: height,
  };
}

export declare type UpSetSizeInfo = ReturnType<typeof deriveSizeDependent>;
