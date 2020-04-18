import { ISetLike } from '@upsetjs/model';

export declare type UpSetSelection = {
  onMouseEnter(selection: ISetLike<any>): ((evt: React.MouseEvent) => void) | undefined;
  onMouseLeave: ((evt: React.MouseEvent) => void) | undefined;
  onClick(selection: ISetLike<any>): ((evt: React.MouseEvent) => void) | undefined;
};
