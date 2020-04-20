import { generateCombinations, ISets, fromIndicesArray } from '@upsetjs/model';
import { IEmbeddedDumpSchema, ISetRef } from './interfaces';

interface IElem {
  name: string;
  attrs: { [key: string]: number };
}

export function compressElems(elems: ReadonlyArray<IElem>, attrs: string[], max = false) {
  return elems.map((elem) => {
    if (attrs.length === 0) {
      return elem.name;
    }
    if (max) {
      return [elem.name as string | number].concat(attrs.map((attr) => elem.attrs[attr]));
    }
    const r: any = { name: elem.name };
    attrs.forEach((attr) => (r[attr] = elem.attrs[attr]));
    return r;
  });
}

export function uncompressElems(elems: ReadonlyArray<any>, attrNames: string[]): IElem[] {
  return elems.map(
    (elem): IElem => {
      if (typeof elem === 'string' || typeof elem === 'number') {
        return { name: String(elem), attrs: {} };
      }
      const attrs: { [key: string]: number } = elem.attrs ?? {};
      if (Array.isArray(elem)) {
        // max compression mode
        attrNames.forEach((attr, i) => (attrs[attr] = elem[i + 1]));
        return { name: elem[0], attrs };
      }
      attrNames.forEach((attr) => {
        if (typeof elem[attr] !== 'undefined') {
          attrs[attr] = elem[attr];
        }
      });
      return { name: elem.name, attrs };
    }
  );
}

export default function loadDump<T>(
  dump: IEmbeddedDumpSchema,
  elems: ReadonlyArray<T>,
  gen: typeof generateCombinations
) {
  const sets: ISets<T> = dump.sets.map((set) =>
    Object.assign({}, set, {
      elems: fromIndicesArray(set.elems, elems),
    })
  );
  const combinations = gen(
    sets,
    Object.assign(
      {
        elems,
      },
      dump.combinations
    )
  );

  function fromSetRef(ref: ISetRef) {
    if (ref.type === 'set') {
      return sets[ref.index];
    }
    return combinations[ref.index];
  }
  const selection = dump.selection ? fromSetRef(dump.selection) : null;
  const queries = dump.queries.map((q) =>
    Object.assign(q, {
      set: fromSetRef(q.set),
    })
  );
  return {
    selection,
    queries,
    sets,
    combinations,
  };
}
