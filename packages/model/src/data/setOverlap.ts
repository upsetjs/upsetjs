export declare type SetOverlap = {
  setA: number;
  setB: number;
  union: number;
  intersection: number;
};

function len<T>(a: Set<T> | ReadonlyArray<T>) {
  return a instanceof Set ? a.size : a.length;
}

export function setOverlapFactory<T>(a: Set<T> | ReadonlyArray<T>) {
  const elems = a instanceof Set ? a : new Set(a);
  const setA = elems.size;
  const same: SetOverlap = {
    setA,
    setB: setA,
    union: setA,
    intersection: setA,
  };

  return (b: Set<T> | ReadonlyArray<T>): SetOverlap => {
    if (b === a) {
      return same;
    }
    let intersection = 0;
    b.forEach((e: T) => {
      if (elems.has(e)) {
        intersection++;
      }
    });
    const setB = len(b);
    return {
      setA,
      setB,
      intersection,
      union: setA + setB - intersection,
    };
  };
}

export default function setOverlap<T>(a: Set<T> | ReadonlyArray<T>, b: Set<T> | ReadonlyArray<T>) {
  if (len(a) < len(b) || a instanceof Set) {
    return setOverlapFactory(a)(b);
  }
  const r = setOverlapFactory(b)(a);
  // swap back
  return {
    ...r,
    setA: r.setB,
    setB: r.setA,
  };
}
