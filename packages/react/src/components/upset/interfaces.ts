import { ISetLike } from '@upsetjs/model';

export declare type UpSetSelection = {
  onMouseEnter(selection: ISetLike<any>): (() => void) | undefined;
  onMouseLeave(selection: ISetLike<any>): (() => void) | undefined;
  onClick(selection: ISetLike<any>): (() => void) | undefined;
};

export declare type BandScaleLike = {
  (v: string): number | undefined;

  bandwidth(): number;
  domain(): string[];
  range(): number[];
  round(): boolean;
};

export declare type NumericScaleLike = {
  (v: number): number;
  ticks(): number[];
  tickFormat(): (v: number) => string;
  range(): number[];
};
