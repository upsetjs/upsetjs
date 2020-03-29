import { parse } from 'papaparse';
import { IDataSet } from '../interfaces';
import { extractSets } from '../../../../model/dist';

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
  type: 'id' | 'string';
  index: number;
  mame: string;
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

async function listUpSetDatasets(file = `${baseUrlV1}/datasets.json`, baseUrl = baseUrlV1) {
  const dss: string[] = await fetchCors(file).then((r) => r.json());
  const datasets: IUpSetDataSet[] = await Promise.all(
    dss.map((d) => fetchCors(`${baseUrl}/${d}`).then((r) => r.json()))
  );
  datasets.forEach((ds) => {
    ds.file = ds.file.startsWith('https') ? ds.file : `${baseUrl}/${ds.file}`;
  });
  return datasets;
}

export async function listUpSet2Datasets() {
  const base = await listUpSetDatasets(`${baseUrlV2}/data/datasets.json`, baseUrlV2);
  const server = ((await fetch(baseServerUrl).then((r) => r.json())).datasets as IUpSetDataSet[]).filter(
    (d) => d.sets.length > 0
  );
  server.forEach((d) => (d.file = `${d.file}?alt=media`));
  return base.concat(server);
}

async function elementsFromDataset(ds: IUpSetDataSet) {
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
    return {
      name: row[idColumnIndex],
      sets,
    };
  });
}

function asDataSet(ds: IUpSetDataSet): IDataSet {
  let description = ds.description ?? '';
  if (ds.author) {
    description += ` by ${ds.author}`;
  }
  if (ds.source) {
    description += ` source: ${ds.source}`;
  }
  return {
    id: ds.name,
    name: ds.name,
    description,
    creationDate: new Date(),
    load: async () => {
      const elems = await elementsFromDataset(ds);
      let sets = extractSets(elems).slice();
      sets.sort((a, b) => b.cardinality - a.cardinality);
      if (sets.length > 5) {
        sets = sets.slice(0, 5);
      }
      return {
        sets,
        combinations: {
          type: 'intersection',
          order: 'cardinality',
          limit: 100,
        },
      };
    },
  };
}

export default function listDataSets() {
  return listUpSetDatasets().then((dss) => {
    return dss.map((ds) => asDataSet(ds));
  });
}
