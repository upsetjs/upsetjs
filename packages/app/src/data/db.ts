import Dexie from 'dexie';
import { IDataSet, IStoredDataSet } from './interfaces';

const SCHEMA_VERSION = 1;

//
// Declare Database
//
class UpSetJSDB extends Dexie {
  datasets: Dexie.Table<IStoredDataSet, number>;

  constructor() {
    super('UpSet.js App DB');
    this.version(SCHEMA_VERSION).stores({
      datasets: '++uid,id,name,creationDate',
    });
    // hack for linting
    this.datasets = (this as any).datasets || undefined;
  }
}

const db = new UpSetJSDB();

export function storeDataset(dataset: IDataSet): Promise<IStoredDataSet> {
  const copy = Object.assign({}, dataset);
  return db.datasets.add(copy as any).then((uid) => Object.assign(dataset, { uid }));
}

export function editDataset(dataset: IStoredDataSet): Promise<IStoredDataSet> {
  return db.datasets
    .update(dataset.uid, {
      name: dataset.name,
      description: dataset.description,
      author: dataset.author,
    })
    .then(() => dataset);
}

function byCreationDate(arr: IStoredDataSet[]) {
  for (const entry of arr) {
    entry.creationDate = entry.creationDate instanceof Date ? entry.creationDate : new Date(entry.creationDate);
  }
  return arr.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
}

export function listDatasets(): Promise<IStoredDataSet[]> {
  return db.datasets.toArray().then(byCreationDate);
}

export function deleteDataset(dataset: IStoredDataSet): Promise<any> {
  return db.transaction('rw', db.datasets, () => Promise.all([db.datasets.where('uid').equals(dataset.uid).delete()]));
}
