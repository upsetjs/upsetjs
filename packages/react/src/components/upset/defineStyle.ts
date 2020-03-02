export default function defineStyle(size: {
  width: number;
  height: number;
  margin: number;
  barPadding: number;
  widthRatios: [number, number, number];
  heightRatios: [number, number];
}) {
  return {
    combinations: {
      w: (size.width - 2 * size.margin) * size.widthRatios[2],
      h: (size.height - 2 * size.margin - 20) * size.heightRatios[0],
    },
    labels: { w: (size.width - 2 * size.margin) * size.widthRatios[1] },
    sets: {
      w: (size.width - 2 * size.margin) * size.widthRatios[0],
      h: (size.height - 2 * size.margin - 20) * size.heightRatios[1],
    },
    padding: size.barPadding,
  };
}

export declare type UpSetStyles = ReturnType<typeof defineStyle>;
