/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

// import 'core-js/stable';
// import 'regenerator-runtime';
import {
  renderUpSetJS,
  UpSetProps,
  ISetLike,
  boxplotAddon,
  hydrateUpSetJS,
  fromDump,
  fromStaticDump,
} from '@upsetjs/bundle';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { IEmbeddedDumpSchema, IEmbeddedStaticDumpSchema, loadFile, uncompressElems } from './dump';

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

function isStaticDump(dump: IEmbeddedDumpSchema | IEmbeddedStaticDumpSchema): dump is IEmbeddedStaticDumpSchema {
  return typeof (dump as IEmbeddedStaticDumpSchema).overlaps !== 'undefined';
}

function showDump(dump: IEmbeddedDumpSchema | IEmbeddedStaticDumpSchema, hyrdateFirst = false) {
  const [custom, cinteractive] = customizeFromParams(true);
  const elems = isStaticDump(dump) ? [] : uncompressElems(dump!.elements, dump.attrs);
  const props: UpSetProps<any> = Object.assign(
    {
      id: 'upset',
      sets: [],
      width: root.clientWidth,
      height: root.clientHeight,
    },
    isStaticDump(dump) ? fromStaticDump(dump) : fromDump(dump!, elems, {}),
    dump!.props || {},
    custom,
    cinteractive
      ? {
          onHover: (s: ISetLike<any>) => {
            props.selection = s;
            render();
          },
        }
      : {},
    !isStaticDump(dump) && dump.attrs.length > 0
      ? {
          combinationAddons: dump.attrs.map((attr) =>
            boxplotAddon((v) => v.attrs[attr], elems, { orient: 'vertical', name: attr })
          ),

          setAddons: dump.attrs.map((attr) => boxplotAddon((v) => v.attrs[attr], elems, { name: attr })),
        }
      : {}
  );

  if (props.theme === 'dark') {
    makeDark();
  }
  document.title = `UpSet.js - ${dump.name}`;
  document.querySelector('title')!.textContent = `UpSet.js - ${dump.name}`;
  document.querySelector('meta[name=description]')!.setAttribute('content', dump.description);
  document.querySelector('meta[name=author]')!.setAttribute('content', dump.author);

  function render() {
    renderUpSetJS(root, props);
  }

  window.addEventListener('resize', () => {
    props.width = root.clientWidth;
    props.height = root.clientHeight;
    render();
  });

  if (hyrdateFirst) {
    hydrateUpSetJS(root, props);
  } else {
    root.innerHTML = '';
    render();
  }
}

function fromURLParam(): IEmbeddedDumpSchema | null {
  const params = new URLSearchParams(window.location.search);
  if (!params.has('p')) {
    return null;
  }
  try {
    const value = decompressFromEncodedURIComponent(params.get('p')!);
    return JSON.parse(value);
  } catch (e) {
    console.warn('cannot parse props argument: ', e);
    return null;
  }
}

function saveHTMLDump(dump: IEmbeddedDumpSchema | IEmbeddedStaticDumpSchema) {
  const s = document.createElement('script');
  s.textContent = `window.UPSET_DUMP = ${JSON.stringify(dump, null, 2)}`;
  document.body.insertAdjacentElement('afterbegin', s);
}

function fromHTMLFile(): IEmbeddedDumpSchema | IEmbeddedStaticDumpSchema {
  return (window as any).UPSET_DUMP || null;
}

{
  const p = new URLSearchParams(window.location.search);
  if (p.get('theme') === 'dark') {
    makeDark();
  }
}

function enableUpload(root: HTMLElement, onDump: (dump: IEmbeddedDumpSchema | IEmbeddedStaticDumpSchema) => void) {
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
      const dump: IEmbeddedDumpSchema | IEmbeddedStaticDumpSchema = evt.data;
      if (
        dump &&
        Array.isArray(dump.sets) &&
        ((!isStaticDump(dump) && Array.isArray(dump.elements)) ||
          (isStaticDump(dump) && Array.isArray(dump.combinations)))
      ) {
        saveHTMLDump(dump);
        showDump(dump);
      }
    },
    false
  );
};
