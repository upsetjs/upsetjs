import { UpSetAddon } from '../config';

export default function defineStyle(size: {
  styleId: string;
  sizeId: string;
  width: number;
  height: number;
  margin: number;
  barPadding: number;
  widthRatios: [number, number, number];
  heightRatios: [number, number];
  setAddons: ReadonlyArray<UpSetAddon<any, any>>;
  combinationAddons: ReadonlyArray<UpSetAddon<any, any>>;
}) {
  const setAddonsBefore = size.setAddons.reduce((acc, a) => acc + (a.position === 'before' ? a.size : 0), 0);
  const setAddonsAfter = size.setAddons.reduce((acc, a) => acc + (a.position !== 'before' ? a.size : 0), 0);
  const combnationAddonsBefore = size.combinationAddons.reduce(
    (acc, a) => acc + (a.position === 'before' ? a.size : 0),
    0
  );
  const combinationAddonsAfter = size.combinationAddons.reduce(
    (acc, a) => acc + (a.position !== 'before' ? a.size : 0),
    0
  );
  const h = size.height - 2 * size.margin - 20 - combinationAddonsAfter - combnationAddonsBefore;
  const w = size.width - 2 * size.margin - setAddonsBefore - setAddonsAfter;

  const setWidth = w * size.widthRatios[0];
  const labelsWidth = w * size.widthRatios[1];
  const combinationHeight = h * size.heightRatios[0];
  return {
    styleId: size.styleId,
    sizeId: size.sizeId,
    combinations: {
      before: combnationAddonsBefore,
      after: combinationAddonsAfter,
      x: setAddonsBefore + setWidth + labelsWidth,
      y: combnationAddonsBefore,
      w: w - setWidth - labelsWidth,
      h: combinationHeight,
    },
    labels: {
      x: setAddonsBefore + setWidth,
      y: combnationAddonsBefore + combinationHeight,
      w: labelsWidth,
      h: h - combinationHeight,
    },
    sets: {
      before: setAddonsBefore,
      after: setAddonsAfter,
      x: setAddonsBefore,
      y: combnationAddonsBefore + combinationHeight,
      w: setWidth,
      h: h - combinationHeight,
    },
    padding: size.barPadding,
    legend: {
      x: size.width / 2,
    },
    margin: size.margin,
    w: size.width,
    h: size.height,
  };
}

export declare type UpSetStyles = ReturnType<typeof defineStyle>;
