import { UpSetDataProps, UpSetReactStyleProps, UpSetStyleProps } from '@upsetjs/react';

export declare type ILoadedDataSet = UpSetDataProps<any> & UpSetReactStyleProps & UpSetStyleProps;

export interface IDataSet {
  id: string;
  name: string;
  description: string;
  creationDate: Date;
  load(): Promise<ILoadedDataSet>;
}

export interface IStoredDataSet extends IDataSet {
  uid: number;
}
