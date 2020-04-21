import { IUpSetDump } from '@upsetjs/model';

export interface IEmbeddedDumpSchema extends IUpSetDump {
  name: string;
  description: string;
  author: string;

  elements: ReadonlyArray<number | string | any>;
  attrs: string[];
  props: any;
}
