/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISets, ISetCombinations, GenerateSetCombinationsOptions, UpSetJSDumpProps } from '@upsetjs/react';

export interface ICustomizeOptions extends Omit<UpSetJSDumpProps, 'width' | 'height'> {}

export interface IAttrs {
  [key: string]: number;
}

export interface IElem {
  name: string;
  attrs: IAttrs;
}

export declare type IElems = readonly IElem[];

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
  attrs: readonly string[];
  setCount?: number;

  creationDate?: Date;
  load(): Promise<ILoadedDataSet>;
}

export interface IDumpInfo {
  ds: IDataSet;
  sets: ISets<IElem>;
  elems: IElems;
  combinations: ISetCombinations<IElem>;
}
