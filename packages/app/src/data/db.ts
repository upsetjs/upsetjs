/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type Dexie from 'dexie';
import type { IDataSet } from './interfaces';
import { toEmbeddedDump } from './shareEmbedded';
import { fromDump } from './exportJSON';
import type Store from '../store/Store';
import type { IUpSetJSDump } from '@upsetjs/react';

const SCHEMA_VERSION = 1;

export interface IStoredDump extends IUpSetJSDump {
  uid?: string;
  creationDate: number;
}

declare type UpSetJSDB = Dexie & {
  datasets: Dexie.Table<IStoredDump, number>;
};

let db: UpSetJSDB | null = null;

function getDB(): Promise<UpSetJSDB> {
  if (db) {
    return Promise.resolve(db);
  }
  return import('dexie')
    .then((dexie) => {
      //
      // Declare Database
      //
      class UpSetJSDBImpl extends dexie.default {
        datasets: Dexie.Table<IStoredDump, number>;

        constructor() {
          super('UpSet.js App DB');
          this.version(SCHEMA_VERSION).stores({
            datasets: '++uid,id,name,creationDate',
          });
          // hack for linting
          this.datasets = (this as any).datasets || undefined;
        }
      }

      return new UpSetJSDBImpl();
    })
    .then((impl) => (db = impl));
}

function asDataSet(dump: IStoredDump): IDataSet {
  const d = fromDump(dump, String(dump.uid!));
  d.uid = dump.uid!;
  d.creationDate = new Date(dump.creationDate);
  return d;
}

function byCreationDate(arr: IStoredDump[]) {
  return arr.sort((a, b) => b.creationDate - a.creationDate);
}

export function listLocal(): Promise<IDataSet[]> {
  return getDB()
    .then((db) => db.datasets.toArray())
    .then(byCreationDate)
    .then((d) => d.map(asDataSet));
}

export function deleteLocal(dataset: IDataSet): Promise<any> {
  return getDB().then((db) =>
    db.transaction('rw', db.datasets, () => Promise.all([db.datasets.where('uid').equals(dataset.uid!).delete()]))
  );
}

export function saveLocal(store: Store): Promise<IDataSet> {
  const dump: IStoredDump = Object.assign(
    {
      creationDate: Date.now(),
    },
    toEmbeddedDump(store, { all: true })
  );
  dump.name = `${dump.name} - Local`;
  return getDB()
    .then((db) => db.datasets.add(dump))
    .then((uid) => asDataSet(Object.assign(dump, { uid })));
}
