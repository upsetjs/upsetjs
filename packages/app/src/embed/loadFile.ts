import { IEmbeddedDumpSchema } from './interfaces';

function loadFile(file: File) {
  return new Promise<IEmbeddedDumpSchema>((resolve, reject) => {
    const r = new FileReader();
    r.addEventListener('load', () => {
      const data = JSON.parse(r.result as string);
      resolve(data);
    });
    r.addEventListener('error', () => {
      reject(r.error);
    });
    r.readAsText(file);
  });
}

export function enableUpload(root: HTMLElement, onDump: (dump: IEmbeddedDumpSchema) => void) {
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
