import 'core-js/stable';
import 'regenerator-runtime';
import { renderUpSet, UpSetProps, generateCombinations, ISet } from '@upsetjs/bundle';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { IEmbeddedDumpSchema, ISetRef } from './embed/interfaces';

const root = document.getElementById('app')! as HTMLElement;
Object.assign(root.style, {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
} as CSSStyleDeclaration);

function showError(error: string) {
  root.innerHTML = error;
}

function postProcess(args: IEmbeddedDumpSchema): UpSetProps<any> {
  const elems = args.elements;
  const byIndex = (v: number) => elems[v];

  const sets = args.sets.map((set) => {
    (set.elems as any[]) = set.elems.map(byIndex);
    return set as ISet<any>;
  });
  const combinations = generateCombinations(sets, {
    ...args.combinations,
    elems,
  });

  function fromSetRef(ref: ISetRef) {
    if (ref.type === 'set') {
      return sets[ref.index];
    }
    return combinations[ref.index];
  }
  const selection = args.selection ? fromSetRef(args.selection) : null;
  const queries = args.queries.map((q) =>
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
    args.props
  );
}

function run() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('props')) {
    return showError('<strong>missing query parameter:</strong><code>props</code><p>');
  }

  let args: IEmbeddedDumpSchema | null = null;
  try {
    const value = decompressFromEncodedURIComponent(params.get('props')!);
    args = JSON.parse(value);
  } catch (e) {
    return showError(`<strong>parsing error when parsing query parameter props</strong><pre>${e}</pre>`);
  }
  const props: UpSetProps<any> = Object.assign(
    {
      sets: [],
      width: root.clientWidth,
      height: root.clientHeight,
    },
    postProcess(args!)
  );

  if (props.theme === 'dark') {
    root.style.backgroundColor = '#303030';
  }
  document.title = args.name;

  function render() {
    renderUpSet(root, props);
  }

  window.addEventListener('resize', () => {
    props.width = root.clientWidth;
    props.height = root.clientHeight;
    render();
  });

  render();
}

window.onload = run;
