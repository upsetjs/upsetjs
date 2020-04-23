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
