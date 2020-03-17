import { ISets } from '@upsetjs/model';
import simpsons from './simpsons';

export interface IDataSet {
  name: string;
  sets(): Promise<ISets<any>>;
}

export default [simpsons];
