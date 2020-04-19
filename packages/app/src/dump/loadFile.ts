import { IEmbeddedDumpSchema } from './interfaces';

export function loadJSON(url: string): Promise<IEmbeddedDumpSchema> {
  const p = fetch(url).then((r) => r.json());
  return new Promise<IEmbeddedDumpSchema>((resolve, reject) => {
    p.then(resolve);
    p.catch(() => {
      // try again with cors wrapper
      fetch(`https://cors-anywhere.herokuapp.com/${url}`)
        .then((r) => r.json())
        .then(resolve, reject);
    });
  });
}

export default function loadFile(file: File) {
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
