// import 'core-js/stable';
// import 'regenerator-runtime';
import { renderUpSet, UpSetProps, hydrateUpSet, ISetLike, generateCombinations, boxplotAddon } from '@upsetjs/bundle';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { IEmbeddedDumpSchema, loadDump, loadFile } from './dump';

const root = document.getElementById('app')! as HTMLElement;
Object.assign(root.style, {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
} as CSSStyleDeclaration);

function makeDark() {
  root.style.backgroundColor = '#303030';
}

function customizeFromParams(interactive: boolean) {
  const p = new URLSearchParams(window.location.search);
  const r: Partial<UpSetProps<any>> = {};

  if (p.has('theme')) {
    r.theme = p.get('theme') === 'dark' ? 'dark' : 'light';
  }
  if (p.has('static')) {
    interactive = false;
  } else if (p.has('interactive')) {
    interactive = p.get('interactive') === '' || Boolean(p.get('interactive'));
  }
  if (p.has('width')) {
    r.width = Number.parseInt(p.get('width')!, 10);
  }
  if (p.has('height')) {
    r.height = Number.parseInt(p.get('height')!, 10);
  }
  return [r, interactive];
}

function showDump(dump: IEmbeddedDumpSchema, hyrdateFirst = false) {
  const [custom, cinteractive] = customizeFromParams(dump.interactive);
  const props: UpSetProps<any> = Object.assign(
    {
      sets: [],
      width: root.clientWidth,
      height: root.clientHeight,
    },
    loadDump<UpSetProps<any>>(dump!, generateCombinations),
    custom,
    cinteractive
      ? {
          onHover: (s: ISetLike<any>) => {
            props.selection = s;
            render();
          },
        }
      : {},
    dump.attrs.length > 0
      ? {
          combinationAddons: dump.attrs.map((attr) =>
            boxplotAddon((v) => v.attrs[attr], dump.elements, { orient: 'vertical', name: attr })
          ),

          setAddons: dump.attrs.map((attr) => boxplotAddon((v) => v.attrs[attr], dump.elements, { name: attr })),
        }
      : {}
  );

  if (props.theme === 'dark') {
    makeDark();
  }
  document.title = `UpSet - ${dump.name}`;

  function render() {
    renderUpSet(root, props);
  }

  window.addEventListener('resize', () => {
    props.width = root.clientWidth;
    props.height = root.clientHeight;
    render();
  });

  if (hyrdateFirst) {
    hydrateUpSet(root, props);
  } else {
    root.innerHTML = '';
    render();
  }
}

function fromURLParam(): IEmbeddedDumpSchema | null {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('props')) {
    return null;
  }
  try {
    const value = decompressFromEncodedURIComponent(params.get('props')!);
    return JSON.parse(value);
  } catch (e) {
    console.warn('cannot parse props argument: ', e);
    return null;
  }
}

function saveHTMLDump(dump: IEmbeddedDumpSchema) {
  const s = document.createElement('script');
  s.textContent = `window.UPSET_DUMP = ${JSON.stringify(dump, null, 2)}`;
  document.body.insertAdjacentElement('afterbegin', s);
}

function fromHTMLFile(): IEmbeddedDumpSchema {
  return (window as any).UPSET_DUMP || null;
}

{
  const p = new URLSearchParams(window.location.search);
  if (p.get('theme') === 'dark') {
    makeDark();
  }
}

function enableUpload(root: HTMLElement, onDump: (dump: IEmbeddedDumpSchema) => void) {
  root.innerHTML = `
  <input type="file" accept="application/json,.json">
  `;

  root.querySelector('input')!.addEventListener('change', (evt) => {
    loadFile((evt.currentTarget as HTMLInputElement).files![0]).then((dump) => {
      onDump(dump);
    });
  });
  root.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  root.addEventListener('drop', (e) => {
    if (e.dataTransfer!.files!.length !== 1) {
      return;
    }
    e.preventDefault();
    loadFile(e.dataTransfer!.files![0]).then((dump) => {
      onDump(dump);
    });
  });
}

window.onload = () => {
  // cases 1. stored in gobal data object

  const urlDump = fromURLParam();
  if (urlDump) {
    saveHTMLDump(urlDump);
    showDump(urlDump);
    return;
  }
  const fileDump = fromHTMLFile();
  if (fileDump) {
    showDump(fileDump, true);
    return;
  }

  enableUpload(root, (dump) => {
    saveHTMLDump(dump);
    showDump(dump);
  });

  // show a loader and also wait for iframe messages
  window.addEventListener(
    'message',
    (evt) => {
      const dump: IEmbeddedDumpSchema = evt.data;
      if (dump && Array.isArray(dump.sets) && Array.isArray(dump.elements)) {
        showDump(dump);
      }
    },
    false
  );
};
