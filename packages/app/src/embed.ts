import 'core-js/stable';
import 'regenerator-runtime';
import { renderUpSet, UpSetProps, hydrateUpSet } from '@upsetjs/bundle';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { IEmbeddedDumpSchema } from './embed/interfaces';
import loadDump from './embed/loadDump';
import { enableUpload } from './embed/loadFile';

const root = document.getElementById('app')! as HTMLElement;
Object.assign(root.style, {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
} as CSSStyleDeclaration);

function customizeFromParams() {
  const p = new URLSearchParams(window.location.search);
  const r: Partial<UpSetProps<any>> = {};

  if (p.has('theme')) {
    r.theme = p.get('theme') === 'dark' ? 'dark' : 'light';
  }
  return r;
}

function showDump(dump: IEmbeddedDumpSchema, hyrdateFirst = false) {
  const props: UpSetProps<any> = Object.assign(
    {
      sets: [],
      width: root.clientWidth,
      height: root.clientHeight,
    },
    loadDump(dump!),
    customizeFromParams()
  );

  if (props.theme === 'dark') {
    root.style.backgroundColor = '#303030';
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
