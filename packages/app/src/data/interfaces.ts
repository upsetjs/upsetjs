import { ISets } from '@upsetjs/model';

export interface IDataSet {
  id: string;
  name: string;
  description: string;
  creationDate: Date;
  sets(): Promise<ISets<any>>;
}

export interface IStoredDataSet extends IDataSet {
  uid: number;
}
