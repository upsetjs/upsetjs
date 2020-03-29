import { ISets, UpSetReactStyleProps, UpSetStyleProps } from '@upsetjs/react';

export interface ILoadedDataSet {
  sets: ISets<any>;
  props: UpSetReactStyleProps & UpSetStyleProps;
}

export interface IDataSet {
  id: string;

  name: string;
  description: string;
  author: string;

  creationDate?: Date;
  load(): Promise<ILoadedDataSet>;
  // TODO export
}

export interface IStoredDataSet extends IDataSet {
  uid: number;
  creationDate: Date;
}
