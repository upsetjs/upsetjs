import {
  ISets,
  UpSetSizeProps,
  UpSetStyleProps,
  ISetCombinations,
  GenerateSetCombinationsOptions,
} from '@upsetjs/react';

export declare type ICustomizeOptions = Omit<UpSetSizeProps, 'width' | 'height'> &
  Omit<UpSetStyleProps, 'exportButtons' | 'queryLegend'>;

export interface IAttrs {
  [key: string]: number;
}

export interface IElem {
  name: string;
  sets: string[];
  attrs: IAttrs;
}

export declare type IElems = ReadonlyArray<IElem>;

export interface ILoadedDataSet {
  sets: ISets<IElem>;
  elems: IElems;
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
}

export interface IStoredDataSet extends IDataSet {
  uid: number;
  creationDate: Date;
}

export interface IDumpInfo {
  ds: IDataSet;
  sets: ISets<IElem>;
  elems: ReadonlyArray<IElem>;
  combinations: ISetCombinations<IElem>;
}
