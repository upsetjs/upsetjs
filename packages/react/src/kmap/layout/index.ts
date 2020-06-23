export interface IGenerateOptions {
  width: number;
  height: number;
  labelHeight: number;
}

function range<U>(count: number, cb: (i: number) => U) {
  return Array(count)
    .fill(0)
    .map((_, i) => cb(i));
}

export function generate<S, C>(
  sets: readonly S[],
  cs: readonly C[],
  has: (cs: C, s: S) => boolean,
  options: IGenerateOptions
) {
  const { xBefore, yBefore, cell } = bounds(sets.length, options);

  const s = setLabels(sets.length, options);

  const c = cs.map((c) => {
    let i = 0;
    let j = 0;
    sets.forEach((s, k) => {
      if (has(c, s)) {
        return; // no shift
      }
      const inverseK = sets.length - 1 - k;
      const index = Math.pow(2, Math.floor(inverseK / 2));
      if (k % 2 === 0) {
        i += index;
      } else {
        j += index;
      }
    });

    return {
      x: xBefore + i * cell + cell / 2,
      y: yBefore + j * cell + cell / 2,
    };
  });

  return { s, c, cell };
}

export function setLabels(sets: number, options: IGenerateOptions) {
  const { xOffset, horizontalSets, yOffset, verticalSets, cell, xBefore, yBefore } = bounds(sets, options);

  const xAfterEnd = options.width - xOffset;
  const yAfterEnd = options.height - yOffset;

  return range(sets, (k) => {
    const index = Math.floor(k / 2);
    const hor = k % 2 === 0;
    const numLabels = Math.pow(2, index);
    const offset = cell * Math.pow(2, (hor ? horizontalSets : verticalSets) - index);
    const xPos = hor ? xBefore : yBefore;
    const text = range(numLabels, (i) => xPos + (i + 0.25) * offset);
    const notText = range(numLabels, (i) => xPos + (i + 0.75) * offset);

    let yPos = 0;
    const after = index % 2 === 1;
    const withinGroupIndex = Math.floor(index / 2);
    if (after) {
      const end = hor ? yAfterEnd : xAfterEnd;
      yPos = end - options.labelHeight * (0.5 + withinGroupIndex);
    } else {
      const start = hor ? yOffset : xOffset;
      yPos = start + options.labelHeight * (0.5 + withinGroupIndex);
    }
    if (hor) {
      return {
        hor: true,
        text: text.map((x) => ({ x, y: yPos })),
        notText: notText.map((x) => ({ x, y: yPos })),
      };
    }
    return {
      hor: false,
      text: text.map((y) => ({ x: yPos, y })),
      notText: notText.map((y) => ({ x: yPos, y })),
    };
  });
}

export function bounds(sets: number, options: IGenerateOptions) {
  const horizontalSets = Math.ceil(sets / 2);
  const verticalSets = Math.floor(sets / 2);

  const hCells = Math.pow(2, horizontalSets);
  const vCells = Math.pow(2, verticalSets);

  const cell = Math.floor(
    Math.min(
      (options.width - options.labelHeight * verticalSets) / hCells,
      (options.height - options.labelHeight * horizontalSets) / vCells
    )
  );
  const xOffset = (options.width - hCells * cell - options.labelHeight * verticalSets) / 2;
  const yOffset = (options.height - vCells * cell - options.labelHeight * horizontalSets) / 2;

  const xBefore = xOffset + Math.ceil(verticalSets / 2) * options.labelHeight;
  const yBefore = yOffset + Math.ceil(horizontalSets / 2) * options.labelHeight;

  return { xOffset, horizontalSets, yOffset, verticalSets, cell, xBefore, yBefore };
}
