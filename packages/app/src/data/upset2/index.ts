import { parse } from 'papaparse';
import { IDataSet, IElems, IAttrs } from '../interfaces';
import { extractSets } from '@upsetjs/model';

function fetchCors(url: string) {
  const u = new URL(url);
  return fetch(`https://cors-anywhere.herokuapp.com/${url}`, {
    headers: {
      Origin: `${u.protocol}://${u.hostname}`,
    },
  });
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

function asDataSet(ds: IUpSetDataSet): IDataSet {
  return {
    id: ds.name,
    name: ds.name,
    description: ds.description ?? '',
    author: ds.author ?? '',
    attrs: ds.meta.filter((d) => d.type === 'float' || d.type === 'integer').map((d) => d.name),
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

async function elementsFromDataset(ds: IUpSetDataSet): Promise<IElems> {
  const rawText = await fetch(ds.file).then((r) => r.text());
  const csv = parse(rawText, {
    delimiter: ds.separator,
  });
  const set = { start: ds.sets[0].start, end: ds.sets[0].end };
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
