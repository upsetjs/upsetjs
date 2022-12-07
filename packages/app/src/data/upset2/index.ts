/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import { parse } from 'papaparse';
import type { IDataSet, IElem, IAttrs } from '../interfaces';
import { extractSets } from '@upsetjs/model';

function fetchCors(url: string) {
  return fetch(`https://get-to-post.vercel.app/api/get-to-get?url=${encodeURIComponent(url)}`);
}

const baseUrlV1 = 'https://vcg.github.io/upset/';
const baseUrlV2 = 'https://vdl.sci.utah.edu/upset2';
const baseServerUrl = 'https://us-central1-upset2-eaf80.cloudfunctions.net/api/datasets';

interface ISetSpec {
  format: 'binary';
  start: number;
  end: number;
}

interface IMetaSpec {
  type: 'id' | 'string' | 'float' | 'integer';
  index: number;
  name: string;
}

export interface IUpSetDataSet {
  name: string;
  author?: string;
  description?: string;
  source?: string;

  skip: number;
  header: number;

  file: string;
  meta: IMetaSpec[];
  separator: string;
  sets: ISetSpec[];
}

function toID(name: string) {
  return name
    .replace(/[(); \-{}~%$^&@#]+/g, ' ')
    .trim()
    .split(' ')
    .map((s) => s.slice(0, 2))
    .join('');
}

function asDataSet(ds: IUpSetDataSet): IDataSet {
  return {
    id: toID(ds.name),
    name: ds.name,
    description: ds.description ?? '',
    author: ds.author ?? '',
    attrs: ds.meta.filter((d) => d.type === 'float' || d.type === 'integer').map((d) => d.name),
    setCount: ds.sets.length > 0 ? ds.sets[0].end - ds.sets[0].start + 1 : undefined,
    load: async () => {
      const elems = await elementsFromDataset(ds);
      const sets = extractSets(elems);
      return {
        elems,
        sets,
      };
    },
  };
}

export async function listUpSetDatasets(file = `${baseUrlV1}/datasets.json`, baseUrl = baseUrlV1) {
  const dss: string[] = await fetchCors(file).then((r) => r.json());
  return dss.map((d) =>
    fetchCors(`${baseUrl}/${d}`)
      .then((r) => r.json())
      .then((ds) => {
        ds.file = ds.file.startsWith('https') ? ds.file : `${baseUrl}/${ds.file}`;
        return asDataSet(ds);
      })
  );
}

export async function listUpSetServiceDatasets() {
  const server = ((await fetch(baseServerUrl).then((r) => r.json())).datasets as IUpSetDataSet[]).filter(
    (d) => d.sets.length > 0
  );
  return server.map((d) => {
    d.file = `${d.file}?alt=media`;
    return asDataSet(d);
  });
}

export function listUpSet2Datasets() {
  return listUpSetDatasets(`${baseUrlV2}/data/datasets.json`, baseUrlV2);
}

async function elementsFromDataset(ds: IUpSetDataSet): Promise<ReadonlyArray<IElem & { sets: string[] }>> {
  const rawText = await fetchCors(ds.file).then((r) => r.text());
  const csv = parse(rawText, {
    delimiter: ds.separator,
    skipEmptyLines: true,
  });
  const set = { start: ds.sets[0].start, end: ds.sets[0].end + 1 };
  const idColumnIndex = ds.meta.find((d) => d.type === 'id')?.index ?? 0;

  const raw = csv.data as string[][];
  const header = raw[ds.skip + ds.header];
  const data = raw.slice(ds.skip + ds.header + 1);

  const setNames = header.slice(set.start, set.end);
  return data.map((row) => {
    // find the indices of the sets this element is part of
    const sets = row
      .slice(set.start, set.end)
      .map((v, i) => [v, setNames[i]])
      .filter(([v, _]) => v === '1')
      .map(([_, s]) => s);
    const attrs: IAttrs = {};
    ds.meta
      .filter((d) => d.type === 'float' || d.type === 'integer')
      .forEach((d) => {
        attrs[d.name] = Number.parseFloat(row[d.index]);
      });
    return {
      name: row[idColumnIndex],
      sets,
      attrs,
    };
  });
}
