import { generateCombinations, ISets, fromIndicesArray } from '@upsetjs/model';
import { IEmbeddedDumpSchema, ISetRef } from './interfaces';

export default function loadDump<T>(dump: IEmbeddedDumpSchema, gen: typeof generateCombinations): T {
  const elems = dump.elements;

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
  return Object.assign(
    {
      sets,
      combinations,
      selection,
      queries,
    },
    dump.props
  );
}
