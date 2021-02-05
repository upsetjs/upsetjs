import type { SetCombinationType } from '../model';

export interface IUpSetDumpRef {
  type: 'set' | SetCombinationType;
  index: number;
}
