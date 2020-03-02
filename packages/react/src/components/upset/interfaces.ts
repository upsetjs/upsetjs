import type { ISetLike } from '@upsetjs/model';

export declare type UpSetSelection = {
  onMouseEnter(selection: ISetLike<any>): (() => void) | undefined;
  onMouseLeave(selection: ISetLike<any>): (() => void) | undefined;
  onClick(selection: ISetLike<any>): (() => void) | undefined;
};
