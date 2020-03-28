export default function defineStyle(size: {
  width: number;
  height: number;
  margin: number;
  barPadding: number;
  widthRatios: [number, number, number];
  heightRatios: [number, number];
  queryLegendWidth: number;
}) {
  const h = size.height - 2 * size.margin - 20;
  const w = size.width - 2 * size.margin;
  return {
    combinations: {
      w: w * size.widthRatios[2],
      h: h * size.heightRatios[0],
    },
    labels: { w: w * size.widthRatios[1] },
    sets: {
      w: w * size.widthRatios[0],
      h: h * size.heightRatios[1],
    },
    padding: size.barPadding,
    legend: {
      x: size.width - size.margin - size.queryLegendWidth,
    },
    margin: size.margin,
    w: size.width,
    h: size.height,
  };
}

export declare type UpSetStyles = ReturnType<typeof defineStyle>;
