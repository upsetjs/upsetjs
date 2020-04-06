import { ISetLike } from '@upsetjs/model';

export declare type UpSetSelection = {
  onMouseEnter(selection: ISetLike<any>): (() => void) | undefined;
  onMouseLeave: (() => void) | undefined;
  onClick(selection: ISetLike<any>): (() => void) | undefined;
};
