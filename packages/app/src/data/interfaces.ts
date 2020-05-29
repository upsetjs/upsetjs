/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISets, ISetCombinations, GenerateSetCombinationsOptions, UpSetJSDumpProps } from '@upsetjs/react';

export declare type ICustomizeOptions = UpSetJSDumpProps;

export interface IAttrs {
  [key: string]: number;
}

export interface IElem {
  name: string;
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
  uid?: string;
  id: string;

  name: string;
  description: string;
  author: string;
  attrs: ReadonlyArray<string>;
  setCount?: number;

  creationDate?: Date;
  load(): Promise<ILoadedDataSet>;
}

export interface IDumpInfo {
  ds: IDataSet;
  sets: ISets<IElem>;
  elems: ReadonlyArray<IElem>;
  combinations: ISetCombinations<IElem>;
}
