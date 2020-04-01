import 'core-js/stable';
import 'regenerator-runtime';
import { renderUpSet, UpSetProps } from '@upsetjs/bundle';
import { decompressFromEncodedURIComponent } from 'lz-string';

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

function postProcess(args: Partial<UpSetProps<any> & { elems: any[] }>) {
  const elems = args.elems ?? [];
  const sets = args.sets ?? [];
  const byIndex = (v: number) => elems[v];

  for (const set of sets) {
    (set.elems as any[]) = set.elems.map(byIndex);
  }
  if (Array.isArray(args.combinations)) {
  }
  return args;
}

function run() {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('props')) {
    return showError('<strong>missing query parameter</strong>: <code>props</code><p>');
  }

  let args: Partial<UpSetProps<any> & { elems: any[] }> = {};
  try {
    const value = decompressFromEncodedURIComponent(params.get('props')!);
    args = JSON.parse(value);
  } catch (e) {
    return showError(`<strong>parsing error when parsing query parameter props</strong><pre>${e}</pre>`);
  }
  args = postProcess(args);

  const props: UpSetProps<any> = Object.assign(
    {
      sets: [],
      width: root.clientWidth,
      height: root.clientHeight,
    },
    args
  );

  function render() {
    renderUpSet(root, props);
  }

  window.addEventListener('resize', () => {
    props.width = root.clientWidth;
    props.height = root.clientHeight;
    render();
  });
}

window.onload = run;
