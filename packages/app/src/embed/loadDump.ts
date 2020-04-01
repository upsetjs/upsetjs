import { UpSetProps, generateCombinations, ISet } from '@upsetjs/bundle';
import { IEmbeddedDumpSchema, ISetRef } from './interfaces';

export default function loadDump(dump: IEmbeddedDumpSchema): UpSetProps<any> {
  const elems = dump.elements;
  const byIndex = (v: number) => elems[v];

  const sets = dump.sets.map((set) => {
    (set.elems as any[]) = set.elems.map(byIndex);
    return set as ISet<any>;
  });
  const combinations = generateCombinations(
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
