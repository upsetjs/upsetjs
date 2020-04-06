import { GenerateSetCombinationsOptions } from '@upsetjs/model';

export interface ISetRef {
  type: 'set' | string;
  index: number;
}

export interface IEmbeddedDumpSchema {
  name: string;
  description: string;
  author: string;

  elements: ReadonlyArray<number | string | any>;
  attrs: string[];

  sets: ReadonlyArray<{
    type: 'set';
    name: string;
    cardinality: number;
    elems: number[];
  }>;
  combinations: GenerateSetCombinationsOptions<any>;
  selection?: ISetRef;
  queries: { name: string; color: string; set: ISetRef }[];
  props: any;
  interactive: boolean;
}
