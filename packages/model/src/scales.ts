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

export declare type NumericScaleFactory = {
  (domain: [number, number], range: [number, number]): NumericScaleLike;
};
export declare type BandScaleFactory = {
  (domain: string[], range: [number, number], padding: number): BandScaleLike;
};
