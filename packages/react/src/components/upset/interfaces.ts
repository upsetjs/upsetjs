import type { IIntersectionSet, ISet } from '@upsetjs/model';

export declare type UpSetSelection = {
  onMouseEnter(selection: ISet<any> | IIntersectionSet<any>): (() => void) | undefined;
  onMouseLeave(selection: ISet<any> | IIntersectionSet<any>): (() => void) | undefined;
  onClick(selection: ISet<any> | IIntersectionSet<any>): (() => void) | undefined;
};
