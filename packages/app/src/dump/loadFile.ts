/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { IUpSetJSDump } from '@upsetjs/react';

export function loadJSON(url: string): Promise<IUpSetJSDump> {
  return fetch(`https://cors-anywhere.herokuapp.com/${url}`).then((r) => r.json());
}

export default function loadFile(file: File) {
  return new Promise<IUpSetJSDump>((resolve, reject) => {
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
