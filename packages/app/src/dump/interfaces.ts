/**
 * @upsetjs/app
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { IUpSetDump, IUpSetStaticDump } from '@upsetjs/model';

export interface IEmbeddedDumpSchema extends IUpSetDump {
  name: string;
  description: string;
  author: string;

  elements: ReadonlyArray<number | string | any>;
  attrs: string[];
  props: any;
}

export interface IEmbeddedStaticDumpSchema extends IUpSetStaticDump {
  name: string;
  description: string;
  author: string;
  props: any;
}
