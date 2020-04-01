import {
  ISets,
  UpSetSizeProps,
  UpSetStyleProps,
  ISetCombinations,
  GenerateSetCombinationsOptions,
} from '@upsetjs/react';

export declare type ICustomizeOptions = Omit<UpSetSizeProps, 'width' | 'height'> &
  Omit<UpSetStyleProps, 'exportButtons' | 'queryLegend'>;

export interface ILoadedDataSet {
  sets: ISets<any>;
  elems: ReadonlyArray<any>;
  combinations?: Partial<GenerateSetCombinationsOptions>;
  props?: ICustomizeOptions;
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

export interface IDumpInfo {
  ds: IDataSet;
  sets: ISets<any>;
  elems: ReadonlyArray<any>;
  combinations: ISetCombinations<any>;
}
