export interface IGenerateOptions {
  width: number;
  height: number;
  labelHeight: number;
}

export function ranged<U>(count: number, cb: (i: number) => U) {
  return Array(count)
    .fill(0)
    .map((_, i) => cb(i));
}

export function generateLevels(numSets: number) {
  // all lines and the value is the thickness
  const lines = Array(Math.pow(2, numSets)).fill(0);
  ranged(numSets, (i) => {
    const shift = Math.pow(2, i);
    for (let i = 0; i < lines.length; i += shift) {
      lines[i]++;
    }
  });

  const levels: number[][] = ranged(Math.max(numSets, 1), () => []);
  lines.forEach((l, i) => {
    const level = Math.max(0, l - 1);
    // l -1 cause l is at least 1
    levels[level].push(i);
  });
  // push the last index to the last level
  levels[levels.length - 1].push(lines.length);
  return levels;
}

export function generate<S, C>(
  sets: readonly S[],
  cs: readonly C[],
  has: (cs: C, s: S) => boolean,
  options: IGenerateOptions
) {
  const { xBefore, yBefore, cell, hCells, vCells, horizontalSets, verticalSets } = bounds(sets.length, options);

  const s = setLabels(sets.length, options);

  const shifts = generateShiftLookup<S, C>(sets, hCells, vCells, has);

  const c = cs.map((c) => {
    const [i, j] = shifts.reduceRight((acc, s) => s(c, acc), [0, 0]);
    return {
      x: xBefore + i * cell,
      y: yBefore + j * cell,
    };
  });

  const hLevels = generateLevels(horizontalSets);
  const vLevels = generateLevels(verticalSets);

  return {
    s,
    c,
    cell,
    grid: {
      x: xBefore,
      y: yBefore,
      hCells,
      vCells,
      levels: hLevels.map((l, i) => ({
        x: l,
        y: i < vLevels.length ? vLevels[i] : [],
      })),
    },
  };
}

export function generateShiftLookup<S, C>(
  sets: readonly S[],
  hCells: number,
  vCells: number,
  has: (cs: C, s: S) => boolean
) {
  return sets.map((s, k) => {
    const index = Math.floor(k / 2);
    const hor = k % 2 === 0;
    const numLabels = Math.pow(2, index);
    const span = (hor ? hCells : vCells) / numLabels / 2;

    return (cs: C, [i, j]: [number, number]): [number, number] => {
      if (has(cs, s)) {
        return [i, j];
      }
      if (span > 1) {
        // flip previous and shift
        if (hor) {
          return [span - 1 - i + span, j];
        }
        return [i, span - 1 - j + span];
      }
      // shift only
      if (hor) {
        return [i + span, j];
      }
      return [i, j + span];
    };
  });
}

export function setLabels(sets: number, options: IGenerateOptions) {
  const { xOffset, yOffset, cell, xBefore, yBefore, hCells, vCells } = bounds(sets, options);

  const xAfterEnd = options.width - xOffset;
  const yAfterEnd = options.height - yOffset;

  return ranged(sets, (k) => {
    const index = Math.floor(k / 2);
    const hor = k % 2 === 0;
    const numLabels = Math.pow(2, index);
    const span = (hor ? hCells : vCells) / numLabels / 2;
    const xPos = hor ? xBefore : yBefore;

    const labels = [
      {
        v: true,
        x: xPos + span * cell * 0.5,
      },
      {
        v: false, // value
        x: xPos + span * cell * 1.5,
      },
    ];
    for (let i = 1; i <= index; i++) {
      // duplicate and mirror
      const offset = span * Math.pow(2, i) * cell;
      const l = labels.length - 1;
      labels.push(
        ...labels.map((li, i) => ({
          v: labels[l - i].v,
          x: li.x + offset,
        }))
      );
    }
    const inAfterGroup = index % 2 === 1;
    const withinGroupIndex = Math.floor(index / 2);

    let yPos = 0;
    if (inAfterGroup) {
      const end = hor ? yAfterEnd : xAfterEnd;
      yPos = end - options.labelHeight * (0.5 + withinGroupIndex);
    } else {
      const start = hor ? yOffset : xOffset;
      yPos = start + options.labelHeight * (0.5 + withinGroupIndex);
    }
    if (hor) {
      return {
        hor: true,
        span,
        text: labels.filter((d) => d.v).map((l) => ({ x: l.x, y: yPos })),
        notText: labels.filter((d) => !d.v).map((l) => ({ x: l.x, y: yPos })),
      };
    }
    return {
      hor: false,
      span,
      text: labels.filter((d) => d.v).map((l) => ({ x: yPos, y: l.x })),
      notText: labels.filter((d) => !d.v).map((l) => ({ x: yPos, y: l.x })),
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

  return { xOffset, horizontalSets, yOffset, verticalSets, cell, xBefore, yBefore, hCells, vCells };
}
