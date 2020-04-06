export declare type SetOverlap = {
  setA: number;
  setB: number;
  union: number;
  intersection: number;
};

export declare type SetElemOverlap<T> = {
  setA: ReadonlyArray<T>;
  setB: ReadonlyArray<T>;
  union: ReadonlyArray<T>;
  intersection: ReadonlyArray<T>;
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
  return Object.assign({}, r, {
    setA: r.setB,
    setB: r.setA,
  });
}

export function setElemOverlapFactory<T>(a: Set<T> | ReadonlyArray<T>) {
  const elems = a instanceof Set ? a : new Set(a);
  const setA = Array.isArray(a) ? a : Array.from(a);
  const same: SetElemOverlap<T> = {
    setA,
    setB: setA,
    union: setA,
    intersection: setA,
  };

  return (b: Set<T> | ReadonlyArray<T>): SetElemOverlap<T> => {
    if (b === a) {
      return same;
    }
    const intersection: T[] = [];
    const union: T[] = setA.slice();
    b.forEach((e: T) => {
      if (elems.has(e)) {
        intersection.push(e);
      } else {
        union.push(e);
      }
    });
    return {
      setA: setA,
      setB: Array.isArray(b) ? b : Array.from(b),
      intersection,
      union,
    };
  };
}

export function setElemOverlap<T>(a: Set<T> | ReadonlyArray<T>, b: Set<T> | ReadonlyArray<T>) {
  if (len(a) < len(b) || a instanceof Set) {
    return setElemOverlapFactory(a)(b);
  }
  const r = setElemOverlapFactory(b)(a);
  // swap back
  return Object.assign({}, r, {
    setA: r.setB,
    setB: r.setA,
  });
}
